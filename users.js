'use strict'

import { send, json } from 'micro'
import HttpHash from 'http-hash'
import Db from 'bikergram-db'
import config from './config'
import DbStub from './test/stub/db'

const env = process.env.NODE_ENV || 'production'
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

/**
 * instancia HttpHash
 */
const hash = HttpHash()

hash.set('POST /', async function saveUser (req, res, params) {
  let user = await json(req)
  await db.connect()
  let created = await db.saveUser(user)
  await db.disconnect()

  delete created.email
  delete created.password

  send(res, 201, created)
})

hash.set('GET /:username', async function getUser (req, res, params) {
  let username = params.username
  await db.connect()
  let user = await db.getUser(username)
  await db.disconnect()
  delete user.email
  delete user.password

  send(res, 200, user)
})

/**
 * exportar por default la funcion main
 * en la cual contiene la logica de cuando
 * llega una peticion para una ruta determinada
 */
export default async function main (req, res) {
  /**
   * para saber que peticion http estoy
   * recibiendo traigo el metodo y la url
   * del request
   */
  let { method, url } = req
  /**
   * validar si hay alguna ruta que corresponda
   * con el patron ingresado en hash.get()
   */
  let match = hash.get(`${method.toUpperCase()} ${url}`)
  /**
   * la forma de saber si la ruta esta definida
   * es saber si el handler fue definido
   *
   * handler es la funcion que ejecutaremos
   * en todo el proceso de ejecucion
   *
   * si hay handler ejecutamos el codigo
   * de lo contrario 404, para esto importar
   * send de micro
   */
  if (match.handler) {
    /**
     * ejecutar el handler
     * es decir ejecutar la ruta
     * controlar errores, puede fallar una de
     * las promises
     */
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, { error: 'route not found' })
  }
}
