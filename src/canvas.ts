import dayjs from "dayjs"
import { Plannable } from "./types"

export const syncedToken = async (token?: string) => {
    if (token) {
        chrome.storage.sync.set({canvasToken: ''});
        return token
    }
    return ((await chrome.storage.sync.get('canvasToken')) as unknown as {canvasToken:string | null}).canvasToken
}

export const verifyToken = async (token?: string) => {
    const response = await fetch('https://lms.keio.jp/api/v1/users/self', {
        headers: {
            Authorization: `Bearer ${token ?? await syncedToken()}`,
        },
    }).catch(error => {
        syncedToken('')
        throw error
    })
    chrome.runtime.sendMessage({type: "initAlarm"});
    return response
}

export const fetchPlannables = async (useToken = false) => {
    if (useToken && !await syncedToken()) {
        throw new Error('Canvas token not set.')
    }
    const plannables: Plannable[] = await fetch('https://lms.keio.jp/api/v1/planner/items?' + new URLSearchParams({
        start_date: dayjs(`${dayjs().month() > 9 ? 9 : 4}/1`).toISOString(),
        order: 'asc',
    }), useToken ? {
        headers: {
            Authorization: `Bearer ${await syncedToken()}`,
        },
    } : undefined).then(async r => await r.json())
        .catch(e => {
            chrome.alarms.clear('canvas-feching-schedular')
            verifyToken()
            throw new Error('Could not retrieve course info. Are you logged-out?')
        })
    return plannables
}