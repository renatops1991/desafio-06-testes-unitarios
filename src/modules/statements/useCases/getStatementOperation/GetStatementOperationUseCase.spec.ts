import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperation: GetStatementOperationUseCase;

describe("GetStatementOperationUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperation = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should be return an error if user does not exists", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

    const statement = await statementRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1,
      description: "bar",
    });

    await expect(
      getStatementOperation.execute({
        user_id: "user",
        statement_id: statement.id,
      })
    ).rejects.toStrictEqual(new GetStatementOperationError.UserNotFound());
  });

  it("Should be return an error if statement does not exists", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

    const statement = await statementRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1,
      description: "bar",
    });

    await expect(
      getStatementOperation.execute({
        user_id: user.id,
        statement_id: "statementDoesNotExists",
      })
    ).rejects.toStrictEqual(new GetStatementOperationError.StatementNotFound());
  });

  it("Should be able return a statement by user id and statement id", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

    const statement = await statementRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1,
      description: "bar",
    });

    const expectedStatement = await getStatementOperation.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(expectedStatement).toHaveProperty('id');
    expect(expectedStatement.user_id).toEqual(user.id);
    expect(expectedStatement.amount).toEqual(1);
    expect(expectedStatement.type).toEqual('deposit');
  });
});
