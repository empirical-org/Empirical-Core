import React from 'react';
import { shallow } from 'enzyme';

import PublicActivityPacks from '../PublicActivityPacks.jsx';

import UnitTemplatesManager from '../../components/lesson_planner/unit_templates_manager/unit_templates_manager'

describe('PublicActivityPacks container', () => {
  //TODO: test the funkiness in getInitialState
  //TODO: mock modules?

  const wrapper = shallow(<PublicActivityPacks />);

  describe('UnitTemplatesManager', () => {
    it('should render', () => {
        expect(wrapper.find(UnitTemplatesManager).exists()).toBe(true);
    });

    it('should have data based on state', () => {
      wrapper.setState({
        unitTemplatesManager: {foo: 'bar'}
      });
      expect(wrapper.find(UnitTemplatesManager).props().data.foo).toBe('bar');
    });

    describe('actions prop', () => {
      describe('assign function', () => {
        wrapper.instance().fetchClassrooms = jest.fn();
        wrapper.instance().deepExtendState = jest.fn();
        wrapper.setState({
          unitTemplatesManager: Object.assign({},
            wrapper.state().unitTemplatesManager, {
              model: {
                name: "I'm a model",
                activities: {foo: 'bar'}
              }
            }
          )
        });
        wrapper.find(UnitTemplatesManager).props().actions.assign();

        it('should call fetchClassrooms', () => {
          expect(wrapper.instance().fetchClassrooms).toHaveBeenCalled();
        });

        it('should call deepExtendState with appropriate hash', () => {
          expect(wrapper.instance().deepExtendState).toHaveBeenCalled();
          expect(wrapper.instance().deepExtendState.mock.calls[0][0].tab).toBe('createUnit');
          expect(wrapper.instance().deepExtendState.mock.calls[0][0].createUnit.stage).toBe(2);
          expect(wrapper.instance().deepExtendState.mock.calls[0][0].createUnit.model.name).toBe("I'm a model");
          expect(wrapper.instance().deepExtendState.mock.calls[0][0].createUnit.model.selectedActivities.foo).toBe('bar');
        });
      });

      describe('returnToIndex function', () => {
        wrapper.instance().updateUnitTemplatesManager = jest.fn();
        wrapper.find(UnitTemplatesManager).props().actions.returnToIndex();
        it('should call updateUnitTemplatesManager', () => {
          expect(wrapper.instance().updateUnitTemplatesManager).toHaveBeenCalled();
        });

        //TODO: determine how to test window.scrollTo(0,0);
      });

      describe('filterByCategory function', () => {
        beforeEach(() => {
          wrapper.setState({
            unitTemplatesManager: Object.assign({},
              wrapper.state().unitTemplatesManager, {
                models: [
                  {unit_template_category: {id: 3}},
                  {unit_template_category: {id: 7}},
                  {unit_template_category: {id: 7}}
                ]
              }
            )
          });
        });

        it('should call updateUnitTemplatesManager with all models if no categoryId is passed', () => {
          wrapper.instance().updateUnitTemplatesManager = jest.fn();
          wrapper.find(UnitTemplatesManager).props().actions.filterByCategory();
          expect(wrapper.instance().updateUnitTemplatesManager).toHaveBeenCalled();
          expect(wrapper.instance().updateUnitTemplatesManager.mock.calls[0][0].stage).toBe('index');
          expect(wrapper.instance().updateUnitTemplatesManager.mock.calls[0][0].displayedModels).toHaveLength(3);
          expect(wrapper.instance().updateUnitTemplatesManager.mock.calls[0][0].selectedCategoryId).toBe(undefined);
        });

        it('should call updateUnitTemplatesManager with models that match passed categoryId', () => {
          wrapper.instance().updateUnitTemplatesManager = jest.fn();
          wrapper.find(UnitTemplatesManager).props().actions.filterByCategory(7);
          expect(wrapper.instance().updateUnitTemplatesManager).toHaveBeenCalled();
          expect(wrapper.instance().updateUnitTemplatesManager.mock.calls[0][0].stage).toBe('index');
          expect(wrapper.instance().updateUnitTemplatesManager.mock.calls[0][0].displayedModels).toHaveLength(2);
          expect(wrapper.instance().updateUnitTemplatesManager.mock.calls[0][0].displayedModels[0].unit_template_category.id).toBe(7);
          expect(wrapper.instance().updateUnitTemplatesManager.mock.calls[0][0].displayedModels[1].unit_template_category.id).toBe(7);
          expect(wrapper.instance().updateUnitTemplatesManager.mock.calls[0][0].selectedCategoryId).toBe(7);
        });
      });

      describe('selectModel function', () => {
        it.skip('should call updateUnitTemplatesManager', () => {

        });

        it.skip('should call windowPosition module reset function', () => {

        });
      });

      describe('signUp function', () => {
        //TODO: determine how best to test window.location.href change
      });
    });
  });

  describe.skip('fetchClassrooms function', () => {

  });

  describe.skip('toggleTab function', () => {

  });

});
