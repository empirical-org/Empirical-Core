const initialState = {
  loading: true,
  errors: false,
  classroomsData: [],
};

function updateObject(oldObject, newObject) {
  return Object.assign({}, oldObject, newObject);
}

export default (state = initialState, action) => {
  //state = state || initialState;

  switch(action.type) {
    case 'RECIEVE_DISTRICT_CONCEPT_REPORTS':
      return updateObject(state, {
        loading: false,
        errors: action.body.errors,
        classroomsData: JSON.parse(action.body).data,
      });
    default:
      return state;
  }
};
