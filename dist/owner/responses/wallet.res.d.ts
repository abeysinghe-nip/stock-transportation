import { OwnerTransDto } from "../dtos/transaction.dto";
export declare class WalletRes {
    id: string;
    earnings: number;
    withdrawels: number;
    balance: number;
    transactions: OwnerTransDto[];
}
