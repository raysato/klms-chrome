import dayjs from "dayjs";
import { Plannable } from "./types";
import { addAssignmentAsTask, updateGoogleTasks } from "./google";

const isGoogleEnabled = (await (chrome.storage.local.get('google') as unknown as {google:boolean | null})).google
const storedAssignments = (await (chrome.storage.sync.get('assignments') as unknown as {assignments:Plannable[] | null})).assignments

const plannables: Plannable[] = await fetch('https://lms.keio.jp/api/v1/planner/items?' + new URLSearchParams({
    start_date: dayjs(`${dayjs().month() > 9 ? 9 : 4}/1`).toISOString(),
    order: 'asc',
})).then(async r => await r.json())
  .catch(e => {throw new Error('Could not retrieve course info. Are you logged-out?')})

const assignments = plannables.filter(plannable => plannable.plannable_type === 'assignment')
console.log({assignments})

assignments.map(async assignment => {
  const storedAssignment = storedAssignments?.filter(value => value.plannable_id === assignment.plannable_id)[0] ?? null
  if (!storedAssignment || storedAssignment.googleTaskApiLink) {
    const createdTask = await addAssignmentAsTask(assignment)
    return {
      ...assignment, googleTaskApiLink: createdTask.selfLink
    }
  }
  if (!storedAssignment.submissions?.submitted && assignment.submissions?.submitted) {
    
  }
  return assignment
})

chrome.storage.sync.set({assignments});

if (isGoogleEnabled && assignments.length > 0) {
  updateGoogleTasks()
}

console.log( await chrome.storage.sync.get('assignments'))
console.log('start content')
document.getElementById('left-side')?.addEventListener('click', async () => {
  console.log('click')
  const result = chrome.runtime.sendMessage({type: "token"});
  console.log(await result)
});
