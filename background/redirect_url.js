"use strict";

function setTabUrl(tabId, newUrl) {
    // If the URL is known machine-translated docs, rewrite the URL into its english counterpart
    browser.tabs.update(tabId, {
        "url": newUrl,
    }).then((tab) => { 
        console.log("[SUCCESS] " + newUrl);
    }); 
}

function runContentScript(tabId) {
    // Load two javascripts
    return browser.tabs.executeScript(tabId, {
        file: "/const.js"
    }).then(() => {
        return browser.tabs.executeScript(tabId, {
            file: "/content/detect_mt.js"
        });
    });
}

function tryRedirectTab(tabId, url) {
    // If url is valid?
    if (url === null)
        return;

    // Is the url registered in sites array?
    const target = sites.find(s => s.regExp.test(url) === true);
    if (target === undefined)
        return;

    // Check if the page is really machine-translated (pass and read a message from content script)
    runContentScript(tabId).then(() => {
        let msg = {
            type: CHECK_REQUEST,
            tabId: tabId,
            url: url,
            req: target,
        };
        browser.tabs.sendMessage(tabId, msg);
    });
};

function onMessageListner(message, sender) {
    // Invalid response
    if (message.type !== CHECK_RESPONSE)
        return;

    console.log(message);
    const req = message.req;
    const res = message.res;
    const url = message.url;
    const tabId = message.tabId;

    // Check response
    if (res.value != true)
        return;

    // Convert machine-translated url into the english url
    console.log("[OLD URL] " + url);
    const newUrl = url.replace(req.regExp, req.replaceStr);
    console.log("[NEW URL] " + newUrl);
    if (newUrl === null)
        return;

    // Update tab url
    setTabUrl(tabId, newUrl);
}

browser.runtime.onMessage.addListener(onMessageListner);

// A tab was updated, 
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Run a listener only if tab's url was updated
    if (!changeInfo.url) {
        return;
    }
    tryRedirectTab(tabId, tab.url);
});
