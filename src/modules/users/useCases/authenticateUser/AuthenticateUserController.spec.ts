import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("AuthenticateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not be able to authenticate if incorrect email", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "bar@foo.com.br",
      password: "12345",
    });

    expect(response.status).toBe(401);
  });

  it("Should not be able to authenticate if incorrect password", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "foo@foo.com.br",
      password: "incorrectPassword",
    });

    expect(response.status).toBe(401);
  });

  it("Should be able to authenticate user", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "foo@foo.com.br",
      password: "12345",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  });
});
