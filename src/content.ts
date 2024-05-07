import dayjs from "dayjs";
import { Plannable } from "./types";
import { testdata } from "./testdata";

const plannables: Plannable[] = await fetch('https://lms.keio.jp/api/v1/planner/items?' + new URLSearchParams({
    start_date: dayjs(`${dayjs().month() > 9 ? 9 : 4}/1`).toISOString(),
    order: 'asc',
})).then(async r => await r.json())
  .catch(e => {throw new Error('Could not retrieve course info. Are you logged-out?')})
console.log(plannables)
chrome.runtime.sendMessage({type: "processPlannables", plannables: testdata});

console.log( await chrome.storage.sync.get('assignments'))
console.log('start content')
document.getElementById('left-side')?.addEventListener('click', async () => {
  console.log('click')
  const result = chrome.runtime.sendMessage({type: "test"});
  console.log(await result)
});
