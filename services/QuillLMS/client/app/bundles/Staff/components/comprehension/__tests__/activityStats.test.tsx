import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import ActivityStats from '../activityStats/activityStats';
import { mockActivity } from '../__mocks__/data';
import 'whatwg-fetch';

const mockPrompts = "{\"118\":{\"total_responses\":4720,\"session_count\":224,\"display_name\":\"A surge barrier in New York City could harm the local ecosystem because\",\"num_final_attempt_optimal\":224,\"num_final_attempt_not_optimal\":0,\"avg_attempts_to_optimal\":2.6919642857142856,\"num_sessions_with_consecutive_repeated_rule\":208,\"num_sessions_with_non_consecutive_repeated_rule\":220,\"num_first_attempt_optimal\":180,\"num_first_attempt_not_optimal\":44},\"119\":{\"total_responses\":3176,\"session_count\":155,\"display_name\":\"A surge barrier in New York City could harm the local ecosystem, but\",\"num_final_attempt_optimal\":155,\"num_final_attempt_not_optimal\":0,\"avg_attempts_to_optimal\":2.6129032258064515,\"num_sessions_with_consecutive_repeated_rule\":139,\"num_sessions_with_non_consecutive_repeated_rule\":150,\"num_first_attempt_optimal\":135,\"num_first_attempt_not_optimal\":20},\"120\":{\"total_responses\":3291,\"session_count\":195,\"display_name\":\"A surge barrier in New York City could harm the local ecosystem, so\",\"num_final_attempt_optimal\":195,\"num_final_attempt_not_optimal\":0,\"avg_attempts_to_optimal\":2.2153846153846155,\"num_sessions_with_consecutive_repeated_rule\":182,\"num_sessions_with_non_consecutive_repeated_rule\":190,\"num_first_attempt_optimal\":161,\"num_first_attempt_not_optimal\":34}}"

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: {
      prompts: JSON.parse(mockPrompts),
      activity: mockActivity
    },
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

const mockProps = {
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history: createMemoryHistory(),
  location: createLocation('')
}

describe('ActivityStats component', () => {
  const container = shallow(<ActivityStats {...mockProps} />);

  it('should render ActivityStats', () => {
    expect(container).toMatchSnapshot();
  });
});
