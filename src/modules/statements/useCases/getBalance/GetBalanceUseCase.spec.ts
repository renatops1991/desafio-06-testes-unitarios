import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      usersRepositoryInMemory
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should be return an error if user does not exists!", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "user" })
    ).rejects.toStrictEqual(new GetBalanceError());
  });
  
  it("Should return the statement of the user authenticated", async () => {
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


    const expectedStatements = await getBalanceUseCase.execute({ user_id: user.id});

    expect(expectedStatements.statement).toStrictEqual([createStatement]);
    expect(expectedStatements.statement.length).toBeGreaterThanOrEqual(1);
    expect(expectedStatements.statement[0]).toHaveProperty('id');
 
  });

  it("Should return the total balance in the statement", async () => {
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


    const expectedStatements = await getBalanceUseCase.execute({ user_id: user.id});

    expect(expectedStatements).toHaveProperty('balance'); 
  });
});
