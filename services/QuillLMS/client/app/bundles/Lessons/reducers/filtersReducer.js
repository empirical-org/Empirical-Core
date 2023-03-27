import _ from 'lodash';
import C from '../constants';

const visibleStatuses = {
  'Human Optimal': true,
  'Human Sub-Optimal': true,
  'Algorithm Optimal': true,
  'Algorithm Sub-Optimal': true,
  Unmatched: true,

  // "Focus Point Hint": true,
  // "Word Error Hint": true,
  // "Punctuation Hint": true,
  // "Punctuation and Case Hint": true,
  // "Capitalization Hint": true,
  // "Missing Details Hint": true,
  // "Not Concise Hint": true,
  // "Additional Word Hint": true,
  // "Missing Word Hint": true,
  // "Modified Word Hint": true,
  // "Whitespace Hint": true,
  // ""
  'No Hint': true,
};

C.ERROR_AUTHORS.forEach(author =>
  visibleStatuses[author] = true
);

const initialState = {
  filters: {
    responses: [],
    numberOfPages: 1,
    numberOfResponses: 0,
    sorting: 'count',
    ascending: false,
    excludeMisspellings: false,
    stringFilter: '',
    responsePageNumber: 1,
    requestCount: 0,
    visibleStatuses,
    expanded: {},  // this will contain response keys set to true or false;
    formattedFilterData: {
      sort: {
        column: 'count',
        direction: 'desc'
      },
      filters: {
        author: [],
        status: [],
      },
      excludeMisspellings: false,
    }
  },
}

function getFormattedFilterData(state) {
  return {
    filters: getFilters(state),
    sort: getSort(state),
    excludeMisspellings: state.excludeMisspellings,
  };
}

function mapStatus() {
  return {
    'Human Optimal': 0,
    'Human Sub-Optimal': 1,
    'Algorithm Optimal': 2,
    'Algorithm Sub-Optimal': 3,
    'Unmatched': 4,
  }
}

function getFilters(state) {
  const ignoredAuthors = []
  const ignoredStatuses = []
  Object.entries(state.visibleStatuses).forEach(([key, value]) => {
    if (!value) {
      if (mapStatus()[key] !== undefined) {
        ignoredStatuses.push(mapStatus()[key])
      } else {
        ignoredAuthors.push(key)
      }
    }
  });
  return {
    author: ignoredAuthors,
    status: ignoredStatuses
  }
}

function getSort(state) {
  return {
    column: state.sorting,
    direction: state.ascending ? 'asc' : 'desc'
  }
}

export default function (currentState, action) {
  let newState;
  switch (action.type) {
    case C.TOGGLE_EXPAND_SINGLE_RESPONSE:
      newState = _.cloneDeep(currentState);
      newState.expanded[action.rkey] = !currentState.expanded[action.rkey];
      return newState;
    case C.COLLAPSE_ALL_RESPONSES:
      newState = _.cloneDeep(currentState);
      newState.expanded = {};
      return newState;
    case C.EXPAND_ALL_RESPONSES:
      newState = _.cloneDeep(currentState);
      newState.expanded = action.expandedResponses;
      return newState;
    case C.TOGGLE_STATUS_FIELD:
      newState = _.cloneDeep(currentState);
      newState.visibleStatuses[action.status] = !currentState.visibleStatuses[action.status];
      newState.formattedFilterData = getFormattedFilterData(newState)
      return newState;
    case C.TOGGLE_RESPONSE_SORT:
      newState = _.cloneDeep(currentState);
      if (currentState.sorting === action.field) {
        newState.ascending = !currentState.ascending;
      } else {
        newState.ascending = false;
        newState.sorting = action.field;
      }
      newState.formattedFilterData = getFormattedFilterData(newState)
      return newState;
    case C.TOGGLE_EXCLUDE_MISSPELLINGS:
      newState = _.cloneDeep(currentState);
      newState.excludeMisspellings = !newState.excludeMisspellings;
      newState.formattedFilterData = getFormattedFilterData(newState);
      return newState;
    case C.RESET_ALL_FIELDS:
      newState = _.cloneDeep(currentState);
      _.forIn(newState.visibleStatuses, (status, key) => {
        newState.visibleStatuses[key] = true;
      });
      newState.formattedFilterData = getFormattedFilterData(newState)
      return newState;
    case C.DESELECT_ALL_FIELDS:
      newState = _.cloneDeep(currentState);
      _.forIn(newState.visibleStatuses, (status, key) => {
        newState.visibleStatuses[key] = false;
      });
      newState.formattedFilterData = getFormattedFilterData(newState)
      return newState;
    case C.UPDATE_SEARCHED_RESPONSES:
      newState = _.cloneDeep(currentState);
      newState.responses = action.data.responses
      newState.numberOfPages = action.data.numberOfPages
      newState.numberOfResponses = action.data.numberOfResponses
      return newState;
    case C.SET_RESPONSE_PAGE_NUMBER:
      newState = _.cloneDeep(currentState);
      newState.responsePageNumber = action.pageNumber
      return newState;
    case C.SET_RESPONSE_STRING_FILTER:
      newState = _.cloneDeep(currentState);
      newState.stringFilter = action.stringFilter
      newState.responsePageNumber = 1
      return newState;
    case C.INCREMENT_REQUEST_COUNT:
      newState = _.cloneDeep(currentState);
      newState.requestCount = currentState.requestCount + 1
      return newState
    default:
      return currentState || initialState.filters;
  }
}
