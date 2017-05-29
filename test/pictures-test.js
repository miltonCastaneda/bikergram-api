'use strict'

import test from 'ava'
import micro from 'micro'
import uuid from 'uuid-base62'
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
import pictures from '../pictures'

test('Get /:id', async t => {
  let id = uuid.v4()

  /**
   * en vez de crear la funcion asincrona le pasamos lo que
   * exporta micro en pictures mediante send
   */

  let srv = micro(pictures)

  /**
   * listen corre el servidor y retorna la url
   * en que el servidor esta correndo
   */

  let url = await listen(srv)
  /**
   * resolver la promesa del request le pasaomos
   * la url y concatenamos el id,
   * json: true, para verificar la respuesta retorne los datos
   * en json
   *
   */
  let body = await request({ uri: `${url}/${id}`, json: true })
  /** validacion del cuerpo sea igual a id */
  t.deepEqual(body, { id })
})

/**
 * Definir test sin necesidad de usar el test aun
 */
test.todo('POST /')
test.todo('POST /:id/like')
