import { Component, For, Show, createSignal } from "solid-js";
import dayjs from 'dayjs'
import { Plannable } from "./types";
import { getStoredAssignments, getStoredUserAssignments, setStoredUserAssignments } from "./assignment";
import { updateAssignmentTask } from "./google";
import { stringify } from "postcss";

const storedAssignments = await getStoredAssignments() ?? []
const storedUserAssignments = await getStoredUserAssignments() ?? []
const [assignments, setAssignments] = createSignal<Plannable[]>(storedUserAssignments)
const filterAssignments = (assignment: Plannable) => {
  const minutes = dayjs(assignment.plannable.due_at).diff(dayjs(), 'minute')
  return minutes >= 0 && Math.abs(minutes) <= 60 * 24 * 7  && !assignment.submissions?.submitted
  // return minutes * 60 * 24 * 7
  return true
}
const getTimeLeft = (timeStr: string) => {
  const minutes = dayjs(timeStr).diff(dayjs(), 'minute')
  if (Math.abs(minutes) > 60 * 24) {
    return `${dayjs(timeStr).diff(dayjs(), 'day')}日`
  }
  if (Math.abs(minutes) > 60) {
    return `${dayjs(timeStr).diff(dayjs(), 'hour')}時間`
  }
  return `${minutes}分`
}
const getTimeLeftColor = (timeStr: string) => {
  const minutes = dayjs(timeStr).diff(dayjs(), 'minute')
  if ((minutes) > 60 * 24 * 3) {
    return 'text-success'
  }
  if ((minutes) > 60 * 24) {
    return 'text-warning'
  }
  return 'text-error'
}
const openNewAssignmentForm = () => {
  chrome.windows.create({
    focused: false,
    width: 300,
    height: 500,
    type: 'popup',
    url: 'src/NewAssignment.html',
    top: 0,
    left: 0
  })
}

const resetList = async () => {
  const array = [...(await getStoredAssignments() ?? []), ...(await getStoredUserAssignments() ?? [])]
  setAssignments(array.filter(filterAssignments))
}
resetList()

const handleCheck = async (e:  Event & {
  target: HTMLInputElement;
}, assignment: Plannable) => {
  e.target.disabled = true
  if (assignment.googleTaskApiLink) {
    assignment.submissions!.submitted = true;
    await updateAssignmentTask(assignment)
  }
  await setStoredUserAssignments(storedUserAssignments.filter(value => value.plannable.id !== assignment.plannable.id))
  resetList()
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.updatedAssignments) {
    resetList()
    sendResponse(null)
  }
});

const AssignmentList: Component = () => {
    return (
        <div>
          <div class="flex gap-1 mb-2 items-center">
            <h2 class='text-lg font-medium text-neutral flex-grow'>直近の課題</h2>
            <button class="btn btn-xs" onclick={openNewAssignmentForm}>
              手動で追加
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
            </button>
          </div>
            <div class='grid gap-2'>
            <Show when={assignments()?.length === 0}>
                <p>一週間以内の課題はありません。やったね！</p>
                <div class='flex items-end'>
                <video class='mr-3' width="180" height="165" controls autoplay muted loop>
                <source src="https://d30k0wj1kds4dz.cloudfront.net/mikuhaha.mp4" type="video/mp4" />
                Your browser does not support the video tag.
                </video>
                <a class='link link-primary' href='https://youtu.be/hz3QKk-E_Kg?si=g4fdOF9f3kEaN9t6' target="_blank" rel="noopener noreferrer">YouTube</a>
                </div>
                <p class="text-[10px] text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3">
                    <path fill-rule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z" clip-rule="evenodd" />
                  </svg>
                  課題が見つかりませんか？<a class='link link-primary' href='https://lms.keio.jp/' target="_blank" rel="noopener noreferrer" >KLMS</a>を開いてみてくださいね。
                </p>
            </Show>
            <For each={assignments().sort((a, b) => a.plannable.due_at > b.plannable.due_at ? 1 : -1)}>{ (assignment, i) => (
                <div class="">
                <div class="text-lg font-medium border-b-2 border-base-300 flex items-center">
                    <div class="flex-none text-sm mr-3 flex items-end tooltip tooltip-bottom" data-tip={dayjs(assignment.plannable.due_at).format('MM/DD HH:mm')}>
                      <p class='text-sm mr-1'>残り</p>
                      <p class={ `${getTimeLeftColor(assignment.plannable.due_at)} text-lg` }>{ getTimeLeft(assignment.plannable.due_at) }</p>
                    </div>
                    <div class="tooltip tooltip-bottom flex-grow text-left" data-tip={(assignment.html_url ? '' : '外部: ') + assignment.context_name}>
                    <a class='cursor-pointer w-fit'>{ assignment.plannable.title }</a>
                    </div>
                    <Show when={assignment.course_id === -1}>
                      <label class="swap swap-rotate">
                        <input onchange={e => handleCheck(e, assignment)} type="checkbox" />
                        <a class='flex-none hover:bg-base-300 rounded-md swap-off'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="size-6 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        </a>
                        <a class='flex-none hover:bg-base-300 rounded-md swap-on'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="size-6 stroke-info">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        </a>
                      </label>
                    </Show>
                    <Show when={assignment.course_id !== -1}>
                      <a href={`https://lms.keio.jp/${assignment.html_url}`} target="_blank" rel="noopener noreferrer" class='flex-none hover:bg-base-300 rounded-md'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      </a>
                    </Show>
                </div>
                </div>
            )}
            </For>
            </div>
        </div>
    )
}
export default AssignmentList;