import request from "supertest";
import { app } from "../../app";

it("clears the cookie after sign out", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "password",
    });

  const response = await request(app)
    .post("/api/users/sign-out")
    .send();

  expect(response.get("Set-Cookie")![0].includes("session=;")).toBe(true);
});
