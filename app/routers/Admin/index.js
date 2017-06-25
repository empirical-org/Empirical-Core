export default {
  path: 'admin',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/admin/admin.jsx'));
    });
  },
};
