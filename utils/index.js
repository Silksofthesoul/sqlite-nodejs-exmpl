const type = val => typeof val;

const isExist = (arg, boolCheck = false, stringCheck = false) => {
  let conditions = [
    arg === undefined,
    arg === null,
    Number.isNaN(arg),
  ];
  if (boolCheck === true) conditions.push(arg === false);
  if (stringCheck === true) conditions.push(arg === '');
  return !conditions.some(item => item === true);
};

const isFunction = val => {
  if (!isExist(val)) return false;
  if (type(val) === 'function') return true;
  return false;
};
const isString = val => type(val) === 'string';

const isPromise = fn => fn instanceof Promise;
const isAsync = func => {
  const s = func.toString().trim();
  return !!(
    s.match(/^async /) ||
    s.match(/return _ref[^\.]*\.apply/)
  );
};

const pipe = (...fns) => (...args) => fns.reduce((v, f) => Array.isArray(v) ? f(...v) : f(v), args);
const pipeAsync = (...fns) => async (...args) => {
  let res = args;
  for (fn of fns) {
    if (isAsync(fn)) res = Array.isArray(res) ? await fn(...res) : await fn(res);
    else if (isPromise(fn)) res = Array.isArray(res) ? await fn(...res) : await fn(res);
    else res = Array.isArray(res) ? fn(...res) : fn(res);
  }
  return res;
};

const asyncAltQueue = (...fns) => {
  return function (val) {
    return new Promise(async function (resolve) {
      let res = false;
      for (let f of fns) {
        res = await f(val);
        if (res !== false) return resolve(res);
      }
      resolve(res);
    });
  };
};

const o = {
  asyncAltQueue,
  isAsync,
  isExist,
  isFunction,
  isPromise,
  isString,
  pipe,
  pipeAsync,
  type,
};

module.exports = o;
