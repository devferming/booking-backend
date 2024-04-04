const request = require('supertest');
const app = require('../app');

let id = '';
let token = '';
let cityId = '';

beforeAll(async () => {
  const res = await request(app).post('/users/login').send({
    email: 'test@gmail.com',
    password: 'test123'
  })

  id = res.body.id;
  token = res.body.token;
})

test('GET /hotels debe traer todos los hoteles', async () => {
  const res = await request(app).get('/hotels');
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
})

test('POST /cities debe crear una ciudad', async () => {
  const body = {
    "name": "city test",
    "country": "Country test",
    "countryId": "TEST"
  }
  const res = await request(app)
    .post('/cities')
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  cityId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.name).toBe(body.name);
  expect(res.body.id).toBeDefined();
})

test('POST /hotels debe crear un hotel', async () => {
  const body = {
    "name": "Hotel Test",
    "description": "Este moderno hotel con vistas al mar Caribe y al puerto deportivo de Santa Marta se encuentra a 16 km del aeropuerto internacional Simón Bolívar y a 6 km de los deportes acuáticos en la playa de arena blanca de Rodadero.",
    "price": 71.70,
    "address": "Cra. 1c #24-04, Comuna 2, Santa Marta, Magdalena, Colombia",
    "lat": "25.0850",
    "lon": "-77.3241",
    "cityId": cityId
  }
  const res = await request(app)
    .post('/hotels')
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.name).toBe(body.name);
  expect(res.body.id).toBeDefined();
})

test('GET /hotels/:id debe traer el hotel con el id especificado', async () => {
  const res = await request(app).get(`/hotels/${id}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Object);
})

test('PUT /hotels/:id debe actualizar un hotel', async () => {
  body = {
    "name": "PUT Hotel test",
  }
  const res = await request(app)
    .put(`/hotels/${id}`)
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(body.name);
})

test('DELETE /hotels/:id debe eliminar un hotel', async () => {
  const res = await request(app)
    .delete(`/hotels/${id}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
})

test('DELETE /cities/:id debe eliminar una ciudad', async () => {
  const res = await request(app)
    .delete(`/cities/${cityId}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
})