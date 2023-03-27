import { shallow } from 'enzyme';
import React from 'react';

import Cms from '../Cms.jsx';

import CmsIndexTable from '../../components/cms/cms_index_table/cms_index_table.jsx';

describe('Cms container', () => {

  describe('if state is index', () => {
    const resourceComponentGeneratorMock = jest.fn()
      .mockReturnValue(<div>Index Pugs</div>);
    const wrapper = shallow(
      <Cms
        resourceComponentGenerator={resourceComponentGeneratorMock}
        resourceNamePlural="Pugs"
        resourceNameSingular="Pug"
      />
    );
    wrapper.instance().crudNew = jest.fn();
    wrapper.setState({crudState: 'index'});

    it('should render New button', () => {
      expect(wrapper.find('button').text()).toBe('New');
      wrapper.find('button').simulate('click');
      expect(wrapper.instance().crudNew.mock.calls).toHaveLength(1);
    });

    it('should render CmsIndexTable component', () => {
      expect(wrapper.find(CmsIndexTable).exists()).toBe(true);
    });
  });

  describe('if state is edit', () => {
    const resourceComponentGeneratorMock = jest.fn()
      .mockReturnValue(<div>Edit Pugs</div>);
    const wrapper = shallow(
      <Cms
        resourceComponentGenerator={resourceComponentGeneratorMock}
        resourceNamePlural="Pugs"
        resourceNameSingular="Pug"
      />
    );
    wrapper.setState({crudState: 'new', resourceToEdit: {}});
    it('should return whatever is returned by props.resourceComponentGenerator', () => {
      expect(resourceComponentGeneratorMock.mock.calls).toHaveLength(1);
      expect(wrapper.text()).toBe('Edit Pugs');
    })
  });

  describe('if state is new', () => {
    const resourceComponentGeneratorMock = jest.fn()
      .mockReturnValue(<div>New Pugs</div>);
    const wrapper = shallow(
      <Cms
        resourceComponentGenerator={resourceComponentGeneratorMock}
        resourceNamePlural="Pugs"
        resourceNameSingular="Pug"
      />
    );
    wrapper.setState({crudState: 'new', resourceToEdit: {}});
    it('should return whatever is returned by props.resourceComponentGenerator', () => {
      expect(resourceComponentGeneratorMock.mock.calls).toHaveLength(1);
      expect(wrapper.text()).toBe('New Pugs');
    })
  });

  describe('crud function', () => {
    const wrapper = shallow(
      <Cms
        resourceComponentGenerator={() => null}
        resourceNamePlural="Pugs"
        resourceNameSingular="Pug"
      />
    );
    wrapper.setState({crudState: 'something absurd', resourceToEdit: {something: 'absurd', id: 1}});

    it('crudNew should change crudState to new and empty resourceToEdit', () => {
      wrapper.instance().crudNew();
      expect(wrapper.state().crudState).toBe('new');
      expect(Object.keys(wrapper.state().resourceToEdit)).toHaveLength(0);
    });

    it('edit should open a new window', () => {
      window.open = jest.fn()
      wrapper.instance().edit({foo: 'bar'});

      expect(window.open).toHaveBeenCalled()
    });

    it('delete should call cmsDestroy and getIndexFromServer', () => {
      wrapper.instance().getIndexFromServer = jest.fn();
      wrapper.instance().modules = {server: { cmsDestroy: jest.fn() }};
      wrapper.instance().delete({id: 0});
      expect(wrapper.instance().getIndexFromServer.mock.calls).toHaveLength(1);
      expect(wrapper.instance().modules.server.cmsDestroy.mock.calls).toHaveLength(1);
    });

    it('returnToIndex should change crudState to index and getIndexFromServer', () => {
      wrapper.instance().getIndexFromServer = jest.fn();
      wrapper.instance().returnToIndex();
      expect(wrapper.state().crudState).toBe('index');
      expect(wrapper.instance().getIndexFromServer.mock.calls).toHaveLength(1);
    });

    it('indexUrl should return appropriate url', () => {
      expect(wrapper.instance().indexUrl()).toBe('/cms/Pugs');
    });
  });

});
