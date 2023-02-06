import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import configuration from './configuration/config';
import DataExchange from "./data-exchange/DataExchange";
import AppConfiguration from "./configuration/AppConfiguration";

class Main {
    private mainWindow: BrowserWindow;
    private dataExchange: DataExchange;

    constructor(
        private readonly appConfiguration: AppConfiguration,
    ) {}

    public async Init() {
        app.on('window-all-closed', () => {
            this.Exit(0);
        });

        await app.whenReady();
        await this.CreateMainWindow(
            this.appConfiguration.GetAppConfig('window_width'),
            this.appConfiguration.GetAppConfig('window_height')
        );
        this.dataExchange = new DataExchange(ipcMain, this.mainWindow.webContents);
        this.dataExchange.SendMessage({ event: 'loading'});
        try {

        } catch (e) {
            this.dataExchange.SendMessage({ event: 'error', payload: { text: e.message }});
        }
        this.dataExchange.SendMessage({ event: 'loaded'});
    }

    private async CreateMainWindow(w: number, h :number) {
        this.mainWindow = new BrowserWindow({
            webPreferences: {
                preload: path.resolve(__dirname, './preload.js')
            },
            width: w,
            height: h
        })
        await this.mainWindow.loadURL(this.appConfiguration.GetRuntimeConfig('webViewSource'));
    }

    private async Exit(code: number = 0) {
        if (process.platform !== 'darwin') app.quit();
    }
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// APP STARTUP
const config = new AppConfiguration(
    configuration,
    path.resolve(__dirname, 'config.json')
);

new Main(config).Init();
