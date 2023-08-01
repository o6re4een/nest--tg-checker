import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  chatId: number;

 
  @Column({ default: true })
  notify: boolean;

  // @OneToMany
  
  @ManyToMany(()=>WalletEntity, (wallet)=>wallet.users,
  {
    cascade: true,
  }
  )
 
  wallets: WalletEntity[]
}