'use strict'

import test from 'ava'
import micro from 'micro'
/**
 * permite hacer testing en microservicios con micro
 */
import listen from 'test-listen'
/**
 * permite usar http pero con promesas
 * funciona igual que el modulo request
 * solo que implementa promises
 */
import request from 'request-promise'
import fixtures from './fixtures/'
import pictures from '../pictures'

test.beforeEach(async t => {
  let srv = micro(pictures)
  t.context.url = await listen(srv)
})

test('Get /:id', async t => {
  let image = fixtures.getImage()
  let url = t.context.url
  let body = await request({ uri: `${url}/${image.publicId}`, json: true })
  t.deepEqual(body, image)
})

/**
 * Guardar imagen
 */
test('POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  /**
   * resolveWithfullResponse: true
   * resover la respuesta completa y retornar un response en vez
   * de solo el body
   */
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, image)
})

test.todo('POST /:id/like')
