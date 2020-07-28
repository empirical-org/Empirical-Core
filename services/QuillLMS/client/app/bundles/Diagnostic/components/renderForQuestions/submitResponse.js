export const submitQuestionResponse = (response, props, submitFunction) => {
  const action = submitFunction(response);
  props.dispatch(action);
}
