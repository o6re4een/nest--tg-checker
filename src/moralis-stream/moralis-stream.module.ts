import { Module, forwardRef } from '@nestjs/common';
import { MoralisStreamController } from './moralis-stream.controller';
import { MoralisStreamService } from './moralis-stream.service';
import { TelegramModule } from 'src/telegram/telegram.module';



@Module({
    controllers: [MoralisStreamController],
    providers: [MoralisStreamService ],
    imports: [forwardRef(()=>TelegramModule)],
   
   
    exports: [MoralisStreamService]
  
})
export class MoralisStreamModule {
    // constructor(private moralisServ: MoralisStreamService,

    //     ){}
}
