import dayjs from 'dayjs';
import {Plannable, Task, TaskList, TaskListsResponse} from './types'

export let loggedIn = false;

export const toggleLogin = async () => {
    if (await isUserLoggedIn()) {
        const token = (await chrome.identity.getAuthToken({ interactive: false })).token
        if (confirm('Googleからログアウトしますか？') && token) {
            const url = 'https://accounts.google.com/o/oauth2/revoke?token=' + token;
            fetch(url);
            chrome.identity.removeCachedAuthToken({token}, function (){
                alert('removed');
                chrome.storage.sync.set({google: false});
                chrome.runtime.reload()
            });
        }
        return
    }
    chrome.identity.getAuthToken({ interactive: true }).then(() => {
        chrome.storage.sync.set({google: true});
        chrome.runtime.reload()
    })
}
export const getToken =  async () => {
    try {
        const tokenData = await chrome.identity.getAuthToken({ interactive: false })
        return tokenData.token ?? null
    } catch (error) {
        console.error({error})
        return null
    }
}

export const getUserInfo = async () => await isUserLoggedIn() ? (await chrome.identity.getProfileUserInfo({})) : null

export const isUserLoggedIn =  async () => {
    try {
        return (await chrome.identity.getAuthToken({ interactive: false })).token ? true : false
    } catch (error) {
        return false
    }
}

export const updateGoogleTasks = () => {

}

export const addAssignmentAsTask = async (assignment: Plannable, tokenFromContent?: string) => {
    const token = tokenFromContent ?? await getToken()
    if (!token) {
        throw Error('No user token found.')
    }
    const taskListId = await getTaskListId(token)
    const task = await requestTaskApi(token, `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, 'POST', {
        title: assignment.plannable.title,
        notes: `${assignment.context_name}\nhttps://lms.keio.jp/${assignment.html_url}`,
        due: dayjs(assignment.plannable.due_at).toISOString()
    }) as Task
    console.log({task})
    return task
}

export const updateAssignmentTask = async (assignment: Plannable, tokenFromContent?: string) => {
    const token = tokenFromContent ?? await getToken()
    if (!token) {
        throw Error('No user token found.')
    }
    if (!assignment.googleTaskApiLink) {
        console.error({assignment})
        throw Error('No api link found for assignment.')
    }
    console.log(assignment.googleTaskApiLink)
    const task = await requestTaskApi(token, assignment.googleTaskApiLink, 'PUT', {
        id: (assignment.googleTaskApiLink).split('/').slice(-1)[0],
        title: assignment.plannable.title,
        notes: `${assignment.context_name}\nhttps://lms.keio.jp/${assignment.html_url}`,
        status: assignment.submissions?.submitted ? 'completed' : 'needsAction',
        due: dayjs(assignment.plannable.due_at).toISOString()
    }) as Task
    console.log({task})
    return task
}

const getTaskListId = async (token: string) => {
    const tasklistId = (chrome.storage.sync.get('tasklistId') as unknown as { tasklistId: string | null; }).tasklistId
    if (tasklistId) {
        return tasklistId
    }
    const taskLists = await requestTaskApi(token, 'https://tasks.googleapis.com/tasks/v1/users/@me/lists', 'GET') as TaskListsResponse
    console.log({taskLists})
    const taskList = taskLists.items.filter(taskList => taskList.title === 'KLMS')[0]
        ?? await requestTaskApi(token, 'https://tasks.googleapis.com/tasks/v1/users/@me/lists', 'POST', {title: 'KLMS'}) as TaskList
    chrome.storage.sync.set({tasklistId: taskList.id})
    return taskList.id
}

const requestTaskApi = async (token: string, url: string, method: 'POST' | 'GET' | 'PUT', body?: Object) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: body ? JSON.stringify(body) : null
    })
    return await response.json()
}