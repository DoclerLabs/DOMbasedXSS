var queryInfo = {active: true, currentWindow: true};
chrome.tabs.query(queryInfo, queryCallback);

function queryCallback(result) {
    var tabId = result[0].id;
    var message = {type: 'getMessages', tabId: tabId};
    chrome.runtime.sendMessage(message, responseCallback);
}

function responseCallback(respose) {
    for (let i = 0; i < respose.messages.length; i++) {
        addItem('MESSAGE', respose.messages[i].eventData);
        addItem('LISTENER', respose.messages[i].eventListener);
        addBreak();
    }
}

function addItem(title, data) {
    var pTag = document.createElement('p');
    var textTitle = document.createTextNode(title);
    pTag.appendChild(textTitle);
    document.getElementById('logs').appendChild(pTag);
    var codeTag = document.createElement('code');
    var textData = document.createTextNode(data);
    codeTag.appendChild(textData);
    document.getElementById('logs').appendChild(codeTag);
}

function addBreak() {
    var hrTag = document.createElement('hr');
    document.getElementById('logs').appendChild(hrTag);
}

var clearLogs = document.getElementById('clearLogs');
clearLogs.onclick = onclickListener;
function onclickListener() {
    var queryInfo = {active: true, currentWindow: true};
    chrome.tabs.query(queryInfo, queryCallback);

    function queryCallback(result) {
        var tabId = result[0].id;
        var message = {type: 'clearLogs', tabId: tabId};
        chrome.runtime.sendMessage(message);
        document.getElementById('logs').innerHTML = '';
    }
}