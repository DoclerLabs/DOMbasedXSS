var injectedScript = function() {
    var prototypeAddEventListener = Window.prototype.addEventListener;
    Window.prototype.addEventListener = function(type, listener, options, useCapture = false, wantsUntrusted = false) {
        this.prototypeAddEventListener = prototypeAddEventListener;
        if (type == "message") {
            var oldListener = listener;
            var newListener = function(event) {
                const customEvent = new CustomEvent('log', {detail: {type: 'newMessage', eventData: event.data.toString(), eventListener: oldListener.toString()}});
                document.dispatchEvent(customEvent);
                console.log('--------------------------------------------------------------------------------');
                console.log('%cMESSAGE', 'background: black; color:white;')
                console.log(event);
                console.log('%cLISTENER', 'background: black; color:white;')
                console.log(oldListener);
                oldListener.apply(this, arguments);
            }
        }
        this.prototypeAddEventListener(type, newListener, options, useCapture, wantsUntrusted);
    }
}

injectedScript = '(' + injectedScript.toString() + ')()';
var scriptTag = document.createElement("script");
scriptTag.type = 'text/javascript';
scriptTag.text = injectedScript;
document.documentElement.appendChild(scriptTag);

document.addEventListener('log', logEventListenter);
function logEventListenter(event) {
    chrome.runtime.sendMessage(event.detail);
}