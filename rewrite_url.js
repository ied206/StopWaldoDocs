function setTabUrl(tabId, newUrl) {
    // If the URL is known machine-translated docs, rewrite the URL into its english counterpart
    var updating = browser.tabs.update(tabId, {
        "url": newUrl,
    }); // return Promise
    updating.then((tab) => { 
        console.log("[SUCCESS] " + newUrl);
    }, () => {
        console.log("[FAIL] " + newUrl);
    });
}

function rewriteTabUrl(tabId, url) {
    // If url is valid?
    if (url === null)
        return;

    // Search sites array for matched string
    const target = sites.find(s => s.testUrl(url));
    if (target === undefined)
        return;

    // Convert machine-translated url into the english url
    const newUrl = target.convertUrl(url);
    if (newUrl === null)
        return;

    // Update tab url
    console.log("[OLD URL] " + url);
    setTabUrl(tabId, newUrl);
    console.log("[NEW URL] " + newUrl);
};

// A tab was updated, 
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Run a listener only if tab's url was updated
    if (!changeInfo.url) {
        return;
    }
    rewriteTabUrl(tabId, tab.url);
});
