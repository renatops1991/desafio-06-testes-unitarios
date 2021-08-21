import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });
  it("should be return an error if the user does not exist", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "bar",
    });

    await expect(showUserProfileUseCase.execute("user")).rejects.toStrictEqual(
      new ShowUserProfileError()
    );
  });

  it("should return all information the authenticated user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "foo",
      email: "foo@bar.com.br",
      password: "bar",
    });

    const expectedUser = await showUserProfileUseCase.execute(user.id);

    expect(expectedUser).toEqual(user);
  });
});
