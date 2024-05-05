import { getToken } from "./google";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'token') {
        sendResponse(getToken())
    }
});