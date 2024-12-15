chrome.omnibox.onInputEntered.addListener(async (input, disposition) => {
    const domain = input.split(".")[0];
    const tld = input.split(".")[1];

    // Check if domain is registered on snoop.id dashboard
    try {
        const req = await fetch(
            `https://snoop.id/api/domains/${domain}.${tld}`
        );
        var metadata = await req.json();
    } catch (e) {
        console.log(e);
    }

    if (metadata?.redirect_url) {
        // If domain is registered, redirect
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, {
                    url: metadata.redirect_url,
                });
            }
        });
    } else {
        // If domain is not registered, search on snoop.id dashboard
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, {
                    url: `https://snoop.id/search/${input}`,
                });
            }
        });
    }
});
