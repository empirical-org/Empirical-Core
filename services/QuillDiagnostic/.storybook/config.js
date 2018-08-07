import { configure } from '@kadira/storybook';

function loadStories() {
  require('../app/components/stories/button');
  // require as many as stories you need.
}

configure(loadStories, module);
