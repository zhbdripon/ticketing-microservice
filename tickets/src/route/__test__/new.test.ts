import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../model/ticket";

describe("New Ticket Route", () => {
  it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is signed in", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).toEqual(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    let cookie = global.signin();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({});
    expect(response.status).not.toEqual(401);
  });

  it("returns an error if an invalid title is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        price: 10,
      })
      .expect(400);
  });

    it("returns an error if an invalid price is provided", async () => {
      await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
          title: "valid title",
          price: -10,
        })
        .expect(400);

      await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
          title: "valid title",
        })
        .expect(400);
    });

    it("creates a ticket with valid inputs", async () => {
      let tickets = await Ticket.find({});
      expect(tickets.length).toEqual(0);

      const title = "valid title";
      await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
          title,
          price: 20,
        })
        .expect(201);

      tickets = await Ticket.find({});
      expect(tickets.length).toEqual(1);
    });
});
