import dayjs from "dayjs";
import { Plannable } from "./types";
import { testdata } from "./testdata";

fetch('https://lms.keio.jp/api/v1/planner/items?' + new URLSearchParams({
    start_date: dayjs(`${dayjs().month() > 9 ? `${dayjs().year() - 1}-9` : `${dayjs().year()}-4`}-1`).toISOString(),
    order: 'asc',
    per_page: '1000',
})).then(async r => {
  const json = await r.json()
  if (json && json.length > 0) {
    chrome.runtime.sendMessage({type: "processPlannables", plannables: json});
  }
}).catch(e => {console.log('Could not retrieve course info. Are you logged-out?')})