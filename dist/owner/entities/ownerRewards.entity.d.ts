import { Owner } from "./owner.entity";
import { OwnerDebit } from "./ownerDebit.entity";
export declare class OwnerRewards {
    id: string;
    date: Date;
    rewardAmount: number;
    isClaimed: boolean;
    owner: Owner;
    ownerDebit: OwnerDebit;
}
