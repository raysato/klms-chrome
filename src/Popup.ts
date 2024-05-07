import { getToken } from './google';

const token = await getToken()

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === 'token') {
      sendResponse(token)
      window.close();
  }
});
chrome.runtime.sendMessage({type: "popupCreated"});
