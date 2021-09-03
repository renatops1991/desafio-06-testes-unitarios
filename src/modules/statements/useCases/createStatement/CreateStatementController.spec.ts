import { app } from "../../../../app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { OperationType } from "@modules/statements/entities/Statement";

let connection: Connection;

describe("CreateStatementController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to return an error if withdraw bigger than the amount", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "bar@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const token = await request(app).post("/api/v1/sessions").send({
      email: "bar@foo.com.br",
      password: "12345",
    });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: user.body.id,
        type: OperationType.WITHDRAW,
        amount: 1,
        description: "bar",
      })
      .set({
        Authorization: `Bearer ${token.body.token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual("Insufficient funds");
  });

  it("should be able to create a new deposit", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "bar@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const token = await request(app).post("/api/v1/sessions").send({
      email: "bar@foo.com.br",
      password: "12345",
    });

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        user_id: user.body.id,
        type: OperationType.DEPOSIT,
        amount: 1,
        description: "bar",
      })
      .set({
        Authorization: `Bearer ${token.body.token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.amount).toEqual(1);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to create a new withdraw", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "bar@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const token = await request(app).post("/api/v1/sessions").send({
      email: "bar@foo.com.br",
      password: "12345",
    });

    await request(app)
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
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: user.body.id,
        type: OperationType.WITHDRAW,
        amount: 1,
        description: "bar",
      })
      .set({
        Authorization: `Bearer ${token.body.token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.amount).toEqual(1);
    expect(response.body).toHaveProperty("id");
  });
});
