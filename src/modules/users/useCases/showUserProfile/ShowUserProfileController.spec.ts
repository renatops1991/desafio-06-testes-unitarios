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

  it("Should not be able show user profile if user does not exist", async () => {
    //TODO
  });

  it("Should be able show user profile", async () => {
    //TODO
  });
});
