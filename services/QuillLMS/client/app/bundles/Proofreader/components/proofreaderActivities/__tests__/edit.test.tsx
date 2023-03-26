import { mount } from "enzyme";
import * as React from "react";

import {
    MULTIPLE_UNNECESSARY_ADDITION, MULTIPLE_UNNECESSARY_DELETION, SINGLE_UNNECESSARY_ADDITION, SINGLE_UNNECESSARY_DELETION, UNNECESSARY_CHANGE, UNNECESSARY_SPACE
} from '../../../helpers/determineUnnecessaryEditType';
import Edit from "../edit";

const baseProps = {
  activeIndex: 1,
  index: 1,
  numberOfEdits: 10
}

const correctProps = {
  ...baseProps,
  concept: {
    id: 197,
    name: "Lose",
    parent_id: 195,
    uid: "xwFpK_RoONouHKOVHzloXQ",
    description: null,
    explanation: "<p>Use <em>lose </em>to talk about something you can&#x27;t find. Use <em>loose </em>to talk about something that is not tight.</p>",
    level: 0,
    displayName: "Commonly Confused Words | Loose, Lose | Lose"
  },
  displayText: "lose",
  id: "10",
  incorrectText: null,
  state: "correct"
}

const incorrectProps = {
  ...baseProps,
  concept: {
    id: 309,
    name: "Then",
    parent_id: 307,
    uid: "VuTHlr5mg3wudXOOJQXuNw",
    description: null,
    explanation: "<p>Use <em>then</em> to talk about a time period or something that happens after something else.</p>",
    level: 0,
    displayName: "Commonly Confused Words | Than, Then | Then"
  },
  displayText: "then",
  id: "8",
  incorrectText: "than",
  state: "incorrect"
}

const unnecessaryChangeProps = {
  ...baseProps,
  back: null,
  displayText: "1914,",
  id: "0",
  incorrectText: "1914",
  state: UNNECESSARY_CHANGE
}

const singleUnnecessaryDeletionProps = {
  ...baseProps,
  displayText: "crew",
  id: "4",
  incorrectText: " ",
  state: SINGLE_UNNECESSARY_DELETION
}

const multipleUnnecessaryDeletionProps = {
  ...baseProps,
  displayText: "crew was",
  id: "4",
  incorrectText: " ",
  state: MULTIPLE_UNNECESSARY_DELETION
}

const singleUnnecessaryAdditionProps = {
  ...baseProps,
  displayText: "crew",
  id: "4",
  incorrectText: "the crew",
  state: SINGLE_UNNECESSARY_ADDITION
}

const multipleUnnecessaryAdditionProps = {
  ...baseProps,
  displayText: "crew",
  id: "4",
  incorrectText: "the crew was",
  state: MULTIPLE_UNNECESSARY_ADDITION
}

const unnecessarySpaceProps = {
  ...baseProps,
  displayText: "crew",
  id: "4",
  incorrectText: "cr ew",
  state: UNNECESSARY_SPACE
}

describe("<Edit />", () => {

  describe('incorrect edit', () => {
    it("should render when active", () => {
      const component = mount(<Edit {...incorrectProps} />);
      expect(component).toMatchSnapshot();
    });

    it("should render when inactive", () => {
      const component = mount(<Edit {...incorrectProps} activeIndex={0} />);
      expect(component).toMatchSnapshot();
    });
  })

  describe('correct edit', () => {
    it("should render when active", () => {
      const component = mount(<Edit {...correctProps} />);
      expect(component).toMatchSnapshot();
    });

    it("should render when inactive", () => {
      const component = mount(<Edit {...correctProps} activeIndex={0} />);
      expect(component).toMatchSnapshot();
    });
  })

  describe('unnecessary change edit', () => {
    it("should render when active", () => {
      const component = mount(<Edit {...unnecessaryChangeProps} />);
      expect(component).toMatchSnapshot();
    });

    it("should render when inactive", () => {
      const component = mount(<Edit {...unnecessaryChangeProps} activeIndex={0} />);
      expect(component).toMatchSnapshot();
    });
  })

  describe('unnecessary space edit', () => {
    it("should render when active", () => {
      const component = mount(<Edit {...unnecessarySpaceProps} />);
      expect(component).toMatchSnapshot();
    });

    it("should render when inactive", () => {
      const component = mount(<Edit {...unnecessarySpaceProps} activeIndex={0} />);
      expect(component).toMatchSnapshot();
    });
  })

  describe('single unnecessary addition edit', () => {
    it("should render when active", () => {
      const component = mount(<Edit {...singleUnnecessaryAdditionProps} />);
      expect(component).toMatchSnapshot();
    });

    it("should render when inactive", () => {
      const component = mount(<Edit {...singleUnnecessaryAdditionProps} activeIndex={0} />);
      expect(component).toMatchSnapshot();
    });
  })

  describe('multiple unnecessary addition edit', () => {
    it("should render when active", () => {
      const component = mount(<Edit {...multipleUnnecessaryAdditionProps} />);
      expect(component).toMatchSnapshot();
    });

    it("should render when inactive", () => {
      const component = mount(<Edit {...multipleUnnecessaryAdditionProps} activeIndex={0} />);
      expect(component).toMatchSnapshot();
    });
  })

  describe('single unnecessary deletion edit', () => {
    it("should render when active", () => {
      const component = mount(<Edit {...singleUnnecessaryDeletionProps} />);
      expect(component).toMatchSnapshot();
    });

    it("should render when inactive", () => {
      const component = mount(<Edit {...singleUnnecessaryDeletionProps} activeIndex={0} />);
      expect(component).toMatchSnapshot();
    });
  })

  describe('multiple unnecessary deletion edit', () => {
    it("should render when active", () => {
      const component = mount(<Edit {...multipleUnnecessaryDeletionProps} />);
      expect(component).toMatchSnapshot();
    });

    it("should render when inactive", () => {
      const component = mount(<Edit {...multipleUnnecessaryDeletionProps} activeIndex={0} />);
      expect(component).toMatchSnapshot();
    });
  })


});
