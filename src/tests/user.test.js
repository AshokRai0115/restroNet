const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const express = require("express")
const app = require("../../server.js")

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/testdb"); // Use a test DB
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("User API", () => {
  test("POST /user/signup - should create a new user", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({ email: "test@example.com", password: "123456sa", name: "Test User" });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("successfully user signup.");

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).not.toBeNull();
  });

  test("GET /user/all - should return all users", async () => {
    await User.create({ email: "a@example.com", password: "121113", name: "A" });
    await User.create({ email: "b@example.com", password: "456111", name: "B" });

    const res = await request(app).get("/user/all");
    expect(res.statusCode).toBe(200);
    // expect(res.body.count).toBe(2);
    // expect(res.body.users.length).toBe(2);
    expect(res.body.message).toBe("Successfully retrieved all users.");
  });
});
