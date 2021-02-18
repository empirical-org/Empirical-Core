require 'test_helper'

module Comprehension
  class PlagiarismCheckTest < ActiveSupport::TestCase
    setup do
      @rule = create(:comprehension_rule, rule_type: 'plagiarism')
    end

    context '#feedback_object' do
      should 'return appropriate feedback attributes if there is plagiarism' do
        entry = "these are s'',ome! r''esponse words to plagiarize"
        passage = "these are some res,,,,ponse,,,, words to plagiarize"
        feedback = "this is some standard plagiarism feedback"
        plagiarism_check = Comprehension::PlagiarismCheck.new(entry, passage, feedback, @rule)
        feedback = plagiarism_check.feedback_object
        assert feedback[:feedback], feedback
        assert feedback[:feedback_type], Comprehension::Rule::TYPE_PLAGIARISM
        refute feedback[:optimal]
        assert feedback[:entry], entry
        assert feedback[:rule_uid], @rule.uid
        assert feedback[:concept_uid], @rule.concept_uid
        assert feedback[:highlight][0][:text], entry
        assert feedback[:highlight][1][:text], passage
      end

      should 'return appropriate feedback when there is no plagiarism' do

        entry = "these are some response words to plagiarize"
        passage = "it is always bad to plagiarize"
        feedback = "this is some standard plagiarism feedback"
        plagiarism_check = Comprehension::PlagiarismCheck.new(entry, passage, feedback, @rule)
        feedback = plagiarism_check.feedback_object
        assert feedback[:feedback], Comprehension::PlagiarismCheck::ALL_CORRECT_FEEDBACK
        assert feedback[:feedback_type], Comprehension::Rule::TYPE_PLAGIARISM
        assert feedback[:optimal]
        assert feedback[:entry], entry
        assert feedback[:rule_uid], @rule.uid
        assert feedback[:concept_uid], @rule.concept_uid
      end

    end

  end
end
