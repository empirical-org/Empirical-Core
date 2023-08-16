import * as React from 'react'
import { ReactWrapper, mount } from 'enzyme';
import CanvasIntegrationForm, { CANVAS_INTEGRATIONS_PATH } from '../CanvasIntegrationForm';

import * as requestsApi from '../../../../modules/request';

const updateInput = (wrapper: ReactWrapper, selector: string, newValue: string) => {
  wrapper
    .find(selector)
    .at(1)
    .simulate('change', { target: { value: newValue } });
}

const selectSchoolCheckbox = (wrapper: ReactWrapper) => {
  wrapper
    .find('.quill-checkbox')
    .at(1)
    .simulate('click')
}

describe('CanvasIntegrationForm ', () => {
  const instanceUrl = 'http://canvas.example.com'
  const clientId = 'abcdedfghijk';
  const clientSecret = '1234567890';
  const school = { id: 1, name: 'School 1' }
  const schools = [school]

  const submitFormSpy = jest.spyOn(requestsApi, 'requestPost').mockImplementation(() => { })

  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<CanvasIntegrationForm passedSchools={schools} />);
    wrapper.find('#new_canvas_integration_button').simulate('click');
  });

  it('renders form', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('prevents submission if clientSecret is empty', () => {
    updateInput(wrapper, '#instance_url', instanceUrl)
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', '')
    selectSchoolCheckbox(wrapper)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('prevents submission if clientId empty', () => {
    updateInput(wrapper, '#instance_url', instanceUrl)
    updateInput(wrapper, '#client_id', '')
    updateInput(wrapper, '#client_secret', clientSecret)
    selectSchoolCheckbox(wrapper)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('prevents submission if url is empty', () => {
    updateInput(wrapper, '#instance_url', '')
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)
    selectSchoolCheckbox(wrapper)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('prevents submission if url is invalid', () => {
    updateInput(wrapper, '#instance_url', 'not-a-url')
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)
    selectSchoolCheckbox(wrapper)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('prevents submission if no school is selected', () => {
    updateInput(wrapper, '#instance_url', instanceUrl)
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('submits the form if input is valid', () => {

    updateInput(wrapper, '#instance_url', instanceUrl)
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)
    selectSchoolCheckbox(wrapper)

    wrapper
      .find('#submit_canvas_integration')
      .simulate('click', { preventDefault: () => { } })

    expect(submitFormSpy).toHaveBeenCalledWith(
      CANVAS_INTEGRATIONS_PATH,
      {
        "canvas_config": {
          "client_id": clientId,
          "client_secret": clientSecret
        },
        "canvas_instance": {
          "url": instanceUrl
        },
        "canvas_instance_schools": {
          "school_ids": [school.id]
        }
      },
      expect.any(Function)
    )
  })
})
