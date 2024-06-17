/* @refresh reload */
import { render } from 'solid-js/web';

const root = document.getElementById('root');
import './index.css';
import { Plannable } from './types';
import dayjs from 'dayjs';
import { Show, createSignal } from 'solid-js';
import { addAssignmentAsTask } from './google';
import { addStoredUserAssingments } from './assignment';

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const [title, setTitle] = createSignal('')
const [course, setCourse] = createSignal('')
const [due, setDue] = createSignal('')
const [detail, setDetail] = createSignal('')
const [disabled, setDsiabled] = createSignal(false)
const isGoogleEnabled = ((await chrome.storage.sync.get('google')) as unknown as {google:boolean | null}).google
const submit = async (e: SubmitEvent) => {
  setDsiabled(true)
  e.preventDefault()
  const newPlannable: Plannable = {
    course_id: -1,
    plannable_id: -1,
    plannable_type: 'assignment',
    submissions:  {
      "submitted": false,
    },
    plannable: {
      id: dayjs().unix(),
      title: title(),
      due_at: dayjs(due()).toISOString(),
      message: detail()
    },
    context_name: course()
  }
  if (!isGoogleEnabled) {
    await addStoredUserAssingments(newPlannable)
    window.close();
    return
  }
  const task = await addAssignmentAsTask(newPlannable)
  newPlannable['googleTaskApiLink'] = task.selfLink
  await addStoredUserAssingments(newPlannable)
  window.close();
}

render(() => (
<form onsubmit={submit} class='grid m-2'>
    <h1 class='text-base font-bold'>外部課題登録</h1>
    <div class='grid gap-2 mt-1'>
      <label class='grid gap-1'>
        <p class='text-sm'>課題名</p>
        <input onchange={(e) => setTitle(e.target.value)} required type="text" name='title' placeholder="Type here" class="input input-bordered text-xs w-full" />
      </label>
      <label class='grid gap-1'>
        <p class='text-sm'>コース名</p>
        <input onchange={(e) => setCourse(e.target.value)} required type="text" name='course' placeholder="Type here" class="input input-bordered text-xs w-full" />
      </label>
      <label class='grid gap-1'>
        <p class='text-sm'>期限</p>
        <input onchange={(e) => setDue(e.target.value)} required type="datetime-local" name='deadline' placeholder="Type here" class="input input-bordered text-xs w-full" />
      </label>
      <label class='grid gap-1'>
        <p class='text-sm'>詳細</p>
        <textarea onchange={(e) => setDetail(e.target.value)} placeholder="Type here" name='detail' class="textarea textarea-bordered textarea-xs w-full h-24" ></textarea>
      </label>
      <button disabled={disabled()} class="btn btn-block">
        <Show when={!disabled()}>
          追加
        </Show>
        <Show when={disabled()}>
          <span class="loading loading-spinner loading-xs"></span>
        </Show>
      </button>
    </div>
</form>
), root!);
