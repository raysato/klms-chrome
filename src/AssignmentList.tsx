import { Component, For, Show, createSignal } from "solid-js";
import dayjs from 'dayjs'
import { Plannable } from "./types";

const storedAssignments = (await (chrome.storage.local.get('assignments') as unknown as {assignments:Plannable[] | null})).assignments
const [assignments, setAssignments] = createSignal<Plannable[] | null>(storedAssignments)
if (assignments()) {
  setAssignments(assignments()!.filter(assignment => {
    const minutes = dayjs(assignment.plannable.due_at).diff(dayjs(), 'minute')
    // return minutes * 60 * 24 * 7
    return true
  }))
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

const AssignmentList: Component = () => {
    return (
        <div>
            <h2 class='text-lg font-medium text-neutral'>直近の課題</h2>
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
            </Show>
            <For each={assignments()}>{ (assignment, i) => (
                <div class="">
                <div class="text-lg font-medium border-b-2 border-primary flex items-center">
                    <div class="flex-none text-sm mr-3 flex items-end">
                    <p class='text-sm mr-1'>残り</p>
                    <p class={ `${getTimeLeftColor(assignment.plannable.due_at)} text-lg` }>{ getTimeLeft(assignment.plannable.due_at) }</p>
                    </div>
                    <div class="tooltip tooltip-bottom flex-grow text-left" data-tip={assignment.context_name}>
                    <a class='cursor-pointer w-fit'>{ assignment.plannable.title }</a>
                    </div>
                    <a href={`https://lms.keio.jp/${assignment.html_url}`} target="_blank" rel="noopener noreferrer" class='flex-none hover:bg-base-300 rounded-md'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    </a>
                </div>
                </div>
            )}
            </For>
            </div>
        </div>
    )
}
export default AssignmentList;