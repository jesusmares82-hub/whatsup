const { create } = require("../src/controllers/authController");
const supertest = require("supertest");
const app = require("../src/app");

const bcrypt = require("bcryptjs");
const { Room, Member } = require("../src/models");

let token = "";
let userId = "";
let roomId = "";

beforeAll(async (done) => {
  let user = {
    password: "alex123",
    email: "alex@email.com",
  };

  let response = await supertest(app).post("/api/v1/signin").send(user);
  token = response.body.token;
  userId = response.body.user.id;
  done();
});

describe("Funcionalidad de las salas de chat", () => {
  it("Crear la sala de chat Vengadores", async (done) => {
    let room = {
      name: "Vengadores",
      screenname: "vengadores",
    };
    let response = await supertest(app)
      .post("/api/v1/rooms")
      .send(room)
      .set("Authorization", `Bearer ${token}`);
    roomId = response.body.id;
    //console.log(roomId);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Vengadores");
    done();
  });

  it("Creación fallida de una sala de chat con el mismo nombre", async (done) => {
    let room = {
      name: "Vengadores",
      screenname: "vengadores",
    };

    let response = await supertest(app)
      .post("/api/v1/rooms")
      .send(room)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(403);
    done();
  });

  it("Obtener las salas de chat", async (done) => {
    let room = {
      name: "Vengadores",
      screenname: "vengadores",
    };
    let response = await supertest(app)
      .get("/api/v1/rooms")
      .send(room)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    done();
  });

  afterAll(async (done) => {
    await Member.destroy({ where: { room_id: roomId } });
    await Room.destroy({ where: { id: roomId } });

    done();
  });
});

describe("Miembros de una sala de chat", () => {
  beforeAll(async (done) => {
    let room = {
      name: "Vengadores",
      screenname: "vengadores",
    };
    let response = await supertest(app)
      .post("/api/v1/rooms")
      .send(room)
      .set("Authorization", `Bearer ${token}`);
    roomId = response.body.id;
    done();
  });

  it("Agregando 2 miembros a una sala de chat Vengadores", async (done) => {
    let membersObj = { members: [110, 115] };

    let response = await supertest(app)
      .post(`/api/v1/rooms/${roomId}/addMembers`)
      .send(membersObj)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(201);

    done();
  });

  it("Obtener los miembros de la sala de chat Vengadores", async (done) => {
    let response = await supertest(app)
      .get(`/api/v1/rooms/${roomId}/members`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);

    done();
  });

  it("Petición fallida al tratar de agregar los mismos miembros a la sala Vengadores", async (done) => {
    let membersObj = { members: [110, 115] };

    let response = await supertest(app)
      .post(`/api/v1/rooms/${roomId}/addMembers`)
      .send(membersObj)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(403);

    done();
  });

  it("Eliminar los miembros de la sala de chat excepto el creador de la sala de chat", async (done) => {
    let membersObj = { members: [110, 115] };

    let response = await supertest(app)
      .delete(`/api/v1/rooms/${roomId}/members`)
      .send(membersObj)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);

    done();
  });

  it("Petición fallida al tratar de eliminar al creador de la sala Vengadores", async (done) => {
    let membersObj = { members: [1] };

    let response = await supertest(app)
      .delete(`/api/v1/rooms/${roomId}/members`)
      .send(membersObj)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(400);

    done();
  });

  it("Volver a agregar los 2 miembros a la sala de chat Vengadores", async (done) => {
    let membersObj = { members: [110, 115] };

    let response = await supertest(app)
      .post(`/api/v1/rooms/${roomId}/addMembers`)
      .send(membersObj)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(201);

    done();
  });
});

describe("Envio de mensajes en la sala de chat Avengers", () => {
  it("Envio de mensaje por el administrador de la sala", async (done) => {
    let user = {
      password: "alex123",
      email: "alex@email.com",
    };

    let response = await supertest(app).post("/api/v1/signin").send(user);
    token = response.body.token;
    let adminId = response.body.user.id;
    let text = {
      text: "Hello World",
    };
    let response2 = await supertest(app)
      .post(`/api/v1/rooms/${roomId}/sendMessage`)
      .send(text, adminId, roomId)
      .set("Authorization", `Bearer ${token}`);
    expect(response2.status).toBe(201);

    done();
  });

  it("Envío de mensaje por otro miembro de la sala", async (done) => {
    let user = {
      password: "islas123",
      email: "oislas@email.com",
    };

    let res = await supertest(app).post("/api/v1/signin").send(user);
    let token2 = res.body.token;
    let userID = res.body.user.id;
    let text = {
      text: "Hello I'm Oscar",
    };

    let response2 = await supertest(app)
      .post(`/api/v1/rooms/${roomId}/sendMessage`)
      .send(text, userID, roomId)
      .set("Authorization", `Bearer ${token2}`);
    expect(response2.status).toBe(201);

    done();
  });

  it("Envío fallido de un mensaje por parte de usuario que no pertenezca a la sala", async (done) => {
    //Implementar la lógica necesaria en el controlador
    let user = {
      password: "xime123",
      email: "xime@email.com",
    };

    let res = await supertest(app).post("/api/v1/signin").send(user);
    let token2 = res.body.token;
    let userID = res.body.user.id;
    let text = {
      text: "Hello I'm Oscar",
    };

    let response2 = await supertest(app)
      .post(`/api/v1/rooms/${roomId}/sendMessage`)
      .send(text, userID, roomId)
      .set("Authorization", `Bearer ${token2}`);
    expect(response2.status).toBe(403);

    done();
  });
});

afterAll(async (done) => {
  await Member.destroy({ where: { room_id: roomId } });
  await Room.destroy({ where: { id: roomId } });

  done();
});
//Usar la función beforeAll para poder iniciar sesión y guardar token
//Usar la función beforeAll para poder registrar 2 usuarios antes de las pruebas sobre el set "Miembros de una sala de chat"
