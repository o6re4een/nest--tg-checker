import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class MoralisStreamService {

    // moralisInstance;
   
    streamId: string;
    webhookUrl: string;

    constructor(
        private readonly configServive: ConfigService,
        
        ){
        // console.log("first moralis")
        this.streamId = this.configServive.get("STREAM_ID")
        this.webhookUrl = this.configServive.get("WEBHOOK")
        Moralis.start({
            apiKey: this.configServive.get("MORALIS_API")
        })
        this.changeWebHook(this.webhookUrl)
        // this.moralisInstance =  Moralis
    }
    
    async createStream(){
        
        const stream = {
            chains: [EvmChain.ETHEREUM, EvmChain.POLYGON, EvmChain.ARBITRUM, EvmChain.OPTIMISM, EvmChain.BSC], // list of blockchains to monitor
            description: "monitor users wallets", // your description
            tag: "EVM_TRACKER", // give it a tag
            webhookUrl: this.webhookUrl+"/moralis-stream/stream", // webhook url to receive events,
            includeNativeTxs: true,
          };

          const newStream = await Moralis.Streams.add(stream);
          const { id } = newStream.toJSON();
          
    }
    async addAddressToStream(address: string): Promise<boolean>{
        const id = this.streamId
        try {
            await Moralis.Streams.addAddress({address, id})
            return true
        } catch (error) {
            console.log("Moralis Error", error)
            return false
        }
    }

    async changeWebHook(url: string): Promise<void>{
        try {
            await Moralis.Streams.update({
                id: this.streamId,
                webhookUrl: this.webhookUrl+"/moralis-stream/stream",
            })
        } catch (error) {
            
        }

    }
    async sendToUsers(data){

    }
    // async start(){
    //     await Moralis.start({
            
    //       });
    // }
}
