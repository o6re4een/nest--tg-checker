import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm/data-source/DataSource';
import { UserEntity } from './user.entity'; 
import { WalletEntity } from './wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, WalletEntity])],
  providers: [DbService]
})
export class DbModule {}
