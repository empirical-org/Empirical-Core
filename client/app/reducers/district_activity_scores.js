function updateObject(oldObject, newObject) {
  return Object.assign({}, oldObject, newObject);
}

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'RECIEVE_DISTRICT_ACTIVITY_SCORES':
      return updateObject(state, {
        loading: false,
        errors: action.body.errors,
        classroomsData: JSON.parse(action.body).data,
      });
    default:
      return state;
  }
};
