import React from 'react';
import { shallow } from 'enzyme';

import RecommendationsTableCell from '../recommendations_table_cell.jsx'

describe('RecommendationsTableCell component', () => {
  const recommendation = {
    name: 'Adjectives'
  }

  describe('when it is recommended and previously assigned and selected', () => {
    const mockCheckboxOnClick = jest.fn()
    const wrapper = shallow(
      <RecommendationsTableCell
        previouslyAssigned={' previously-assigned '}
        recommended={' recommended '}
        selected={' selected '}
        recommendation={recommendation}
        checkboxOnClick={mockCheckboxOnClick}
      />);

    it('should render a div with the class previously-assigned', () => {
      expect(wrapper.find('.previously-assigned')).toHaveLength(1)
    })
    it('should render a div with the class recommended', () => {
      expect(wrapper.find('.recommended')).toHaveLength(1)
    })
    it('should render a div with the class selected', () => {
      expect(wrapper.find('.selected')).toHaveLength(1)
    })
    it('should render a checkbox div with the class previously-assigned-checkbox', () => {
      expect(wrapper.find('.previously-assigned-checkbox')).toHaveLength(1)
    })
    it('should not call a function on clicking the checkbox', () => {
      wrapper.find('.previously-assigned-checkbox').simulate('click')
      expect(mockCheckboxOnClick.mock.calls).toHaveLength(0);
    })
    it('should render an i with the class fa-check-circle', () => {
      expect(wrapper.find('.fa-check-circle')).toHaveLength(1)
    })
  })

  describe('when it is recommended and previously assigned and not selected', () => {
    const mockCheckboxOnClick = jest.fn()
    const wrapper = shallow(
      <RecommendationsTableCell
        previouslyAssigned={' previously-assigned '}
        recommended={' recommended '}
        selected={''}
        recommendation={recommendation}
        checkboxOnClick={mockCheckboxOnClick}
      />);

    it('should render a div with the class previously-assigned', () => {
      expect(wrapper.find('.previously-assigned')).toHaveLength(1)
    })
    it('should render a div with the class recommended', () => {
      expect(wrapper.find('.recommended')).toHaveLength(1)
    })
    it('should not render a div with the class selected', () => {
      expect(wrapper.find('.selected')).toHaveLength(0)
    })
    it('should render a checkbox div with the class previously-assigned-checkbox', () => {
      expect(wrapper.find('.previously-assigned-checkbox')).toHaveLength(1)
    })
    it('should not call a function on clicking the checkbox', () => {
      wrapper.find('.previously-assigned-checkbox').simulate('click')
      expect(mockCheckboxOnClick.mock.calls).toHaveLength(0);
    })
    it('should render an i with the class fa-check-circle', () => {
      expect(wrapper.find('.fa-check-circle')).toHaveLength(1)
    })
  })

  describe('when it is recommended and not previously assigned and selected', () => {
    const mockCheckboxOnClick = jest.fn()
    const wrapper = shallow(
      <RecommendationsTableCell
        previouslyAssigned={''}
        recommended={' recommended '}
        selected={' selected '}
        recommendation={recommendation}
        checkboxOnClick={mockCheckboxOnClick}
      />);

    it('should not render a div with the class previously-assigned', () => {
      expect(wrapper.find('.previously-assigned')).toHaveLength(0)
    })
    it('should render a div with the class recommended', () => {
      expect(wrapper.find('.recommended')).toHaveLength(1)
    })
    it('should render a div with the class selected', () => {
      expect(wrapper.find('.selected')).toHaveLength(1)
    })
    it('should render a checkbox div with the class donalito-checkbox', () => {
      expect(wrapper.find('.donalito-checkbox')).toHaveLength(1)
    })
    it('should call a function on clicking the checkbox', () => {
      wrapper.simulate('click')
      expect(mockCheckboxOnClick.mock.calls).toHaveLength(1);
    })
    it('should render an img with the class recommendation-check', () => {
      expect(wrapper.find('.recommendation-check')).toHaveLength(1)
    })
  })
  describe('when it is recommended and not previously assigned and not selected', () => {
    const mockCheckboxOnClick = jest.fn()
    const wrapper = shallow(
      <RecommendationsTableCell
        previouslyAssigned={''}
        recommended={' recommended '}
        selected={''}
        recommendation={recommendation}
        checkboxOnClick={mockCheckboxOnClick}
      />);

    it('should not render a div with the class previously-assigned', () => {
      expect(wrapper.find('.previously-assigned')).toHaveLength(0)
    })
    it('should render a div with the class recommended', () => {
      expect(wrapper.find('.recommended')).toHaveLength(1)
    })
    it('should not render a div with the class selected', () => {
      expect(wrapper.find('.selected')).toHaveLength(0)
    })
    it('should render a checkbox div with the class donalito-checkbox', () => {
      expect(wrapper.find('.donalito-checkbox')).toHaveLength(1)
    })
    it('should call a function on clicking the checkbox', () => {
      wrapper.simulate('click')
      expect(mockCheckboxOnClick.mock.calls).toHaveLength(1);
    })
    it('should not render an img with the class recommendation-check', () => {
      expect(wrapper.find('.recommendation-check')).toHaveLength(0)
    })
  })

  describe('when it is not recommended and previously assigned and selected', () => {
    const mockCheckboxOnClick = jest.fn()
    const wrapper = shallow(
      <RecommendationsTableCell
        previouslyAssigned={' previously-assigned '}
        recommended={''}
        selected={' selected '}
        recommendation={recommendation}
        checkboxOnClick={mockCheckboxOnClick}
      />);

    it('should render a div with the class previously-assigned', () => {
      expect(wrapper.find('.previously-assigned')).toHaveLength(1)
    })
    it('should not render a div with the class recommended', () => {
      expect(wrapper.find('.recommended')).toHaveLength(0)
    })
    it('should not render a div with the class selected', () => {
      expect(wrapper.find('.selected')).toHaveLength(1)
    })
    it('should render a checkbox div with the class previously-assigned-checkbox', () => {
      expect(wrapper.find('.previously-assigned-checkbox')).toHaveLength(1)
    })
    it('should not call a function on clicking the checkbox', () => {
      wrapper.find('.previously-assigned-checkbox').simulate('click')
      expect(mockCheckboxOnClick.mock.calls).toHaveLength(0);
    })
    it('should render an i with the class fa-check-circle', () => {
      expect(wrapper.find('.fa-check-circle')).toHaveLength(1)
    })

  })

  describe('when it is not recommended and not previously assigned and selected', () => {
    const mockCheckboxOnClick = jest.fn()
    const wrapper = shallow(
      <RecommendationsTableCell
        previouslyAssigned={''}
        recommended={''}
        selected={' selected '}
        recommendation={recommendation}
        checkboxOnClick={mockCheckboxOnClick}
      />);

    it('should not render a div with the class previously-assigned', () => {
      expect(wrapper.find('.previously-assigned')).toHaveLength(0)
    })
    it('should not render a div with the class recommended', () => {
      expect(wrapper.find('.recommended')).toHaveLength(0)
    })
    it('should render a div with the class selected', () => {
      expect(wrapper.find('.selected')).toHaveLength(1)
    })
    it('should render a checkbox div with the class donalito-checkbox', () => {
      expect(wrapper.find('.donalito-checkbox')).toHaveLength(1)
    })
    it('should call a function on clicking the checkbox', () => {
      wrapper.simulate('click')
      expect(mockCheckboxOnClick.mock.calls).toHaveLength(1);
    })
    it('should render an img with the class recommendation-check', () => {
      expect(wrapper.find('.recommendation-check')).toHaveLength(1)
    })
  })
})
