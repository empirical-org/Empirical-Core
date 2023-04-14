import * as React from 'react'
import { ShallowWrapper, shallow } from 'enzyme';
import CanvasInstanceForm, { CREATE_CANVAS_INSTANCE_PATH } from '../CanvasInstanceForm';
import * as requestsApi from '../../../../modules/request';

const updateInput = (wrapper: ShallowWrapper, selector: string, newValue: string) => {
  wrapper
    .find(selector)
    .simulate('change', { target: { value: newValue } });
}

describe('CanvasInstanceForm ', () => {
  const url = 'http://canvas.example.com'
  const clientId = 'abcdedfghijk';
  const clientSecret = '1234567890';

  let wrapper: ShallowWrapper

  beforeEach(() => {
    wrapper = shallow(<CanvasInstanceForm />);
  });

  it('renders form', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('submits the form', () => {
    const requestPostSpy = jest.spyOn(requestsApi, 'requestPost').mockImplementation(() => {})

    updateInput(wrapper, '#url', url)
    updateInput(wrapper, '#client_id', clientId)
    updateInput(wrapper, '#client_secret', clientSecret)

    wrapper
      .find('#submit_canvas_instance')
      .simulate('click', {preventDefault: () => {}})

    expect(requestPostSpy).toHaveBeenCalledWith(
      CREATE_CANVAS_INSTANCE_PATH,
      {
        "canvas_config": {
          "client_id": clientId,
          "client_secret": clientSecret
        },
        "canvas_instance": {
          "url": url
        }
      }
    )
  })
})
