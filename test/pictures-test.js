'use strict'

import test from 'ava'
import micro, { send } from 'micro'
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

test('Get /:id', async t => {
  let id = uuid.v4()

  /**
   * Se crea el microservicio aqui solo para
   * modo de prueba, es decir solo para el paso
   *  del test,le paso un  request listener
   * del modulo http,
   * puede ser asincrono
   * recibimos el request y response
   * enviamos la respuesta con send(res,200,{id})
   * por metodo get
   */

  let srv = micro(async (req, res) => {
    send(res, 200, { id })
  })

  /**
   * listen corre el servidor y retorna la url
   * en que el servidor esta correndo
   */

  let url = await listen(srv)
  /**
   * resolver la promesa del request le pasaomos
   * la url y retorne los datos en json
   */
  let body = await request({ uri: url, json: true })
  /** validacion del cuerpo sea igual a id */
  t.deepEqual(body, { id })
})

/**
 * Definir test sin necesidad de usar el test aun
 */
test.todo('POST /')
test.todo('POST /:id/like')
