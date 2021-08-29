import { Connection, createConnection } from "typeorm";

import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("ShowUserProfileController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able show user profile", async () => {
   await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const token = await request(app).post("/api/v1/sessions").send({
      email: "foo@foo.com.br",
      password: "12345",
    });

    const expectResponse = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token.body.token}`
    });

    expect(expectResponse.status).toBe(200);
    expect(expectResponse.body).toHaveProperty('id');
    expect(expectResponse.body.name).toEqual('foo');
    expect(expectResponse.body.email).toEqual('foo@foo.com.br');
  });
});
