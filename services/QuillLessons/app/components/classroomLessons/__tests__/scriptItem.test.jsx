import React from 'react';

const ReactShallowRenderer = require('react-test-renderer/shallow');

import ScriptComponent from '../shared/scriptComponent';

describe('Script component', () => {
  describe('With no data', () => {
    it('should render begin button', () => {
      const renderer = new ReactShallowRenderer();
      renderer.render(
        <ScriptComponent
          script={[]}
        />
      );
      const wrapper = renderer.getRenderOutput();
      expect(wrapper.type).toBe('ul');
    });
  });
});
