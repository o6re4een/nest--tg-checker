import { DataTypes } from 'sequelize';
import { Column, Model, Table, BelongsToMany, HasMany, ForeignKey, Index } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Subscription } from 'rxjs';


@Table
export class Wallet extends Model<Wallet> {
 
    @Index
    @Column
    // @Column({unique: true, primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER})
    id: number;
    

    @Column({unique: true, type: DataTypes.STRING})
    address: number;

    @HasMany(()=>User)
    
    users: User[]


    // @BelongsToMany(() => User, () => Subscription)
    // users: Array<User & {Subscription: Subscription}>
    // @BelongsToMany(()=>User, ()=>Subscription)
    // subscriptions: Subscription[]
    
}