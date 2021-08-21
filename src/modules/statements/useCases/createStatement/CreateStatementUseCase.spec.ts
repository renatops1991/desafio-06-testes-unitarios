import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });
  it("Should a return error if user does not exists!", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "user",
        type: OperationType.DEPOSIT,
        amount: 20,
        description: "foo",
      })
    ).rejects.toStrictEqual(new CreateStatementError.UserNotFound());
  });

  it("Should be a return error if withdraw bigger than the amount", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 1,
        description: "bar",
      })
    ).rejects.toStrictEqual(new CreateStatementError.InsufficientFunds());
  });

  it("Should be able to create a new deposit", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

    const createStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1,
      description: "bar",
    });

    expect(createStatement).toHaveProperty("id");
  });

  it("Should be able to create a new withdraw", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

   await statementRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "bar",
    });


    const createStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 10,
      description: "bar",
    });

    expect(createStatement).toHaveProperty("id");
  });
});
