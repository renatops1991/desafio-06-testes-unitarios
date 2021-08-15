import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
describe("CreateUserUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should not be able create a new user with existing email", async () => {
   await expect(async () => {
      const user = await createUserUseCase.execute({
        name: "foo",
        email: "foo@bar.com.br",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "foo",
        email: user.email,
        password: "123455",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });

  it("Should be able create a new user", async () => {
    const expectedUser = await createUserUseCase.execute({
      name: "foo",
      email: "bar@foo.com.br",
      password: "123456",
    });

    expect(expectedUser).toHaveProperty("id");
  });
});
