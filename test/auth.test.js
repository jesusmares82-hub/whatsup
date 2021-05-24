const { create } = require("../src/controllers/authController");
const supertest = require("supertest");
const app = require("../src/app");
const request = supertest(app);
const bcrypt = require("bcryptjs");
const { User } = require("../src/models");

let userId = 0;
let token = "";

describe("Flujo de registro", () => {
  it("Registro exitoso de un usuario", async (done) => {
    const user = {
      firstname: "John",
      lastname: "Doe",
      screenname: "John Doe",
      password: bcrypt.hashSync("root", 8),
      email: "JohnDoe@gmail.com",
    };

    //Act  -> Actuar
    let response = await supertest(app).post("/api/v1/signup").send(user);

    //Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("firstname", "John");
    userId = response.body.id;
    done();
  });

  it("Registro fallido de un usuario con correo duplicado", async (done) => {
    const user = {
      firstname: "John",
      lastname: "Doe",
      screenname: "John Doe",
      password: bcrypt.hashSync("root", 8),
      email: "JohnDoe@gmail.com",
    };

    //Act  -> Actuar
    let response = await supertest(app).post("/api/v1/signup").send(user);

    //Assert
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message", "User exists!");

    done();
  });

  it("Registro fallido de un usuario con campos vacios", async (done) => {
    const user = {
      firstname: "John",
      lastname: "Doe",
      screenname: "John Doe",
      password: bcrypt.hashSync("root", 8),
      email: "",
    };

    //Act  -> Actuar
    let response = await supertest(app).post("/api/v1/signup").send(user);

    //Assert
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "empty fields");
    done();
  });

  afterAll(async (done) => {
    await User.destroy({ where: { firstname: "John" } });
    done();
  });
});

describe("Flujo de inicio de sesión", () => {
  it("Inicio de sesión correcto", async (done) => {
    const user = {
      password: "alex123",
      email: "alex@email.com",
    };

    //Act  -> Actuar
    let response = await supertest(app).post("/api/v1/signin").send(user);
    token = response.body.token;
    //Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    done();
  });

  it("Inicio de sesión fallido con credenciales incorrectas", async (done) => {
    const user = {
      password: "alex12",
      email: "alexs@email.com",
    };

    //Act  -> Actuar
    let response = await supertest(app).post("/api/v1/signin").send(user);

    //Assert
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "Wrong credentials");
    done();
  });

  it("Inicio de sesión fallido con campos vacios", async (done) => {
    const user = {
      password: "",
      email: "alexs@email.com",
    };

    //Act  -> Actuar
    let response = await supertest(app).post("/api/v1/signin").send(user);

    //Assert
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "empty fields");
    done();
  });

  it("Inicio de sesión fallido de un usuario que no existe en el sistema", async (done) => {
    const user = {
      password: "ximena20",
      email: "xime80@email.com",
    };

    //Act  -> Actuar
    let response = await supertest(app).post("/api/v1/signin").send(user);

    //Assert
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "Wrong credentials");
    done();
  });
});

describe("Validación de token", () => {
  it("Token valido", async (done) => {
    const user = {
      password: "alex123",
      email: "alex@email.com",
    };

    //Act  -> Actuar
    let response = await supertest(app).post("/api/v1/signin").send(user);
    token = response.body.token;
    console.log(token);
    //Assert
    expect(response.status).toBe(200);

    done();
  });

  it("Token invalido", async (done) => {
    const user = {
      password: "alex123",
      email: "alex@email.com",
    };

    const tokens =
      "eu7777JhbUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic2NyZWVubmFtZSI6ImFsZXhtIiwiZW1haWwiOiJhbGV4QGVtYWlsLmNvbSIsImF2YXRhciI6Ii9wdWJsaWMvc3RhdGljL2ltZy91cGxvYWRzL3VzZXIuanBnIiwiaWF0IjoxNjIxNTQ1NDYyLCJleHAiOjE2MjE1NzQyNjJ9.ME2aaam2wFvMP2GWDN0hvu0V3rHL5dUgbgMp3fqBkao";

    //Act  -> Actuar
    let response = await supertest(app)
      .get("/api/v1/user")
      .send(user)
      .set(`Authorization`, `Bearer ${tokens}`);

    //Assert
    expect(response.status).toBe(500);

    done();
  });
});
