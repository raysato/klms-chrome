import { Plannable } from "./types";

export const getStoredAssignments = async () => ((await chrome.storage.sync.get('assignments')) as unknown as {assignments:Plannable[] | null}).assignments
export const getStoredUserAssignments = async () => ((await chrome.storage.sync.get('userAssignments')) as unknown as {userAssignments:Plannable[] | null}).userAssignments

export const setStoredAssignments = (assignments: Plannable[] | undefined) => setStorage({assignments});
export const setStoredUserAssignments = (userAssignments: Plannable[] | undefined) => setStorage({userAssignments});
export const addStoredUserAssingments = async (assignment: Plannable) => {
    const storedUserAssignments = await getStoredUserAssignments() ?? []
    await setStorage({userAssignments: [...storedUserAssignments, assignment]});
}

const setStorage = async (obj: Object) => {
    await chrome.storage.sync.set(obj);
    await chrome.runtime.sendMessage({updatedAssignments: true});
}