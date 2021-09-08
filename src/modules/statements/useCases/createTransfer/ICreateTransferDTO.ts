import { OperationType } from "@modules/statements/entities/Statement";

export interface ICreateTransferDTO {
  user_id?: string;
  sender_id?: string;
  type?: OperationType;
  amount: number;
  description: string;
}
