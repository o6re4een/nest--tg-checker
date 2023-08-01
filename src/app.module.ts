import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';


import { TypeOrmModule } from '@nestjs/typeorm';

import { DbModule } from './db/db.module';
import { MoralisStreamModule } from './moralis-stream/moralis-stream.module';








@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TelegramModule, 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'EVM_TRACKER2',
      entities: [__dirname + '/../**/*.entity.js'],
      // synchronize: true,
      // autoLoadEntities: true,
      
    }),
    
    DbModule,
    MoralisStreamModule

  
    
    
  ],

  
  providers: [],
  exports: [],
  controllers: []
})
export class AppModule {
    // constructor(private readonly mr: MoralisStreamService){}
 
}
