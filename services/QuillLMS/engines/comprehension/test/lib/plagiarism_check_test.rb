require 'test_helper'

module Comprehension
  class PlagiarismCheckTest < ActiveSupport::TestCase
    context '#initialize' do
      should 'should have working accessor methods for all initialized fields' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("entry", "passage", "feedback")
        assert_equal plagiarism_check.entry, "entry"
        assert_equal plagiarism_check.passage, "passage"
        assert_equal plagiarism_check.nonoptimal_feedback, "feedback"
      end
    end

    context '#optimal' do
      should 'be true when there is no plagiarism' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("these are some response words", "this is the passage", nil)
        assert plagiarism_check.optimal?
      end

      should 'be false when there is plagiarism' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("these are some response words to plagiarize", "these are some response words to plagiarize", nil)
        refute plagiarism_check.optimal?
      end
    end

    context '#feedback' do
      should 'should be default correct feedback when there is no plagiarism' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("these are some response words", "this is the passage", nil)
        assert_equal plagiarism_check.feedback, Comprehension::PlagiarismCheck::ALL_CORRECT_FEEDBACK
      end

      should 'should be nonoptimal feedback when there is plagiarism' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("these are some response words to plagiarize", "these are some response words to plagiarize", "that was plagiarized")
        assert_equal plagiarism_check.feedback, "that was plagiarized"
      end
    end

    context '#highlights' do
      should 'should be empty when there is no plagiarism' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("these are some response words", "this is the passage", nil)
        assert_equal plagiarism_check.highlights, []
      end

      should 'should return appropriate highlighted phrases when there is plagiarism' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("these are some response words to plagiarize", "these are some response words to plagiarize", nil)
        assert_equal plagiarism_check.highlights[0][:text], "these are some response words to plagiarize"
        assert_equal plagiarism_check.highlights[1][:text], "these are some response words to plagiarize"
      end

      should 'should return appropriate highlighted phrases with punctuation when there is plagiarism' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("these? are some,,,,, response words! to plagiarize", "these are some response words to plagiarize", nil)
        assert_equal plagiarism_check.highlights[0][:text], "these? are some,,,,, response words! to plagiarize"
        assert_equal plagiarism_check.highlights[1][:text], "these are some response words to plagiarize"
      end

      should 'should return appropriate highlighted phrases with punctuation when there is plagiarism 2' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("these? are some,,,,, response words! to plagiarize", "these are some!! response!! words !,to plagi?arize", nil)
        assert_equal plagiarism_check.highlights[0][:text], "these? are some,,,,, response words! to plagiarize"
        assert_equal plagiarism_check.highlights[1][:text], "these are some!! response!! words !,to plagi?arize"
      end

      should 'should return the longest plagiarized phrase when there are two or more plagiarized phrases' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("there is one plagiarized phrase here, but this plagiarized phrase is a little longer", "there is one plagiarized phrase here, and we see that this plagiarized phrase is a little longer", nil)
        assert_equal plagiarism_check.highlights[0][:text], "this plagiarized phrase is a little longer"
        assert_equal plagiarism_check.highlights[1][:text], "this plagiarized phrase is a little longer"
      end

      should 'should return the longest plagiarized phrase when there are duplicate words' do
        plagiarism_check = Comprehension::PlagiarismCheck.new("test test test test test test", "test test test test test test test test", nil)
        assert_equal plagiarism_check.highlights[0][:text], "test test test test test test"
        assert_equal plagiarism_check.highlights[1][:text], "test test test test test test"
      end
    end
  end
end
