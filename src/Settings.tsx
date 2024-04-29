import { Component, createResource } from "solid-js";
import { toggleLogin, getUserInfo } from './google'

const resetData = () => chrome.storage.local.set({ "klmsToolsAssignments": null, "klmsToolsCourses": null });
const [userInfo] = createResource(getUserInfo)

const Settings: Component = () => {
    return (
        <div class="grid gap-2">
            <div class="flex items-center">
                <h2 class="text-base font-medium flex-1">Google連携</h2>
                <button onclick={toggleLogin} class="btn btn-sm">
                    <img class="w-4 h-4" src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" />
                    { userInfo()?.email ?? 'ログイン' }
                </button>
            </div>
            <div class="flex items-center">
                <h2 class="text-base font-medium flex-1">受講データをリセットする</h2>
                <button onclick={resetData} class="btn btn-sm">リセット</button>
            </div>
        </div>
    )
}
export default Settings;