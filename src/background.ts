import dayjs from "dayjs";
import { addAssignmentAsTask, getToken, updateAssignmentTask, updateGoogleTasks } from "./google";
import { Plannable } from "./types";
import { fetchPlannables } from "./canvas";

const tokenData = {
    updatedAt: dayjs(),
    token: ''
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type === 'processPlannables') {
        processPlannables(request.plannables)
        return
    }
    if (request.type === 'initAlarm') {
        initAlarm()
        return
    }
    if (request.type === 'test') {
        initAlarm()
        return
    }
});

async function processPlannables(plannables: Plannable[]) {
    const assignments = plannables.filter(plannable => plannable.plannable_type === 'assignment')
    const isGoogleEnabled = ((await chrome.storage.sync.get('google')) as unknown as {google:boolean | null}).google
    const storedAssignments = ((await chrome.storage.sync.get('assignments')) as unknown as {assignments:Plannable[] | null}).assignments
    if (!isGoogleEnabled) {
        chrome.storage.sync.set({assignments});
        return
    }
    const processCompleted = await new Promise<boolean>(resolve => {
        assignments.forEach(async (assignment, i) => {
            const storedAssignment = storedAssignments?.filter(value => value.plannable_id === assignment.plannable_id)[0] ?? null
            assignment.googleTaskApiLink = storedAssignment?.googleTaskApiLink
            console.log({storedAssignment})
            if ((!storedAssignment || !storedAssignment.googleTaskApiLink) && !assignment.submissions?.submitted) {
                console.log('1')
                const createdTask = addAssignmentAsTask(assignment, await token())
                assignment.googleTaskApiLink = await createdTask.then((value) => value.selfLink)
            }
            if (storedAssignment && ((!storedAssignment.submissions?.submitted && assignment.submissions?.submitted) || assignment.plannable.due_at !== storedAssignment.plannable.due_at)) {
                console.log('2')
                const updatedTask = updateAssignmentTask(assignment, await token())
                assignment.googleTaskApiLink = await updatedTask.then((value) => value.selfLink)
            }
            if (i === assignments.length - 1 && assignment.googleTaskApiLink) {
                console.log(3)
                resolve(true)
            }
        })
    })
    if (processCompleted) {
        console.log('4')
        console.log('a', {assignments})
        chrome.storage.sync.set({assignments}).then(async () => console.log(((await chrome.storage.sync.get('assignments')) as unknown as {assignments:Plannable[] | null}).assignments));
    }
}

async function token() {
    if (dayjs().diff(tokenData.updatedAt, "minutes") > 60 || !tokenData.token) {
        return await retrieveTokenFromPopup()
    }
    return tokenData.token
}

async function retrieveTokenFromPopup() {
    chrome.windows.create({
        focused: false,
        width: 100,
        height: 100,
        type: 'popup',
        url: 'src/Popup.html',
        top: 0,
        left: 0
    })
    const popupCreated = await new Promise<boolean>(resolve => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.type === 'popupCreated') {
                resolve(true)
            }
        });
    });
    if (popupCreated) {
        const token: string = await chrome.runtime.sendMessage({type: "token"});
        tokenData.token = token
        tokenData.updatedAt = dayjs()
        console.log(tokenData)
        return token
    }
    throw new Error('Failed retrieving user token.')
}

async function initAlarm () {
    const alarm = await chrome.alarms.get('canvas-feching-schedular')
    if (alarm) {
        console.log('alarm found')
        return
    }
    console.log('created alarm')
    chrome.alarms.create('canvas-feching-schedular', {
        delayInMinutes: 0,
        periodInMinutes: dayjs().add(1, 'day').set('hour', 12).set('minute', 0).diff(dayjs(), 'minutes')
    });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'canvas-feching-schedular') {
    const plannables = await fetchPlannables(true)
    console.log({plannables})
    processPlannables(plannables)
  }
});