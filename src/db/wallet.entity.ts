import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class WalletEntity {
  
    @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  address: string;

  @ManyToMany(()=>UserEntity, (user)=>user.wallets)
  @JoinTable()
  users: UserEntity[]
 
}