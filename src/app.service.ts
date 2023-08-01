import { Injectable } from '@nestjs/common';
// import { Repository, Sequelize } from 'sequelize-typescript';

import { Repository } from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm"
import { UserEntity } from './db/user.entity';
import { WalletEntity } from './db/wallet.entity';
import {ConfigService} from "@nestjs/config"
import { MoralisStreamService } from './moralis-stream/moralis-stream.service';

// @Injectable()
// export class AppService {
//   getHello(): string {
//     return 'Hello World!';
//   }
// }
@Injectable()
export class AppService {
  

}

