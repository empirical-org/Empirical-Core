import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Static from '../static';

const props = {
  data: {
    play: {
      html: "<p>By the end of class today, you will be able to combine sentences by:&nbsp;</p>\n<blockquote>Using <strong>and</strong> to connect two people or things doing the same action.</blockquote>\n<blockquote>Changing the <strong>action word</strong> to match the number of people or things doing the action.</blockquote>"
    },
    teach: {
      script: [
        {
          data: {
            body: "<p><strong>Say:</strong> Take a minute to read today’s objective out loud to your partner.</p>\n<p><em>Wait for students to finish.</em></p>\n<p><strong>Say:</strong> &nbsp;Today, you’re going to learn one way to combine sentences so that your writing is clearer and less repetitive.</p>",
            heading: "Introduce the objective for the lesson. "
          },
          type: "STEP-HTML"
        }
      ],
      title: "Objectives"
    }
  }
}


describe('Static component', () => {
  it('renders', () => {
    const wrapper = mount(<Static {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
