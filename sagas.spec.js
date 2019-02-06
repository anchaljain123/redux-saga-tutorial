import test from 'tape';

import { put, call, cps } from 'redux-saga/effects'
import { incrementAsync, delay, fetchData } from './saga'

test('incrementAsync Saga test', (assert) => {
  const gen = incrementAsync()
  const iterator = fetchData()
  assert.deepEqual(
    gen.next().value,
    call(delay, 1000),
    'incrementAsync Saga must call delay(1000)'
  )

  assert.deepEqual(
    gen.next().value,
    put({type: 'INCREMENT'}),
    'incrementAsync Saga must dispatch an INCREMENT action'
  )

  assert.deepEqual(
    gen.next(),
    { done: true, value: undefined },
    'incrementAsync Saga must be done'
  )
  assert.deepEqual(
    iterator.next().value,
    call(Api.fetch, '/products'), // no need for mocking api
    "fetchProducts should yield an Effect call(Api.fetch, './products')"
  )

  assert.deepEqual(iterator.next().value, cps(readFile, '/path/to/file') )


    assert.deepEqual(
      iterator.throw(error).value,
      put({ type: 'PRODUCTS_REQUEST_FAILED', error }),
      "fetchProducts should yield an Effect put({ type: 'PRODUCTS_REQUEST_FAILED', error })"
    )


  assert.end()
});