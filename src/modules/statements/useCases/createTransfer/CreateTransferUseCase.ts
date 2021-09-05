import { OperationType, Statement } from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    sender_id,
    type,
    amount,
    description,
  }: ICreateTransferDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);
    const userReceive = await this.usersRepository.findById(sender_id);

    if (!user) {
      throw new CreateTransferError.UserNotFound();
    }

    if (!userReceive) {
      throw new CreateTransferError.UserNotFound();
    }
    const { balance } = await this.statementsRepository.getUserBalance({
      user_id,
    });

    if(amount > balance){
        throw new CreateTransferError.TransferInsufficientFunds();
    }

    const createTransfer = await this.statementsRepository.createTransfer({
      user_id,
      sender_id,
      type,
      amount,
      description
    });

    return createTransfer;
  }
}
