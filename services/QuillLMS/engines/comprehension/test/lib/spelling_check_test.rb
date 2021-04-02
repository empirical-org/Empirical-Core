require 'test_helper'

module Comprehension
  class SpellingCheckTest < ActiveSupport::TestCase

    context '#feedback_object' do
      should 'return appropriate feedback attributes if there is a spelling error' do
        entry = "there is a spelin error here"
        spelling_check = Comprehension::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        assert feedback[:feedback], 'Try again. There may be a spelling mistake.'
        assert feedback[:feedback_type], 'spelling'
        refute feedback[:optimal]
        assert feedback[:entry], entry
        assert feedback[:rule_uid], ''
        assert feedback[:concept_uid], 'H-2lrblngQAQ8_s-ctye4g'
        assert feedback[:highlight][0][:text], 'spelin'
      end

      should 'return appropriate feedback attributes if there is no spelling error' do
        entry = "there is no spelling error here"
        feedback = "this is some standard spelling feedback"
        spelling_check = Comprehension::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        assert feedback[:feedback], 'Correct spelling!'
        assert feedback[:feedback_type], 'spelling'
        assert feedback[:optimal]
        assert feedback[:entry], entry
        assert feedback[:rule_uid], ''
        assert feedback[:concept_uid], 'H-2lrblngQAQ8_s-ctye4g'
      end
    end

  end
end
