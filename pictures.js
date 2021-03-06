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

hash.set('GET /tag/:tag', async function byTag (req, res, params) {
  let tag = params.tag
  await db.connect()
  let images = await db.getImagesByTag(tag)
  await db.disconnect()
  send(res, 200, images)
})

hash.set('GET /list', async function list (req, res, params) {
  await db.connect()
  let images = await db.getImages()
  await db.disconnect()
  send(res, 200, images)
})
/**
 * Activar rutas en get
 * /:id capturar parametro en url id
 *
 * Definir ruta
 * la ruta se puede poner como una url
 * o poner url y el metodo
 * ya que en este micro servicio usaremos
 * varias rutas, necesitamos get y post
 *
 * en el segundo parametro, recibe una funcion
 * asicrona para usar async/await sin problemas
 * express no permite esto
 *
 * recibe los parametros: req,res y los
 * parametros que llegaran a esta url
 */
hash.set('GET /:id', async function getPicture (req, res, params) {
  let id = params.id
  await db.connect()
  let image = await db.getImage(id)
  await db.disconnect()
  send(res, 200, image)
})

hash.set('POST /', async function postPicture (req, res, params) {
  let image = await json(req)
  await db.connect()
  let created = await db.saveImage(image)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /:id/like', async function likePicture (req, res, params) {
  let id = params.id
  await db.connect()
  let image = await db.likeImag(id)
  await db.disconnect()
  send(res, 200, image)
})

/**
 * exportar por default la funcion main
 * en la cual contiene la logica de cuando
 * llega una peticion para una ruta determinada
 *
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
