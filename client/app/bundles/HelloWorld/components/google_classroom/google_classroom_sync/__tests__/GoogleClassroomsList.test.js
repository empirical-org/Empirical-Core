import React from 'react';
import { shallow, mount } from 'enzyme';
import GoogleClassroomsList from '../GoogleClassroomsList.jsx';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

const googleClasses = [
  {
    id: 4451629374,
    name: 'adsf',
    ownerId: '112188393285935083024',
    section: null,
    alreadyImported: true,
    grade: null,
    creationTime: '2017-02-23T17:11:04.422Z',
  }, {
    id: 3799271824,
    name: 'jan 17 the second 4a',
    ownerId: '112188393285935083024',
    section: '4a',
    alreadyImported: true,
    grade: '1',
    creationTime: '2017-01-17T21:18:48.252Z',
  }, {
    id: 3783127312,
    name: 'work?',
    ownerId: '112188393285935083024',
    section: null,
    alreadyImported: false,
    grade: null,
    creationTime: '2017-01-13T19:12:35.914Z',
  }];

const megaList = () => {
  // duplicates the classrooms and gives them a new id
  const list = [];
  googleClasses.forEach((classy) => {
    for (let i = 0; i < 6; i++) {
      const newClass = Object.assign({}, classy);
      newClass.id = classy.id + i;
      list.push(newClass);
    }
  });
  return list;
};

describe('the GoogleClassroomsList component', () => {
  const wrapper = mount(<GoogleClassroomsList classrooms={googleClasses} />);
  const wrapperWithManyClasses = mount(<GoogleClassroomsList classrooms={megaList()} />);

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('the table', () => {
    it('should render', () => {
      expect(wrapper.find('table').length).toBe(1);
    });

    // TODO: add test coverage for sorting functionality

    it('row should have a classes name in the first table cell', () => {
      expect(wrapper.find('td').at(1).text()).toEqual(googleClasses[1].name);
    });
  });

  describe('showAllRows', () => {
    describe('when it is false', () => {
      it('should be that way by default', () => {
        expect(wrapper.state().showAllRows).toEqual(false);
      });

      describe('the expansion row', () => {
        it('should render when there are more than 15 classes', () => {
          expect(wrapperWithManyClasses.find('tr').last().text()).toEqual(`You have ${megaList().length - 15} more classes (Show Classrooms)`);
        });

        it('should not render when there are less than 15 classes', () => {
          expect(wrapper.find('tr').last().text()).not.toEqual(expect.stringContaining('Show Classrooms'));
        });

        describe('when clicked', () => {
          it('should change showAllRows to true', () => {
            const wrapper = mount(<GoogleClassroomsList classrooms={megaList()} />);
            wrapper.find('tr').last().simulate('click');
            expect(wrapper.state('showAllRows')).toEqual(true);
          });

          it('should no longer render', () => {
            const wrapper = mount(<GoogleClassroomsList classrooms={megaList()} />);
            const expansionRow = wrapper.find('tr').last();
            expansionRow.simulate('click');
            expect(wrapper.find('tr').last()).not.toEqual(expansionRow);
          });

          it('should show all classes when there are more than 15', () => {
            const wrapper = mount(<GoogleClassroomsList classrooms={megaList()} />);
            expect(wrapper.find('tr').length).toEqual(16);
            wrapper.find('tr').last().simulate('click');
            expect(wrapper.find('tr').length).toEqual(megaList().length);
          });
        });
      });

      it('should not show more than 15 classrooms and an expansion row', () => {
        expect(wrapperWithManyClasses.find('tr').length).toEqual(16);
      });

      it('should have as many table rows as there are classes if there are less than 15', () => {
        expect(wrapper.find('tr').length).toBe(googleClasses.length);
      });
    });

    describe('when it is true', () => {
      it('should not be that way by default', () => {
        expect(wrapper.state().showAllRows).not.toEqual(true);
      });

      describe('the expansion row', () => {
        it('should not show', () => {
          expect(wrapper.find('tr').last().text()).not.toEqual(expect.stringContaining('Show Classrooms'));
        });

        it('should not show even if there are more than 15 classes', () => {
          const wrapper = mount(<GoogleClassroomsList classrooms={megaList()} />);
          wrapper.setState({ showAllRows: true, });
          expect(wrapper.find('tr').last().text()).not.toEqual(expect.stringContaining('Show Classrooms'));
        });
      });

      it('should show as many rows as there are classrooms if there are more than 15', () => {
        const wrapper = mount(<GoogleClassroomsList classrooms={megaList()} />);
        wrapper.setState({ showAllRows: true, });
        expect(wrapper.find('tr').length).toEqual(megaList().length);
      });

      it('should have as many table rows as there are classes if there are less than 15', () => {
        const wrapper = mount(<GoogleClassroomsList classrooms={googleClasses} />);
        wrapper.setState({ showAllRows: true, });
        expect(wrapper.find('tr').length).toBe(googleClasses.length);
      });
    });
  });

  describe('the syncClassrooms prop', () => {
    it('should not be called by default', () => {
      const mockSyncClassrooms = jest.fn();
      const wrapper = mount(<GoogleClassroomsList syncClassrooms={mockSyncClassrooms} classrooms={googleClasses} />);
      expect(mockSyncClassrooms.mock.calls.length).toEqual(0);
    });

    it('should be called when the sync classroom button is clicked', () => {
      const mockSyncClassrooms = jest.fn();
      const wrapper = mount(<GoogleClassroomsList syncClassrooms={mockSyncClassrooms} classrooms={googleClasses} />);
      wrapper.find('button').last().simulate('click');
      expect(mockSyncClassrooms.mock.calls.length).toEqual(1);
    });
  });
});
