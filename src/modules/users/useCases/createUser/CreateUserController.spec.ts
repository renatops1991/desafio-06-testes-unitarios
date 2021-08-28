import { Connection, createConnection } from "typeorm";

import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("CreateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not be able create a new user if user already exists!", async () => {
    await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const response = await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    expect(response.error).toBeTruthy();
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('User already exists');
  });

  it('Should be able create a new user', async() => {
   const response =  await request(app).post("/api/v1/users").send({
        email: "bar@foo.com.br",
        name: "foo",
        password: "12345",
      });

      expect(response.error).toBeFalsy();
      expect(response.status).toBe(201);
  })
});
