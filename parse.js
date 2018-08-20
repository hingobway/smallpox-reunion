const _ = require('lodash');

const profs = {
  entry: ['user', 'before', 'after', 'votes'],
  user: ['name', 'email', 'scope', 'auth'],
  image: ['url', 'caption']
};

module.exports = (conf, resp) => {
  let opts = _.differenceWith(profs[conf], [''], _.isArray);
  let out = Object.assign({ id: resp._id }, _.pick(resp, opts));
  let mod = {};
  _.difference(profs[conf], opts).forEach(i => {
    mod[i[0]] = resp[i[0]].map(v =>
      Object.assign({ id: v._id }, _.pick(v, _.drop(i)))
    );
  });
  return Object.assign(out, mod);
};
