import { Connection, createConnection } from "typeorm";

import request from "supertest";
import { app } from "../../../../app";
import { OperationType } from "@modules/statements/entities/Statement";

let connection: Connection;

describe("GetStatementOperationController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be return an error if statement does not exist!", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const token = await request(app).post("/api/v1/sessions").send({
      email: "foo@foo.com.br",
      password: "12345",
    });

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        user_id: user.body.id,
        type: OperationType.DEPOSIT,
        amount: 2,
        description: "bar",
      })
      .set({
        Authorization: `Bearer ${token.body.token}`,
      });

    const statementIncorrectId = "c6054349-04f8-44a9-8d68-31f24c5c58b2";

    const response = await request(app)
      .get(`/api/v1/statements/${statementIncorrectId}`)
      .set({
        Authorization: `Bearer ${token.body.token}`,
      });

    expect(response.error).toBeTruthy();
    expect(response.status).toBe(404);
  });

  it("should be able to return a statement from user", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const token = await request(app).post("/api/v1/sessions").send({
      email: "foo@foo.com.br",
      password: "12345",
    });

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        user_id: user.body.id,
        type: OperationType.DEPOSIT,
        amount: 2,
        description: "bar",
      })
      .set({
        Authorization: `Bearer ${token.body.token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        Authorization: `Bearer ${token.body.token}`,
      });

    expect(response.status).toBe(200);
  });
});
