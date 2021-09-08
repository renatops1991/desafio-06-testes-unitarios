import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateTransferError } from "./CreateTransferError";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createTransferUseCase: CreateTransferUseCase;
describe("CreateTransferUseCase", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createTransferUseCase = new CreateTransferUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("should return an error if the user who will receive the transfer does not exist", async () => {
     const sender = await usersRepositoryInMemory.create({
      name: "foo",
      email: "bar@bar.com.br",
      password: "123456",
    });

    await expect(
      createTransferUseCase.execute({
        user_id: 'foo',
        sender_id: sender.id,
        amount: 1,
        type: OperationType.TRANSFER,
        description: "foo",
      })
    ).rejects.toStrictEqual(new CreateTransferError.UserNotFound());
  });

  it("should return an error if the user who will transfer does not exist", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

    await expect(
      createTransferUseCase.execute({
        user_id: user.id,
        sender_id: 'foo',
        amount: 1,
        type: OperationType.TRANSFER,
        description: "foo",
      })
    ).rejects.toStrictEqual(new CreateTransferError.UserNotFound());
  });


  it("should return an error if the transfer bigger than amount", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

    const sender = await usersRepositoryInMemory.create({
      name: "foo",
      email: "bar@bar.com.br",
      password: "123456",
    });

    await expect(
      createTransferUseCase.execute({
        user_id: user.id,
        sender_id: sender.id,
        amount: 1,
        type: OperationType.TRANSFER,
        description: "foo",
      })
    ).rejects.toStrictEqual(
      new CreateTransferError.TransferInsufficientFunds()
    );
  });

  it("should be able the transfer to an user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "123456",
    });

    const sender = await usersRepositoryInMemory.create({
      name: "foo",
      email: "bar@bar.com.br",
      password: "123456",
    });

    await statementRepositoryInMemory.create({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 1,
        description: "bar",
      });

    const createTransfer = await createTransferUseCase.execute({
        user_id: user.id,
        sender_id: sender.id,
        amount: 1,
        type: OperationType.TRANSFER,
        description: "foo",
      });

      expect(createTransfer).toHaveProperty('id');
   
  });
});
