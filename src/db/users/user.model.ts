
import { Subscription } from 'rxjs';
import { DataTypes } from 'sequelize';
import { Column, Model, Table, HasMany, ForeignKey, Index , } from 'sequelize-typescript';
import { Wallet } from '../wallets/wallet.model';

@Table
export class User extends Model<User> {
 
    @Index
    @Column
    // @Column({unique: true, primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER})
    id: number;
    
    
    @Column({unique: true, type: DataTypes.INTEGER})
    chatId: number;

    @Column({ defaultValue: true })
    notify: boolean;

    @HasMany(()=>Wallet)
    wallets:  Wallet[];
    



    // @HasMany(()=>Wallet)
    // walets: []

   
}

// User.belongsToMany(Wallet, {through: Subscription,})