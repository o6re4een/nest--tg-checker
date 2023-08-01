import { Model, Table, Column, ForeignKey, BelongsTo, Index, PrimaryKey} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Wallet } from '../wallets/wallet.model';

@Table
export class Subscription extends Model<Subscription> {
    @Index
    @Column
    @PrimaryKey
//   @Column({ primaryKey: true, autoIncrement: true })
    id: number;



    @BelongsTo(()=>User)
    userId: number;

    
    @BelongsTo(()=>Wallet)
    walletId: number;

    // @ForeignKey(() => User)
    // @PrimaryKey
    // @Column
    // userId: number;

    // @BelongsTo(()=>Wallet)
    // wallet: Wallet;

    // @ForeignKey(() => Wallet)
    // @PrimaryKey
    // @Column
    // walletId: number;

    // @ForeignKey(() => User)
    // // @BelongsTo(()=>User)
    // @PrimaryKey
    // @Column
    // userId: number;

    // @ForeignKey(() => Wallet)
    // // @BelongsTo(()=>Wallet)
    // @PrimaryKey
    // @Column
    // walletId: number;

    // @BelongsTo(()=>Wallet)
    // wallet: Wallet;
    // @BelongsTo(()=>User)
    // user: User;

}