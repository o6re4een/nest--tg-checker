import { Module, forwardRef } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './telegram-config.factory';
// import { UsersModule } from 'src/db/users/users.module';
// import { UsersService } from 'src/db/users/users.service';
// import { InjectModel } from '@nestjs/sequelize';

// import { User } from 'src/db/users/user.model';
// import { AppService } from 'src/app.service';
// import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/user.entity';
import { WalletEntity } from 'src/db/wallet.entity';
// import { MoralisStreamService } from 'src/moralis-stream/moralis-stream.service';
import { MoralisStreamModule } from 'src/moralis-stream/moralis-stream.module';




@Module({
  imports: [TelegrafModule.forRootAsync(options()), TypeOrmModule.forFeature([UserEntity, WalletEntity]), forwardRef(()=>MoralisStreamModule)], 
  providers: [TelegramService, DbService,],
  exports: [TelegramService]
  // exports: [AppService]
})
export class TelegramModule {}
