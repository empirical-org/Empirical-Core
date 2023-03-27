import { shallow } from "enzyme";
import * as React from "react";
import { Cue, CueExplanation } from '../../../../Shared/index';

import Cues from "../cues";

describe("<Cues />", () => {
  describe('with no cues', () => {
    const wrapper = shallow(<Cues />)

    it("should render", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render any Cues', () => {
      expect(wrapper.find(Cue)).toHaveLength(0)
    })

    it('should not render any CueExplanations', () => {
      expect(wrapper.find(CueExplanation)).toHaveLength(0)
    })

  })

  describe('with an empty array of cues', () => {
    const wrapper = shallow(<Cues cues={[]} />)

    it("should render", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render any Cues', () => {
      expect(wrapper.find(Cue)).toHaveLength(0)
    })

    it('should not render any CueExplanations', () => {
      expect(wrapper.find(CueExplanation)).toHaveLength(0)
    })

  })

  describe("with cues", () => {
    const cues = ['a', 'b', 'c']
    const wrapper = shallow(<Cues cues={cues} />)

    it('should render a Cue for every item in the cues array', () => {
      expect(wrapper.find(Cue)).toHaveLength(cues.length)
    })

    it("should render", () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe("with no cuesLabel", () => {
      const noCueLabelWrapper = shallow(<Cues cues={cues} />)

      it("should render", () => {
        expect(noCueLabelWrapper).toMatchSnapshot();
      });

      it('should render a CueExplanation with the default text', () => {
        expect(noCueLabelWrapper.find(CueExplanation).props().text).toBe('choose one')
      })
    })

    describe("with a cuesLabel that is an empty string", () => {
      const emptyStringCueLabelWrapper = shallow(<Cues cues={cues} cuesLabel="" />)

      it("should render", () => {
        expect(emptyStringCueLabelWrapper).toMatchSnapshot();
      });

      it('should render a CueExplanation with the default text', () => {
        expect(emptyStringCueLabelWrapper.find(CueExplanation).props().text).toBe('choose one')
      })
    })

    describe("with a cuesLabel that is just a space", () => {
      const spaceCueLabelWrapper = shallow(<Cues cues={cues} cuesLabel=" " />)

      it("should render", () => {
        expect(spaceCueLabelWrapper).toMatchSnapshot();
      });

      it('should not render a CueExplanation', () => {
        expect(spaceCueLabelWrapper.find(CueExplanation)).toHaveLength(0)
      })

    })
    describe("with a custom cuesLabel", () => {
      const customCueLabelWrapper = shallow(<Cues cues={cues} cuesLabel="pick one" />)

      it("should render", () => {
        expect(customCueLabelWrapper).toMatchSnapshot();
      });

      it('should render a CueExplanation with the default text', () => {
        expect(customCueLabelWrapper.find(CueExplanation).props().text).toBe('pick one')
      })

    })
  })
});
