import { Owner } from "./owner.entity";
import { OwnerCredit } from "./ownerCredit.entity";
import { OwnerDebit } from "./ownerDebit.entity";
export declare class OwnerWallet {
    id: string;
    earnings: number;
    withdrawals: number;
    holderName: string;
    bank: string;
    branch: string;
    accNumber: string;
    dwollaUrl: string;
    owner: Owner;
    ownerCredit: OwnerCredit[];
    ownerDebit: OwnerDebit[];
}
