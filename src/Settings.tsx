import { Component, createResource, createSignal, JSX, Show } from "solid-js";
import { toggleLogin, getUserInfo } from './google'
import { verifyToken } from "./canvas";

const resetData = () => chrome.storage.sync.set({assignments: undefined});
const getStoredToken = async () => ((await chrome.storage.sync.get('canvasToken')) as unknown as {canvasToken:string | null}).canvasToken
const storedCanvasToken = await getStoredToken()
const [enabledCanvasApi, setCanvasApiEnabled] = createSignal(storedCanvasToken ? true : false)
const [canvasToken, setCanvasToken] = createSignal(storedCanvasToken ?? '')
const [canvasState, setCanvasState] = createSignal({msg: '', success: false})
const [userInfo] = createResource(getUserInfo)
if (storedCanvasToken) {
    checkToken(storedCanvasToken)
}
const toggleCanvasApi = async (e: Event) => {
    e.preventDefault()
    const token = await getStoredToken()
    if (token && confirm('Canvas連携を解除してもよろしいでしょうか？')) {
        setCanvasApiEnabled(false)
        setCanvasToken('')
        chrome.storage.sync.set({canvasToken: ''});
        setCanvasState({
            msg: '', success: true
        })
        return
    }
    if (token) {
        return
    }
    setCanvasApiEnabled(!enabledCanvasApi())

}
const changeCanvasToken: JSX.EventHandler<HTMLInputElement, Event> = async (e: Event) => {
    const target = e.target as HTMLInputElement
    setCanvasToken(target.value)
    checkToken(target.value)
}

async  function checkToken (token: string) {
    if (!token) {
        setCanvasApiEnabled(false)
        return
    }
    const res = await verifyToken(token)
    if (res.status === 200) {
        const data = await res.json()
        setCanvasState({
            msg: `ようこそ、${data.short_name}！`, success: true
        })
        chrome.storage.sync.set({canvasToken: token});
        return
    }
    setCanvasState({
        msg: '認証に失敗しました。トークンを再度確認ください。', success: false
    })
    chrome.storage.sync.set({canvasToken: ''});
}

const Settings: Component = () => {
    return (
        <div class="grid gap-3">
            <div class="flex items-center">
                <h2 class="text-base font-medium flex-1">Google連携</h2>
                <button onclick={toggleLogin} class="btn btn-sm">
                    <img class="w-4 h-4" src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" />
                    { userInfo()?.email ?? 'ログイン' }
                </button>
            </div>
            <div>
                <div class="flex items-center">
                    <h2 class="text-base font-medium flex-1 flex items-center gap-1">
                        <p>課題自動取得</p>
                        <a class="cursor-pointer text-base-300 tooltip tooltip-bottom hover:text-base-content" data-tip="KLMS外から自動的に課題を取得します。">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                        </svg>
                        </a>
                    </h2>
                    <input type="checkbox" class="toggle toggle-md toggle-primary" checked={enabledCanvasApi()} onclick={toggleCanvasApi} />
                </div>
                <Show when={enabledCanvasApi()}>
                    <input id="toggleCanvas" type="text" placeholder="トークン" class="input input-bordered input-sm w-full mt-2" value={canvasToken()} onchange={changeCanvasToken}/>
                </Show>
                <Show when={enabledCanvasApi()}>
                    <p class={`mt-1 text-sm w-full ${canvasState().success ? 'text-success' : 'text-error'}`}>{ canvasState().msg }</p>
                </Show>
            </div>
            <div class="flex items-center">
                <h2 class="text-base font-medium flex-1">受講データをリセットする</h2>
                <button onclick={resetData} class="btn btn-sm">リセット</button>
            </div>
        </div>
    )
}
export default Settings;