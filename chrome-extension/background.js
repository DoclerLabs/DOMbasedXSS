var storage = new Map();

chrome.runtime.onMessage.addListener(onMessageListener);
function onMessageListener(message, sender, sendResponse) {
    if (message.type === 'getMessages') {
        var tabId = message.tabId;
        var messages = [];
        if (storage.has(tabId) === true) {
            var messages = storage.get(tabId);
        }
        var response = {messages: messages};
        sendResponse(response);
    } else if (message.type === 'newMessage') {
        var tabId = sender.tab.id;
        if (storage.has(tabId) === false) {
            var messages = [];
            storage.set(tabId, messages);
        }
        var messages = storage.get(tabId);
        messages.push(message);
        storage.set(tabId, messages);
        var details = {tabId: tabId, text: messages.length.toString()};
        chrome.browserAction.setBadgeText(details);
    } else {
        var tabId = message.tabId;
        storage.delete(tabId);
        var details = {tabId: tabId, text: ''};
        chrome.browserAction.setBadgeText(details);
    }
}

chrome.tabs.onUpdated.addListener(onUpdateListener);
function onUpdateListener(tabId, changeInfo, tab) {
    if (changeInfo.hasOwnProperty('url')) {
        storage.delete(tabId);
        var details = {tabId: tabId, text: ''};
        chrome.browserAction.setBadgeText(details);
    }
}

chrome.tabs.onRemoved.addListener(onRemovedListener);
function onRemovedListener(tabId, removeInfo) {
    storage.delete(tabId);
}