// utils
const isFunction = obj => typeof obj === 'function'
const toString = Object.prototype.toString
const isObject = obj => toString.call(obj) === '[object Object]'
const isThenable = obj => (isObject(obj) || isFunction(obj)) && 'then' in obj
const isPromise = promise => promise instanceof Promise

// 2.1 Promise States
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// begin here
// promise1
function Promise() {
  this.state = PENDING
  this.result = null
  // 2.2.6
  this.callbacks = []
}

function transfrom (promise, state, result) {
  if (state !== PENDING) return
  promise.state = state
  promise.result = result
}
// then调用时机？ 2.2.6 需要在promise被决议后按注册顺序执行；
// 2.2 A promise’s then method accepts two arguments
Promise.prototype.then = function(onFulfilled, onRejected) {
  // 2.2.7 promise2
  return new Promise((resolve, reject) => {
    const callback = { onFulfilled, onRejected, resolve, reject }

    if (this.state === PENDING) {
      this.callbacks.push(callback)
    } else {
      // 2.2.4
      setTimeout(() => handleCallback(callback, this.state, this.result), 0);
    }
  })
}

// 2.2.4
function handleCallback(callback, state, result) {
  const { onFulfilled, onRejected, resolve, reject } = callback;

  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    } else {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
    }
  } catch (reason) {
    reject(reason)
  }
}


module.exports = Promise
