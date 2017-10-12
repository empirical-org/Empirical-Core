export const optimalResponse = {
  feedback: 'feedback',
  text: 'I ran to the shop.',
  optimal: true,
};

export const algoOptimalResponse = {
  feedback: 'feedback',
  text: 'You ran to the shop.',
  author: 'POS',
  optimal: true,
  parentID: 'optimalResponse',
};

export const ungradedResponse = {
  text: 'I walked to the shop.',
};

export const subOptimalResponse = {
  feedback: 'feedback',
  text: 'Ran to the shop fast.',
  optimal: false,
};

export const algoSubOptimalResponse = {
  feedback: 'feedback',
  text: 'Ran to the shop slow.',
  author: 'POS',
  optimal: false,
  parentID: 'subOptimalResponse',
};

export default {
  optimalResponse,
  subOptimalResponse,
  algoOptimalResponse,
  algoSubOptimalResponse,
  ungradedResponse,
};
