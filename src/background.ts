import { getToken } from "./google";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background token')
    if (request.type === 'token') {
        chrome.windows.create({
            focused: true,
            width: 400,
            height: 600,
            type: 'popup',
            url: 'src/Popup.html',
            top: 0,
            left: 0
          }, () => {})
        sendResponse(getToken())
    }
});