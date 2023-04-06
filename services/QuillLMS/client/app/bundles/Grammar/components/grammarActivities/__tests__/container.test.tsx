import { shallow } from "enzyme";
import * as React from "react";
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';

import PlayGrammarContainer from "../container";

describe("Container component", () => {
  const mockProps = {
    grammarActivities: {},
    conceptsFeedback: {},
    session: {},
    dispatch: jest.fn(),
    previewMode: true,
    questionToPreview: {},
    questions: [],
    handleToggleQuestion: jest.fn(),
    skippedToQuestionFromIntro: false,
    isOnMobile: false,
    handleTogglePreviewMenu: jest.fn()
  }
  const wrapper = shallow(<Provider store={createMockStore()}><PlayGrammarContainer {...mockProps} /></Provider>);

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
