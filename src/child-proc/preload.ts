import { contextBridge, ipcRenderer } from 'electron'
import { broadcast_event } from '../shared/functions';
import { TTask } from '../shared/types';

ipcRenderer.on('tasks-data', (ev, data) => {
    console.log("data gotter", data);
    broadcast_event('data-tasks', data)
})

const renderer = {
    minimize_app: () => {
        ipcRenderer.send('minimize-child-win')
    },
    maximize_app: () => {
        ipcRenderer.send('maximize-child-win')
    },
    close_app: () => {
        window.close()
    },
    open_child_win: (_data: TTask[]) => {
        // No implementado en ventana hija
    }
}

contextBridge.exposeInMainWorld('electron', renderer)
export type TChildRenderer = typeof renderer