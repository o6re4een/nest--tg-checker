import { Context as ContextTelegraf, Scenes} from "telegraf"



// export interface ISceneContext extends Scenes.SceneContext{

// }

export interface IContext extends ContextTelegraf{
    session:{
        type?: "add" | "edit" | "remove",
        chatId: number,
        notify: boolean,
    }
}