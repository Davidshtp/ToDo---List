import { contextBridge, ipcRenderer } from "electron";
import { TTask } from "./shared/types";

const renderer = {
    open_child_win: (data: TTask[]) => {
        ipcRenderer.send('open-child-win', data)
    },
    close_app: () => {
        ipcRenderer.send('close-app')
    },
    minimize_app: () => {
        ipcRenderer.send('minimize-app')
    },
    maximize_app: () => {
        ipcRenderer.send('maximize-app')
    }
}

contextBridge.exposeInMainWorld('electron', renderer)
export type TRenderer = typeof renderer