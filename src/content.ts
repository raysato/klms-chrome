import dayjs from "dayjs";
import { testdata } from "./testdata";
import { fetchPlannables } from "./canvas";

const plannables = await fetchPlannables()
console.log(plannables)
chrome.runtime.sendMessage({type: "processPlannables", plannables: testdata});

console.log( await chrome.storage.sync.get('assignments'))
console.log('start content')
document.getElementById('left-side')?.addEventListener('click', async () => {
  console.log('click')
  const result = chrome.runtime.sendMessage({type: "test"});
  console.log(await result)
});
