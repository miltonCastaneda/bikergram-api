'use strict'

import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import fixtures from './fixtures/'
import users from '../users'

test.beforeEach(async t => {
  let srv = micro(users)
  t.context.url = await listen(srv)
})

test('POST /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      name: user.name,
      username: user.username,
      password: user.password,
      email: user.email
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)
  /**
   * quitar propiedad email y propiedad password
   * se quitan por que de base de datos no debe de traer el email
   * ni el password por motivos de seguridad
   */
  delete user.email
  delete user.password
  /**
   * 201 hace referencia a que el objeto fue creado
   */
  t.is(response.statusCode, 201)
  t.deepEqual(response.body, user)
})

test.todo('GET /:username')
