
export function receiveQuestionsData(currentstate, action) {
  if (action.language) {
    return Object.assign({}, currentstate, {
      translated_data: {
        ...currentstate.translated_data,
        [action.language] : action.data
      },
    });
  } else {
    return Object.assign({}, currentstate, {
      hasreceiveddata: true,
      data: action.data,
    });
  }
}

export function receiveQuestionData(currentstate, action) {
  return Object.assign({}, currentstate, {
    data: Object.assign({}, currentstate.data, {
      [action.uid]: action.data,
    })
  })
}
