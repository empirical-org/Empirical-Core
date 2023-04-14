import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import ModelQuestion from '../static';

const props = {
  data: {
    play: {
      cues: [""],
      instructions: "",
      prompt: "<p>The magician made a _________ dragon appear on stage.</p>"
    },
    teach: {
      script: [
        {
          data: {
            body: "<p><strong>Say: </strong>Let’s try adding our own describing word to a sentence. Watch as I add a describing word to this sentence.</p>\n<p><strong>Say: </strong>The magician made a dragon appear on stage.</p>\n<p><strong>Say: </strong>I’m going to add a describing word in the blank. The word I add needs to describe the word right after it. In this sentence, that word is <em>dragon</em>. Does anyone have any suggestions of how I could describe the dragon?</p>\n<p><em>Write the students’ suggestions in the Model Your Answer box.&nbsp;</em></p>\n<p><strong>Say: </strong>Any of these words will work! Let’s choose one to complete our sentence.&nbsp;</p>\n<p><em>Choose one describing word or have the students vote on the one they like the best.</em></p>\n<p><em>In the Model Your Answer box, write the prompt, adding the chosen describing word to the sentence</em>.</p>",
            heading: "Model adding a describing word to the example sentence."
          },
          type: "STEP-HTML"
        },
        {
          type: "T-MODEL"
        }
      ],
      title: "Teacher Model"
    }
  },
  model: "<p>The magician made a <strong>magic</strong> dragon appear on stage.</p>",
  prompt: "<p>The magician made a _________ dragon appear on stage.</p>"
}


describe('ModelQuestion component', () => {
  it('renders on the student screen', () => {
    const wrapper = mount(<ModelQuestion {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders on a projector', () => {
    const wrapper = mount(<ModelQuestion {...props} projector={true} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
