import { hashToCollection } from '../../src/libs/hashToCollection'
import {Response, FocusPoint, IncorrectSequence, ConceptResult} from '../../src/interfaces/index'

const rawData = {
  '13145':
    { 'id': 13145, 'text': 'Bats have wings and they can fly', 'optimal': false, 'feedback': '<p>Revise your work. Which joining word helps tell why or give a reason?</p>', 'count': 1302, 'child_count': null, 'first_attempt_count': 536, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false }, 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': false }, 'JVJhNIHGZLbHF6LYw605XA': { 'conceptUID': 'JVJhNIHGZLbHF6LYw605XA', 'correct': false } } },
  '13157':
    { 'id': 13157, 'text': 'Bats have wings, so they can fly.', 'optimal': true, 'feedback': '<p>That\'s a strong sentence!</p>', 'count': 113059, 'child_count': 45725, 'first_attempt_count': 43750, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': true }, 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': true } } },
  '13166':
    { 'id': 13166, 'text': 'Bats have wings, and they can fly.', 'optimal': false, 'feedback': '<p><em>And</em> makes sense, but there is a stronger way of joining the sentences. Which joining word shows having wings is the reason bats can fly?</p>', 'count': 10530, 'child_count': 1, 'first_attempt_count': 4812, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': true }, 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false } } },
  '13168':
    { 'id': 13168, 'text': 'Bats have wings, but they can fly.', 'optimal': false, 'feedback': '<p>Revise your work. Which joining word helps tell why or give a reason?</p>', 'count': 1575, 'child_count': null, 'first_attempt_count': 348, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': true }, 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false } } },
  '13173':
    { 'id': 13173, 'text': 'Bats have wings so, they can fly.', 'optimal': false, 'feedback': '<p><em>So</em> tells why bats can fly. Good work! Now correct your punctuation.</p>', 'count': 3962, 'child_count': null, 'first_attempt_count': 802, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': true }, 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': false } } },
  '13174':
    { 'id': 13174, 'text': 'Bats have wings,and they can fly.', 'optimal': false, 'feedback': '<p>Revise your work. Which joining word helps tell why or give a reason?</p>', 'count': 587, 'child_count': null, 'first_attempt_count': 168, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': true }, 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false }, '5Yv4-kNHwwCO2p8HI90oqQ': { 'conceptUID': '5Yv4-kNHwwCO2p8HI90oqQ', 'correct': false } } },
  '13181':
    { 'id': 13181, 'text': 'Bats have wings and they can fly.', 'optimal': false, 'feedback': '<p><em>And</em> makes sense, but there is a stronger way of joining the sentences. Which joining word shows having wings is the reason bats can fly?</p>', 'count': 6884, 'child_count': null, 'first_attempt_count': 2674, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false }, 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': false }, '8Bzwt0RLr4-IG1L4YxsGZA': { 'conceptUID': '8Bzwt0RLr4-IG1L4YxsGZA', 'correct': false } } },
  '13189':
    { 'id': 13189, 'text': 'Bats have wings so they can fly.', 'optimal': false, 'feedback': '<p>Good work! Now correct your punctuation.</p>', 'count': 25365, 'child_count': null, 'first_attempt_count': 8666, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': true }, 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': false } } },
  '13215':
    { 'id': 13215, 'text': 'Bats have wings so, they can fly', 'optimal': false, 'feedback': '<p><em>So</em> tells why bats can fly. Good work! Now correct your punctuation.</p>', 'count': 755, 'child_count': null, 'first_attempt_count': 226, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': true }, 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': false }, 'JVJhNIHGZLbHF6LYw605XA': { 'conceptUID': 'JVJhNIHGZLbHF6LYw605XA', 'correct': false } } },
  '1200564':
    { 'id': 1200564, 'text': 'Bats have wings and can fly.', 'optimal': false, 'feedback': '<p><em>And</em> makes sense, but there is a stronger way of joining the sentences. Which joining word shows having wings is the reason bats can fly?</p>', 'count': 1837, 'child_count': null, 'first_attempt_count': 680, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'asfdGCdbTy6l8xTe-_p6Qg': { 'conceptUID': 'asfdGCdbTy6l8xTe-_p6Qg', 'correct': false }, 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false } } },
  '1212056':
    { 'id': 1212056, 'text': 'So bats have wings, they can fly.', 'optimal': false, 'feedback': '<p>Revise your work. Re-order the ideas to show that having wings is the reason bats can fly.</p>', 'count': 45, 'child_count': null, 'first_attempt_count': 21, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false } } },
  '1214073':
    { 'id': 1214073, 'text': 'Bats can fly, so they have wings.', 'optimal': false, 'feedback': '<p>Revise your work. Re-order the ideas to show that having wings is the reason bats can fly.</p>', 'count': 81, 'child_count': null, 'first_attempt_count': 19, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false }, 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': false } }, },
  '1214078':
    { 'id': 1214073, 'text': 'Bats have wings, so they can fly slowly.', 'optimal': false, 'feedback': '<p>Revise your work. Re-order the ideas to show that having wings is the reason bats can fly.</p>', 'count': 81, 'child_count': null, 'first_attempt_count': 19, 'question_uid': '-KS7SchZ6efLRxPmvuqA', 'parent_id': null, 'concept_results': { 'R3sBcYAvoXP2_oNVXiA98g': { 'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false }, 'GiUZ6KPkH958AT8S413nJg': { 'conceptUID': 'GiUZ6KPkH958AT8S413nJg', 'correct': false } }, },

};

export const responses: Response[] = hashToCollection(rawData);
//
export const focusPoints: FocusPoint[] = [{'feedback': '<p>Revise your work. Which joining word helps tell why or give a reason?</p>', 'key': '-KUwjtejrmubbG1tw0D7', 'text': 'So|||so'}];

const rawIncorrectSequences: any = [{'concept_results': {'R3sBcYAvoXP2_oNVXiA98g': {'conceptUID': 'R3sBcYAvoXP2_oNVXiA98g', 'correct': false, 'name': 'Conjunctions | Coordinating Conjunctions | So'}}, 'feedback': '<p><em>And</em> makes sense, but there is a stronger way of joining the sentences. Which joining word shows having wings is the reason bats can fly?</p>', 'text': 'and they|||and can'}];
const rawIncorrectSequence = rawIncorrectSequences[0];
const conceptResults: ConceptResult[] = hashToCollection(rawIncorrectSequences[0].concept_results);
rawIncorrectSequence.concept_results = conceptResults;
export const incorrectSequences: IncorrectSequence[]  = [rawIncorrectSequence];
