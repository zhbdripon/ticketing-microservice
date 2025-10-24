import request from "supertest";
import { app } from "../../app";

describe("Sign Up Route", () => {
  it("returns the current user details when authenticated", async () => {
    const email = "test@test.com";
    const password = "password";

    const response = await request(app)
      .post("/api/users/sign-up")
      .send({ email, password });
    
    const currentUserResponse = await request(app)
      .get("/api/users/current-user")
      .set("Cookie", response.get("Set-Cookie")!);

    expect(currentUserResponse.status).toBe(200);
    expect(currentUserResponse.body.currentUser.email).toBe(email);
  });
});

it("returns null when not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/current-user")
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});

