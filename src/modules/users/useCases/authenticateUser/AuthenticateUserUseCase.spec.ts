import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should not be able to authenticate if user does not exists", async () => {
    const user = await createUserUseCase.execute({
      name: "foo",
      email: "foo@bar.com.br",
      password: "12345",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "bar@foo.com.br",
        password: user.password,
      })
    ).rejects.toStrictEqual(new IncorrectEmailOrPasswordError());
  });

  it("Should not be able to authenticate if password is wrong", async () => {
    const user = await createUserUseCase.execute({
      name: "foo",
      email: "foo@bar.com.br",
      password: "12345",
    });
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "passwordIsWrong",
      })
    ).rejects.toStrictEqual(new IncorrectEmailOrPasswordError());
  });

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "foo",
      email: "foo@bar.com.br",
      password: "12345",
    };

    await createUserUseCase.execute(user);

    const expectedAuthenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(expectedAuthenticate).toHaveProperty("token");
  });
});
