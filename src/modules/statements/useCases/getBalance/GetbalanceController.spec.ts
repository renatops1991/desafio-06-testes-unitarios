import { app } from "../../../../app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { OperationType } from "@modules/statements/entities/Statement";

let connection: Connection;

describe("GetbalanceController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should return the total balance in the statement", async () => {
    const user = await request(app).post("/api/v1/users").send({
      email: "foo@foo.com.br",
      name: "foo",
      password: "12345",
    });

    const token = await request(app).post("/api/v1/sessions").send({
      email: "foo@foo.com.br",
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
      .get("/api/v1/statements/balance")
      .send({})
      .set({
        Authorization: `Bearer ${token.body.token}`,
      });

      expect(response.status).toBe(200);
      expect(response.body.balance).toEqual(2)
      expect(response.body).toHaveProperty('statement')
  });
});
