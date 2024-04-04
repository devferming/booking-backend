const request = require('supertest');
const app = require('../app');

let id = '';
let token = '';
let hotelId = '';
let reviewId = '';

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
  hotelId = res.body[0].id
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
})

test('GET /reviews debe traer todas las reviews', async () => {
  const res = await request(app).get('/reviews');
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Object);
  expect(res.body.total).toBeDefined();
  expect(res.body.results).toBeDefined();
})

test('POST /reviews debe crear una review', async () => {
  const body = {
    "rating": 4,
    "comment": "Buen lugar para disfrutar en familia",
    "hotelId": hotelId
  }
  const res = await request(app)
    .post('/reviews')
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  reviewId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.comment).toBe(body.comment);
  expect(res.body.id).toBeDefined();
})

test('PUT /reviews/:id debe actualizar la review con el id especificado', async () => {
  body = {
    "rating": 4,
    "comment": "test comment"
  }
  const res = await request(app)
    .put(`/reviews/${reviewId}`)
    .send(body)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.comment).toBe(body.comment);
})

test('DELETE /reviews/:id debe eliminar la review con el id especificado', async () => {
  const res = await request(app)
    .delete(`/reviews/${reviewId}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
})
