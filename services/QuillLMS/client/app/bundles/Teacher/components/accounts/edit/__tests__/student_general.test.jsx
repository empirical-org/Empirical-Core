import React from 'react';
import { shallow } from 'enzyme';

import StudentGeneralAccountInfo from '../student_general.jsx';

describe('StudentGeneralAccountInfo component', () => {
  const mockProps = {
    activateSection: jest.fn(),
    deactivateSection: jest.fn(),
    email: 'test@email.com',
    errors: {},
    updateUser: jest.fn(),
    userName: 'test-username'
  };
  const component = shallow(<StudentGeneralAccountInfo {...mockProps} />);
  it('should render', () => {
    expect(component).toMatchSnapshot();
  });
  it('activateSection class function should call activateSection prop function and set showButtonSecttion piece of state to true', () => {
    component.instance().activateSection();
    expect(mockProps.activateSection).toHaveBeenCalled();
    expect(component.state().showButtonSection).toEqual(true);
  });
  it('handleCancel calls reset class function and deactivateSection prop function', () => {
    const instance = component.instance();
    instance.reset = jest.fn();
    instance.handleCancel();
    expect(instance.reset).toHaveBeenCalled();
    expect(mockProps.deactivateSection).toHaveBeenCalled();
  });
  it('updateField updates piece of state for that field', () => {
    const e1 = {
      preventDefault: jest.fn(),
      target: {
        value: 'vittar@email.com'
      }
    };
    const e2 = {
      preventDefault: jest.fn(),
      target: {
        value: 'pabllo-vittar'
      }
    };
    component.instance().updateField(e1, 'email');
    component.instance().updateField(e2, 'userName');
    expect(component.state().email).toEqual('vittar@email.com');
    expect(component.state().userName).toEqual('pabllo-vittar');
  });
  it('submitClass should show button when state differs from props and hide it when they match', () => {
    expect(component.instance().submitClass()).toEqual('quill-button contained primary medium focus-on-light');
    component.setState({ email: 'test@email.com', userName: 'test-username' });
    expect(component.instance().submitClass()).toEqual('quill-button contained primary medium focus-on-light disabled');
  });
  it('renderButtonSection should render button section if showButtonSection piece of state is true', () => {
    const button = (<div className="button-section">
      <button className="quill-button outlined secondary medium focus-on-light" id="cancel" onClick={component.instance().handleCancel} type="button">Cancel</button>
      <input aria-label="Save changes" className={component.instance().submitClass()} name="commit" type="submit" value="Save changes" />
    </div>);
    component.setState({ showButtonSection: true });
    expect(component.instance().renderButtonSection()).toEqual(button);
    component.setState({ showButtonSection: false });
    expect(component.instance().renderButtonSection()).toEqual(undefined);
  });
  it('handleSubmit should calle updateUser prop function', () => {
    const e = { preventDefault: jest.fn() };
    component.instance().handleSubmit(e);
    expect(mockProps.updateUser).toHaveBeenCalled();
  });
});
