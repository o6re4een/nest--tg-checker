import { Body, Controller, HttpStatus, Post, RawBodyRequest, Req, Res, Get } from '@nestjs/common';
import { MoralisStreamService } from './moralis-stream.service';
import { Response } from 'express';
import { TelegramService } from 'src/telegram/telegram.service';
import { IWebhook } from "@moralisweb3/streams-typings";

@Controller('moralis-stream')
export class MoralisStreamController {
    constructor(private readonly telegramService: TelegramService){
        
    }


    @Post("/stream")
    
    async retranslate(@Body() body: IWebhook, @Req() request: Request, @Res() res: Response){
        console.log(body)
        this.telegramService.notify(body)
        return res.status(HttpStatus.OK).send()
    }


    @Get("/stream")
    async getData(@Req() request: Request, @Res() res: Response){
        console.log(request.body)
        return res.status(HttpStatus.OK).send()
    }


}
