import test from 'tape';

export default (msg, cb) => {
  test(msg, (t) => {
    cb(t);
    t.end();
  });
};
