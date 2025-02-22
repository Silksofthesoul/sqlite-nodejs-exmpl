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

const isPromise = fn => fn instanceof Promise;
const isAsync = func => {
  const s = func.toString().trim();
  return !!(
    s.match(/^async /) ||
    s.match(/return _ref[^\.]*\.apply/)
  );
};

const o = {
  type,
  isExist,
  isFunction,
  isPromise,
  isAsync,
};

module.exports = o;
