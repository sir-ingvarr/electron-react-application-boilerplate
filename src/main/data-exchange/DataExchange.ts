import { IpcMain, IpcMainEvent, WebContents } from 'electron';
import EventEmitter from 'events';

type Dictionary<T = any> = { [key: string]: T }

interface EventMessage {
    event: string,
    payload?: Dictionary
}

class DataExchange extends EventEmitter {
    private MessageHandlers: Map<string, Function>;

    constructor(
        private readonly ipcMain: IpcMain,
        private readonly renderer: WebContents
    ) {
        super();
        this.MessageHandlers = new Map<string, Function>();
        this.RegisterEventHandler('ping', (event) => {
            event.sender.send('message', { event: 'pong' });
        })
        ipcMain.on(
            'message',
            (event, message) => this.HandleMessage(event, message)
        );
    }

    public RegisterEventHandler(eventName: string, handler: Function) {
        if(this.MessageHandlers.has(eventName))
            this.HandleError(new Error(`Duplicate event handler attempt: ${eventName}`));
        this.MessageHandlers.set(eventName, handler);
    }

    private HandleError(error: Error) {
        this.emit('error', { err: error })
    }

    private HandleMessage(event: IpcMainEvent, message: EventMessage): any {
        const { event: eventType, payload } = message;
        const handler = this.MessageHandlers.get(eventType)
        if(!handler) {
            return this.HandleError(new Error(`Unknown command received: ${message}`));
        }
        return handler(event, payload);
    }

    public SendMessage(message: EventMessage) {
        const { event, payload } = message;
        this.renderer.send(event, payload);
    }

}

export default DataExchange;
