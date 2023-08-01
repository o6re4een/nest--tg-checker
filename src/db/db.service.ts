import { Injectable } from '@nestjs/common';
// import { Repository, Sequelize } from 'sequelize-typescript';
import { In } from "typeorm"
import { Repository } from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm"
import { UserEntity } from './user.entity'; 
import { WalletEntity } from './wallet.entity';
import {ConfigService} from "@nestjs/config"
import { appDataSource } from 'src/app.datasource';
import { RelationQueryBuilder } from 'typeorm';

import Moralis from "moralis";



@Injectable()
export class DbService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(WalletEntity) private readonly walletRepository: Repository<WalletEntity>,
        // @InjectRepository(SubscriptionEntity) private readonly subsRepository: Repository<SubscriptionEntity>
      ) {
        appDataSource.initialize().then()
      }
    
    async getOrCreateUserByChatId(chatId: number): Promise<UserEntity>{


        
        const User: UserEntity | null = await this.userRepository.findOneBy({chatId:chatId})
        if(User){
            return User
        }

        const user = new UserEntity()
        user.chatId = chatId;
        await this.userRepository.manager.save(user)
        return user
    
    }

    async addWalletToDb( walletAddresses: string[]): Promise<WalletEntity[]>{
        const walletEntitys:WalletEntity[] = []

        for(let address of walletAddresses){
            const tempEnt: WalletEntity = this.walletRepository.create({address: address})
            // const tempEnt = new WalletEntity()
            // tempEnt.address = address
            walletEntitys.push(tempEnt)
            
        }
        await appDataSource.createQueryBuilder().insert().into(WalletEntity).values(walletEntitys).orIgnore().execute()
        
        // const wallets: WalletEntity[] = await appDataSource.createQueryBuilder().select("wallet").from(WalletEntity, "wallet").where("wallet.address IN (:...addresses)", {addresses: walletAddresses}).execute()
        const wallets: WalletEntity[] = await this.walletRepository.find({
            where: {
                address: In(walletAddresses)
            }
        })
        // console.log(wallets)
        return wallets
    }
    // getUniqueListBy(arr, key: string) {
    //     return [...new Map(arr.map(item => [item[key], item])).values()]
    // }

    async addNonExistingWalletsToUser(chatId: number, walletAddresses: string[]): Promise<WalletEntity[]> | null {
        
        //Load UserEntity 
        const user = await this.userRepository.findOne({ where: { chatId } });
        user.wallets = await appDataSource.createQueryBuilder().relation(UserEntity, "wallets").of(user).loadMany();

        if (!user) {
          throw new Error('User not found.');
        }
        const walletsToLink = await this.addWalletToDb(walletAddresses)
        const addedWallets: WalletEntity[] =[];
     
      
        // appDataSource.createQueryBuilder().insert().into(WalletEntity).values(walletEntitys).orIgnore("ON CONFLICT (address) DO SELECT").select().where("address IN (:...addresses)", {addresses: walletAddresses}).execute()

        for(let wallet of walletsToLink){
            try {

                await appDataSource.createQueryBuilder().relation(UserEntity, "wallets").of(user).add(wallet)
                
                addedWallets.push(wallet)
            } catch (error) {
                // console.log(error?.code)
                // console.log(error)
            }
        }

            
        
        return addedWallets

      
    }
    async getChatIdsByWalletAddress(walletAddress: string): Promise<number[]> {
       
        const existingWallet = await this.walletRepository.findOneBy({ address: walletAddress });

        if (!existingWallet) {
            return null; // Return null if walletAddress is not found in WalletEntity
        }
        // Using the QueryBuilder to construct the query
        const queryBuilder = this.userRepository.createQueryBuilder('user')
        .innerJoin('user.wallets', 'wallet')
        .where('wallet.address = :address', { address: walletAddress })
        .andWhere('user.notify = :notify', { notify: true }) // Exclude users with notify: false
        .select('user.chatId');
    
      // Fetch the chatIds
      const users = await queryBuilder.getMany();
      return users.map(user => user.chatId);
      }


    async removeWalletsForUser(chatId: number, walletAddressesToRemove: string[]): Promise<void> {
        try {

            const user: UserEntity = await appDataSource.manager.findOneBy(UserEntity, {
                chatId: chatId,
            })
            // Find the user with the specified ChatID
            // user.wallets = await appDataSource.createQueryBuilder().relation(UserEntity, "wallets").of(user).loadMany()
            const foundWallets: WalletEntity[] = await this.walletRepository.find({
                where: {
                    address: In(walletAddressesToRemove)
                }
            }) 
      
          
         
      
          if (!user) {
            throw new Error(`User not found.`);
          }
      
          // Remove the specified wallet addresses from the user's wallets
        //   user.wallets = user.wallets.filter(wallet => !walletAddressesToRemove.includes(wallet.address));
          await appDataSource.createQueryBuilder().relation(UserEntity, "wallets").of(user).remove(foundWallets)
          
      
        } catch (error) {
          // Handle errors appropriately
          console.error('Error removing wallets for user:', error);
          throw error;
        }
      }

    async getAllWalletsForUser(chatId: number): Promise<string[]> | null {
        try {
            const user: UserEntity = await appDataSource.manager.findOneBy(UserEntity, {
                chatId: chatId,
            })
            const wallets: WalletEntity[] = await appDataSource.createQueryBuilder().relation(UserEntity, "wallets").of(user).loadMany()

            const addreses:string[] = []

            for(let tmpWalletEntity of wallets){
                addreses.push(tmpWalletEntity.address)
            }
            return addreses


        } catch (error) {
            console.log(error)
            return null;
        }
    }
    async disableNotificationsByChatId(chatId: number): Promise<void> {
        
      
        try {
          // Find the user by userId
          const user = await this.userRepository.findOneBy({
            chatId: chatId,
          });
      
          if (!user) {
            throw new Error(`User with ID ${chatId} not found.`);
          }
      
          // Update the notify property to false
          user.notify = false;
      
          // Save the updated user
          await this.userRepository.save(user);
        } catch (error) {
          // Handle errors appropriately
          console.error('Error disabling notifications for user:', error);
          throw error;
        }
      }
      async enableNotificationsByChatId(chatId: number): Promise<void> {
        
      
        try {
          // Find the user by userId
          const user = await this.userRepository.findOneBy({
            chatId: chatId,
          });
      
          if (!user) {
            throw new Error(`User with ID ${chatId} not found.`);
          }
      
          // Update the notify property to false
          user.notify = true;
      
          // Save the updated user
          await this.userRepository.save(user);
        } catch (error) {
          // Handle errors appropriately
          console.error('Error disabling notifications for user:', error);
          throw error;
        }
      }

      async getAllUserWalletAddresses(chatId: number): Promise<string[]> {
       
      
        try {
            // Using the QueryBuilder to construct the query
            const queryBuilder = this.userRepository.createQueryBuilder('user')
              .leftJoinAndSelect('user.wallets', 'wallet')
              .where('user.chatId = :chatId', { chatId })
              .select('wallet.address');
        
            // Fetch the user along with the wallet addresses
            const user = await queryBuilder.getOne();
        
            if (!user) {
              return null; // Return null if user with chatId is not found
            }
        
            // Extract and return wallet addresses
            return user.wallets.map(wallet => wallet.address);
          } catch (error) {
            // Handle errors appropriately
            console.error('Error fetching user wallet addresses by chatId:', error);
            throw error;
          }
      }  
   
}
