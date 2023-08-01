import { Markup } from "telegraf";


export function menuButtons(){
    return Markup.keyboard([
        ["Manage wallets", "Manage notifications"]
        
    ]
    ).resize()
}

export function walletMenuButtons(){
    return Markup.keyboard([
        ["Add wallet", "Edit wallets", "List"],
        ["Menu"]

        // Markup.button.callback("Add wallets", "wallets_menu"),
        // Markup.button.callback("Edit wallets", "notify_menu"),
    ]
    ).resize()
}
export function notifyMenuButtons(){
    return Markup.keyboard([
        ["Enable notifications", "Disable notifications"],
        ["Menu"]
        
    ]
    ).resize()
}



// export class BotButtons {
//     constructor(){

//     }
//     me
// }