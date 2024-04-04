const request = require('supertest');
const app = require('../app');

let id = '';
let token = '';

beforeAll(async () => {
  const res = await request(app).post('/users/login').send({
    email: 'test@gmail.com',
    password: 'test123'
  })

  id = res.body.id;
  token = res.body.token;
})

test('POST /cities debe crear una ciudad', async () => {
  const body = {
    "name": "Maracaibo",
    "country": "Venezuela",
    "countryId": "VE"
  }
  const res = await request(app)
    .post('/cities')
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.name).toBe(body.name);
  expect(res.body.id).toBeDefined();
})

test('GET /cities debe traer todas las ciudades', async () => {
  const res = await request(app).get('/cities');
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
})

test('GET /cities/:id debe traer la ciudad con el id especificado', async () => {
  const res = await request(app).get(`/cities/${id}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Object);
})

test('PUT /cities/:id debe actualizar una ciudad', async () => {
  body = {
    "name": "Maracaibo DC",
  }
  const res = await request(app)
    .put(`/cities/${id}`)
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(body.name);
})

test('DELETE /cities/:id debe eliminar una ciudad', async () => {
  const res = await request(app)
    .delete(`/cities/${id}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
})
