import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Wallet } from './wallets/wallet.model';

@Entity("Subscription")
export class SubscriptionEntity {
 
    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  walletId: number;

 
  @Column()
  userId: number;
}