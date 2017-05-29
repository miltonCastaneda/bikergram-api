'use strict'

import fixtures from '../fixtures/'

/**
 * Clase stock
 * Clase netamente de pruebas
 * declaro los metodos, los cuales no hacen mas que
 * retornar la informacion como se necesita que se retorne
 * para testear los metodos tratados en este modulo que requieran
 * connectarse a la base de datos.
 */

export default class Db {
  connect () {
    return Promise.resolve(true)
  }

  disconnect () {
    return Promise.resolve(true)
  }

  getImage (id) {
    return Promise.resolve(fixtures.getImage())
  }
}