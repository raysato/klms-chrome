import { Assignment } from "./types";

const API_KEY = 'AIzaSyBBsYEusied9aZjbb4N8UsreHKi8Yvmu0I';

export let loggedIn = false;

export const toggleLogin = async () => {
    if (await isUserLoggedIn()) {
        const token = (await chrome.identity.getAuthToken({ interactive: false })).token
        if (confirm('Googleからログアウトしますか？') && token) {
            const url = 'https://accounts.google.com/o/oauth2/revoke?token=' + token;
            fetch(url);
            chrome.identity.removeCachedAuthToken({token}, function (){
            alert('removed');
            });
        }
        chrome.runtime.reload()
        return
    }
    await chrome.identity.getAuthToken({ interactive: true })
    chrome.runtime.reload()
}

export const addAssignmentTask = (assgignment: Assignment) => {

}

export const getUserInfo = async () => await isUserLoggedIn() ? (await chrome.identity.getProfileUserInfo({})) : null

export const isUserLoggedIn =  async () => {
    try {
        return (await chrome.identity.getAuthToken({ interactive: false })).token ? true : false
    } catch (error) {
        return false
    }
}