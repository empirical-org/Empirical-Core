import * as React from 'react'
import { ReactWrapper, mount } from 'enzyme';
import CanvasInstanceForm, { CREATE_CANVAS_INSTANCE_PATH } from '../CanvasInstanceForm';
import * as requestsApi from '../../../../modules/request';

const updateInput = (wrapper: ReactWrapper, selector: string, newValue: string) => {
  wrapper
    .find(selector)
    .simulate('change', { target: { value: newValue } });
}

const selectSchoolCheckbox = (wrapper: ReactWrapper) => {
  wrapper
    .find('.school-row button.quill-checkbox')
    .simulate('click')
}

describe('CanvasInstanceForm ', () => {
  const url = 'http://canvas.example.com'
  const clientId = 'abcdedfghijk';
  const clientSecret = '1234567890';
  const school = { id: 1, name: 'School 1'}
  const schools = [school]

  const submitFormSpy = jest.spyOn(requestsApi, 'requestPost').mockImplementation(() => {})

  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<CanvasInstanceForm passedSchools={schools} />);
  });

  it('renders form', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('prevents submission if clientSecret is empty', () => {
    updateInput(wrapper, '#url', url)
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', '')
    selectSchoolCheckbox(wrapper)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('prevents submission if clientId empty', () => {
    updateInput(wrapper, '#url', url)
    updateInput(wrapper, '#client_id', '')
    updateInput(wrapper, '#client_secret', clientSecret)
    selectSchoolCheckbox(wrapper)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('prevents submission if url is empty', () => {
    updateInput(wrapper, '#url', '')
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)
    selectSchoolCheckbox(wrapper)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('prevents submission if url is invalid', () => {
    updateInput(wrapper, '#url', 'not-a-url')
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)
    selectSchoolCheckbox(wrapper)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('prevents submission if no school is selected', () => {
    updateInput(wrapper, '#url', url)
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)

    expect(submitFormSpy).not.toHaveBeenCalled()
  })

  it('submits the form if input is valid', () => {
    updateInput(wrapper, '#url', url)
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)
    selectSchoolCheckbox(wrapper)

    wrapper
      .find('#submit_canvas_instance')
      .simulate('click', {preventDefault: () => {}})

    expect(submitFormSpy).toHaveBeenCalledWith(
      CREATE_CANVAS_INSTANCE_PATH,
      {
        "canvas_config": {
          "client_id": clientId,
          "client_secret": clientSecret
        },
        "canvas_instance": {
          "url": url
        },
        "canvas_instance_schools": {
          "school_ids": [school.id]
        }
      }
    )
  })
})
