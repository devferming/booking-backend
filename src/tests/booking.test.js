const request = require('supertest');
const app = require('../app');

let id = '';
let token = '';
let bookingId = '';
let hotelId = '';

beforeAll(async () => {
  const res = await request(app).post('/users/login').send({
    email: 'test@gmail.com',
    password: 'test123'
  })

  id = res.body.id;
  token = res.body.token;
})

test('GET /bookings debe traer todas las bookings', async () => {
  const res = await request(app).get('/bookings').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
})

test('GET /hotels debe traer todos los hoteles', async () => {
  const res = await request(app).get('/hotels');
  hotelId = res.body[0].id
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
})

test('POST /bookings debe crear una bookings', async () => {
  const body = {
    "checkIn": "01-20-2024",
    "checkOut": "01-27-2024",
    "hotelId": hotelId
  }
  const res = await request(app)
    .post('/bookings')
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  bookingId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
})

test('PUT /bookings/:id debe actualizar la booking con el id especificado', async () => {
  body = {
    "checkIn": "10-20-2024",
    "checkOut": "10-27-2024"
  }
  const res = await request(app)
    .put(`/bookings/${bookingId}`)
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
})

test('DELETE /bookings/:id debe eliminar la booking con el id especificado', async () => {
  const res = await request(app)
    .delete(`/bookings/${bookingId}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
})
