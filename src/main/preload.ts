import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electronApi',{
    send: (channel: string, message: any) => {
        ipcRenderer.send(channel, message);
    },
    on: (channel: string, handler: Function) => {
        const eventHandler = (event: IpcRendererEvent, message: any) =>
            handler(event, message);
        ipcRenderer.on(channel, eventHandler);
        return () => ipcRenderer.removeListener(channel, eventHandler);
    }
})