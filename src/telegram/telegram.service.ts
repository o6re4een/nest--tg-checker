import { Start, Update, Ctx, On, Message, Hears, InjectBot} from "nestjs-telegraf";
import {Telegraf} from "telegraf"
import { menuButtons, notifyMenuButtons, walletMenuButtons } from "./telegram.buttons";
import { IContext } from "./context.interface";
import { UsersService } from "src/db/users/users.service";
// import { AppService } from "src/app.service";
import {ConfigService} from "@nestjs/config"
import { DbService } from "src/db/db.service";
import { UserEntity } from "src/db/user.entity";
import { WalletEntity } from "src/db/wallet.entity";
import { MoralisStreamService } from "src/moralis-stream/moralis-stream.service";
import Moralis from "moralis";
import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";
import { URI } from "./moralis.types";
import { IWebhook } from "@moralisweb3/streams-typings";
// import { EvmChain } from "@moralisweb3/evm-utils";





@Update()
@Injectable()
export class TelegramService extends Telegraf<IContext>{

    constructor(
        private readonly configService: ConfigService,
        private readonly appService: DbService,
        private moralisService: MoralisStreamService,
        ){
        super(configService.get("TELEGRAM_API"))
       
        // moralisService.createStream().then()
    }
    user:UserEntity = null; 

    // async sendToChatIds(chatIds: number, data: string){
        
    // }
    
    async notify(data: IWebhook){
        //return blank tx

        if(data.txs.length===0) return

        // if(tx)
        if(data.txsInternal){

        }
        

        for(let tx of data.txs){
            const fromAddress = tx.fromAddress;
            const toAddress = tx.toAddress;
           
            const targetIdsFrom = await this.appService.getChatIdsByWalletAddress(fromAddress)
            const targetIdsTo = await this.appService.getChatIdsByWalletAddress(toAddress)

            // const logs = Moralis.Streams.parsedLogs<URI>(data)
            
            //Send by addres from or by address To
            if(targetIdsFrom){

                for(let chatId of targetIdsFrom){
                    await this.telegram.sendMessage(chatId, `Tx from ${tx.fromAddress} to  ${tx.toAddress} for ${ethers.formatEther(tx?.value)} \n chainId: ${data.chainId}`)
                }
            }

            if(targetIdsTo){
                for(let chatId of targetIdsTo){
                    await this.telegram.sendMessage(chatId, `Tx from ${tx.fromAddress} to  ${tx.toAddress} for ${ethers.formatEther(tx?.value)} \n chainId: ${data.chainId}`)
                }
            }
            

           
           
        }
        
        
    }



    @Start()
    async onStart(@Ctx() ctx: IContext){
        try {
            // console.log(ctx)
            const chatId: number = ctx.chat.id
            // console.log(chatId, "Id")
            console.log(ctx.session, "ses")
            ctx.session.chatId = chatId;
            this.user = await this.appService.getOrCreateUserByChatId(chatId)
            // ctx.sesssion.chatId = chatId;
            // ctx.sesssion.notify = true;
            await ctx.reply("Welcome to EVM Tracker Bot", menuButtons())

             
        } catch (error) {
            console.log(error)
        }
        

    }

    // @On("text")
    // async onMessage(@Message("text") message: string){
    //     return  message
    // }
    @Hears("List")
    async onList(@Ctx() ctx: IContext){
        const userWallets = await this.appService.getAllUserWalletAddresses(ctx.chat.id)
        await ctx.reply(`Your wallets: \n ${userWallets.join("\n")}`)
        // await ctx.reply("Notifications Managment", notifyMenuButtons())
    }

    @Hears("Manage notifications")
    async manageNotifications(@Ctx() ctx: IContext){
        await ctx.reply("Notifications Managment", notifyMenuButtons())
    }

    @Hears("Enable notifications")
    async enableNotifications(@Ctx() ctx: IContext){
        await this.appService.enableNotificationsByChatId(ctx.chat.id)
        await ctx.reply("Notifications Enabled")
        
    }

    @Hears("Disable notifications")
    async disableNotifications(@Ctx() ctx: IContext){
        await this.appService.disableNotificationsByChatId(ctx.chat.id)
        await ctx.reply("Notifications Disabled")
    }

    @Hears("Menu")
    async onMenu(@Ctx() ctx: IContext){
        await ctx.reply("Bot Menu", menuButtons())
    }

    @Hears("Manage wallets")
    async onManageWallets(@Ctx() ctx: IContext){
        // console.log(ctx)
        await ctx.reply("Bot Menu", walletMenuButtons())
    }

    
    @Hears("Add wallet")
    async onAddWallet(@Ctx() ctx: IContext){
        ctx.session.type = "add";
        await ctx.reply("Write wallet addresses like: 0x000000000000000000 0x000000000000 0x00000000000")

    }
    @Hears("Edit wallets")
    async onDeleteWallets(@Ctx() ctx: IContext){
        ctx.session.type = "edit";
        const addresses = await this.appService.getAllWalletsForUser(ctx.chat.id)

        await(ctx.reply(`Your addresses: \n ${addresses.join("\n")}`))
        await ctx.reply("Write wallet addresses to delete like: 0x000000000000000000 0x000000000000 0x00000000000")

    }

    //get Wallet 
    @On("text")
    async getMessage(@Message("text") walletStr: string, @Ctx() ctx: IContext){
        if(!ctx.session.type) return
        
        //Handle add wallet || ToDO add wallet
        if(ctx.session.type==="add"){
            const tmpArray: string[] = walletStr.split(" ")

            const walletArray: string[] = tmpArray.filter((item: string)=>this.isEthereumAddress(item))

            // walletArray.filter((address: string)=> {Moralis})
            walletArray.forEach((address: string)=>this.moralisService.addAddressToStream(address))
            // await Moralis.EvmUtils.EvmAddress
            // console.log()
            
            const walletsAdded: WalletEntity[] | null = await this.appService.addNonExistingWalletsToUser(ctx.session.chatId, walletArray)
            
            // console.log(walletsAdded)
            
            if(!walletsAdded){
                await ctx.reply("No new wallets aded", walletMenuButtons() )
                ctx.session.type = null;
                return
            } 
            await ctx.reply(`Wallets added \n ${walletsAdded.map((item: WalletEntity): string=>{
                return item.address + "\n"
            })}`)
            
            ctx.session.type = null;
        }
        if(ctx.session.type==="edit"){
            const walletArray: string[] = walletStr.split(" ")
            await this.appService.removeWalletsForUser(ctx.chat.id, walletArray)
            ctx.reply(`Deleted wallets: ${walletArray.join("\n")}`)
        }
        
        


    }
    isEthereumAddress(input: string): boolean {
        const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
      
        return ethereumAddressRegex.test(input);
      }



}
