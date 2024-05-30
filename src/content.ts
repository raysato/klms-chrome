import dayjs from "dayjs";
import { Plannable } from "./types";
import { testdata } from "./testdata";

fetch('https://lms.keio.jp/api/v1/planner/items?' + new URLSearchParams({
    start_date: dayjs(`${dayjs().month() > 9 ? 9 : 4}/1`).toISOString(),
    order: 'asc',
})).then(async r => {
  const json = await r.json()
  chrome.runtime.sendMessage({type: "processPlannables", plannables: json});
}).catch(e => {console.log('Could not retrieve course info. Are you logged-out?')})