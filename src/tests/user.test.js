const request = require('supertest');
const app = require('../app');

let id = 0;
let token = '';

test('POST /users debe crear un usuario', async () => {
  const body = {
    "firstName": "Luiggi",
    "lastName": "Parra",
    "email": "noemailxxx@gmail.com",
    "password": "luiggi123",
    "gender": "MALE"
  }
  const res = await request(app).post('/users').send(body);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.firstName).toBe(body.firstName);
  expect(res.body.id).toBeDefined();
})

test('POST /users/login debe hacer un login', async () => {
  const body = {
    "email": "luiggi@gmail.com",
    "password": "luiggi123",
  }
  const res = await request(app).post('/users/login').send(body);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
  expect(res.body.user.email).toBe(body.email);
})

test('POST /users/login con credenciales inválidas debe devolver un error', async () => {
  const body = {
    "email": "incorrecto@gmail.com",
    "password": "incorrecto123",
  }
  const res = await request(app).post('/users/login').send(body);
  expect(res.status).toBe(401);
})

test('PUT /users/:id debe actualizar un usuario', async () => {
  body = {
    "firstName": 'Lucky'
  }
  const res = await request(app)
    .put(`/users/${id}`)
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(body.firstName);
})

test('GET /users debe traer todos los usuarios', async () => {
  const res = await request(app)
    .get('/users')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
})

test('GET /users/:id debe traer el usuario con el id especificado', async () => {
  const res = await request(app)
    .get(`/users/${id}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Object);
})

test('DELETE /users/:id debe eliminar un usuario', async () => {
  const res = await request(app)
    .delete(`/users/${id}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
})