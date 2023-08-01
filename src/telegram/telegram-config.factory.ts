import { ConfigService } from "@nestjs/config"
import { TelegrafModuleAsyncOptions, TelegrafModuleOptions } from "nestjs-telegraf"
import * as LocalSession from 'telegraf-session-local';

const sessions = new LocalSession({database: "test-sessions.json"})


const telegrafModuleOptions = (config: ConfigService): TelegrafModuleOptions =>{
    return{
        token: config.get("TELEGRAM_API"),
        middlewares: [sessions.middleware()]

    }
}

export const options = ():  TelegrafModuleAsyncOptions =>{
    return{
        inject: [ConfigService],
        
        useFactory: (config: ConfigService)=>telegrafModuleOptions(config),
    }
}