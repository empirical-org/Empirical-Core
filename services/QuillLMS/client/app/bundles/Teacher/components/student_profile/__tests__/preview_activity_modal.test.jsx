import React from 'react';
import { mount } from 'enzyme';

import PreviewActivityModal from '../preview_activity_modal';

describe('PreviewActivityModal component', () => {

  it('should render', () => {
    const wrapper = mount(
      <PreviewActivityModal
        onClosePreviewActivityModalClick={() => {}}
        previewActivityId={1}
      />
    );
    expect(wrapper).toMatchSnapshot()
  });
});
