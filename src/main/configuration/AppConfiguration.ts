import fs from 'fs';
import {Dictionary} from '../types';

class AppConfiguration {
    private static self: AppConfiguration;
    private readonly ready: boolean = false;
    private readonly appConfig: Dictionary = {};

    constructor(
        private readonly runtimeConfig: Dictionary,
        private readonly appConfigPath: string
    ) {
        if(AppConfiguration.self) return AppConfiguration.self;
        const appConfigJSON = fs.readFileSync(this.appConfigPath, {encoding: 'utf-8'});
        this.appConfig = JSON.parse(appConfigJSON);
        this.ready = true;
        AppConfiguration.self = this;
    }

    public GetRuntimeConfig(key: string): any {
        if(!this.ready) throw new Error('App configuration is not ready yet.');
        if(!this.runtimeConfig[key]) throw  new Error(`No config value found for the key ${key}`);
        return this.runtimeConfig[key];
    }

    public GetAppConfig(key: string): any {
        if(!this.ready) throw new Error('App configuration is not ready yet.');
        if(!this.appConfig[key]) throw  new Error(`No config value found for the key ${key}`);
        return this.appConfig[key];
    }

    public SetAppConfig(key: string, value: string) {
        this.appConfig[key] = value;
        fs.writeFileSync(this.appConfigPath, JSON.stringify(this.appConfig), { encoding: 'utf-8' });
    }
}

export default AppConfiguration
