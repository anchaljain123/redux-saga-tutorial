import { put, takeEvery, all, call, takeLatest, take, select, fork } from 'redux-saga/effects'
import Api from './api';


const delay = (ms) => new Promise(res => setTimeout(res, ms))

// const content = yield cps(readFile, '/path/to/file')
function* watchAndLog() {
    while (true) {
        const action = yield take('*')
        const state = yield select()
    
        console.log('action', action)
        console.log('state after', state)
      }
  }

function fetchProductsApi() {
    return Api.fetch('/products')
      .then(response => ({ response }))
      .catch(error => ({ error }))
  }
  
  function* fetchProducts() {
    const { response, error } = yield call(fetchProductsApi)
    if (response)
      yield put({ type: 'PRODUCTS_RECEIVED', products: response })
    else
      yield put({ type: 'PRODUCTS_REQUEST_FAILED', error })
  }

export function* helloSaga() {
    console.log('Hello Sagas!')
}

//api call
export function* fetchData(action) {
    try {
        //yield Api.fetch('/products')
       const data = yield call(Api.fetchUser, action.payload.url) //'call' use for testing
        /*
       {
            CALL: {
                fn: Api.fetch,
                args: ['./products']
            }
        }     
        */
       //-----------------dispatching actions-------------------

       // dispatch({ type: 'FETCH_SUCCEEDED', data })
       yield put({type: "FETCH_SUCCEEDED", data}) //for testing use 'put'

    } catch (error) {
       yield put({type: "FETCH_FAILED", error})
    }
 }

// Our worker Saga: will perform the async increment task
export function* incrementAsync() {
    yield call(delay, 1000)
 
    yield put({ type: 'INCREMENT' })
}
  
  // Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchIncrementAsync() {
    yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}


function* authorize(user, password) {
    try {
      const token = yield call(Api.authorize, user, password)
      yield put({type: 'LOGIN_SUCCESS', token})
      return token
    } catch(error) {
      yield put({type: 'LOGIN_ERROR', error})
    }
  }

  function* loginFlow() {
    while (true) {
        const {user, password} = yield take('LOGIN_REQUEST')
        yield fork(authorize, user, password)
        yield take(['LOGOUT', 'LOGIN_ERROR']) //now using fork we can do logout before user is authorised 
        yield call(Api.clearItem, 'token')
      }
  }


export default function* rootSaga() {
    yield all([
      helloSaga(),
      watchAndLog(),
      watchIncrementAsync(),
     yield takeLatest('FETCH_REQUESTED', fetchData)
    ])
  }