import { User } from "@modules/users/entities/User";
import { type } from "os";
import { createQueryBuilder, getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,
    });

    return this.repository.save(statement);
  }

  async createTransfer({
    user_id,
    sender_id,
    type,
    amount,
    description,
  }: ICreateTransferDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      sender_id,
      amount,
      description,
      type,
    });

    return await this.repository.save(statement);
  }

  async findStatementOperation({
    statement_id,
    user_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id },
    });
  }

  async getUserBalance({
    user_id,
    with_statement = false,
  }: IGetBalanceDTO): Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  > {
    const statement = await this.repository
      .createQueryBuilder("users")
      .where("users.user_id = :id", { id: user_id })
      .orWhere("users.sender_id = :sender_id", { sender_id: user_id })
      .getMany();

    const balance = statement.reduce((acc, operation) => {
      if (
        operation.type === "deposit" ||
        (operation.type === "transfer") !== null
      ) {
        return Math.ceil(acc + operation.amount);
      } else {
        return Math.ceil(acc - operation.amount);
      }
    }, 0);

    if (with_statement) {
      return {
        statement,
        balance,
      };
    }

    return { balance };
  }
}
