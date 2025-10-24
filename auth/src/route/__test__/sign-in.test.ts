import request from "supertest";
import { app } from "../../app";

it("returns a 200 on successful sign in", async () => {
  await request(app).post("/api/users/sign-up").send({
    email: "test@test.com",
    password: "password",
  });

  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/sign-in")
    .send({
      email: "invalid-email",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "short",
    })
    .expect(400);
});
