import dayjs from "dayjs";
import { addAssignmentAsTask, getToken, isUserLoggedIn, updateAssignmentTask, updateGoogleTasks } from "./google";
import { Plannable } from "./types";

const tokenData = {
    updatedAt: dayjs(),
    token: ''
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type === 'processPlannables') {
        processPlannables(request.plannables)
        sendResponse(null)
        return
    }
    if (request.type === 'test') {
        const data = await token()
        sendResponse(data)
        sendResponse(null)
        return
    }
});

async function processPlannables(plannables: Plannable[]) {
    const assignments = plannables.filter(plannable => plannable.plannable_type === 'assignment')
    const isGoogleEnabled = await isUserLoggedIn()
    const storedAssignments = ((await chrome.storage.sync.get('assignments')) as unknown as {assignments:Plannable[] | null}).assignments
    if (!isGoogleEnabled) {
        chrome.storage.sync.set({assignments});
        return
    }
    const processCompleted = await new Promise<boolean>(resolve => {
        assignments.forEach(async (assignment, i) => {
            const storedAssignment = storedAssignments?.filter(value => value.plannable_id === assignment.plannable_id)[0] ?? null
            assignment.googleTaskApiLink = storedAssignment?.googleTaskApiLink
            if ((!storedAssignment || !storedAssignment.googleTaskApiLink) && !assignment.submissions?.submitted) {
                const createdTask = addAssignmentAsTask(assignment, await token())
                assignment.googleTaskApiLink = await createdTask.then((value) => value.selfLink)
            }
            if (storedAssignment && ((!storedAssignment.submissions?.submitted && assignment.submissions?.submitted) || assignment.plannable.due_at !== storedAssignment.plannable.due_at)) {
                const updatedTask = updateAssignmentTask(assignment, await token())
                assignment.googleTaskApiLink = await updatedTask.then((value) => value.selfLink)
            }
            if (i === assignments.length - 1 && assignment.googleTaskApiLink) {
                resolve(true)
            }
        })
    })
    if (processCompleted) {
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
        return token
    }
    throw new Error('Failed retrieving user token.')
}