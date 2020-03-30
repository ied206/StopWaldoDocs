"use strict";

function getMeta(key) {
    let query = document.querySelector(`meta[name='${key}']`);
    if (query === null)
        return null;
    return query.getAttribute("content");
}

function checkQuery(cond) {
    const query = document.querySelector(cond.query);
    if (query === null)
        return null;
    const attr = query.getAttribute(cond.attribute);
    return (attr === cond.expected);
}

function forgeResponseMsg(reqMsg, value, error) {
    return {
        type: CHECK_RESPONSE,
        tabId: reqMsg.tabId,
        url: reqMsg.url,
        req: reqMsg.req,
        res: {
            value: value,
            error: error
        }
    }
}

function onMessageListner(message, sender) {
    if (message.type !== CHECK_REQUEST) { // Invalid request
        const resMsg = forgeResponseMsg(message, false, "Invalid message type");
        browser.runtime.sendMessage(resMsg);
        return;
    }

    let result = false;
    let redirect = message.req;
    for (let i = 0; i < redirect.conditions.length; i++) {
        let cond = redirect.conditions[i];
        result |= checkQuery(cond);
        if (!result)
            break;
    }

    const resMsg = forgeResponseMsg(message, result, null);
    browser.runtime.sendMessage(resMsg);
}

browser.runtime.onMessage.addListener(onMessageListner);
