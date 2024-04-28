import { Component } from "solid-js";

const resetData = () => chrome.storage.local.set({ "klmsToolsAssignments": null, "klmsToolsCourses": null });

const Settings: Component = () => {
    return (
        <div class="grid gap-1">
            <div class="flex items-center">
                <h2 class="text-base font-medium flex-1">受講データをリセットする</h2>
                <button onclick={resetData} class="btn btn-sm">リセット</button>
            </div>
        </div>
    )
}
export default Settings;