
require 'test_helper'

module Comprehension
  class RegexCheckTest < ActiveSupport::TestCase
    setup do
      @prompt = create(:comprehension_prompt)
      @rule = create(:comprehension_rule, rule_type: 'Regex', prompts: [@prompt])
      @regex_rule = create(:comprehension_regex_rule, rule: @rule, regex_text: '^Test') 
      @feedback = create(:comprehension_feedback, rule: @rule, text: 'This string begins with the word Test!')
    end

    context '#initialize' do
      should 'should have working accessor methods for all initialized fields' do
        regex_check = Comprehension::RegexCheck.new("entry", @prompt)
        assert_equal regex_check.entry, "entry"
        assert_equal regex_check.prompt, @prompt
      end
    end

    context '#optimal?' do
      should 'be true when there is no regex match' do
        regex_check = Comprehension::RegexCheck.new("this is not a good regex match", @prompt)
        assert regex_check.optimal?
      end

      should 'be false when there is a regex match' do
        regex_check = Comprehension::RegexCheck.new("Test regex, this matches", @prompt)
        refute regex_check.optimal?
      end
    end

    context '#feedback' do
      should 'should be default correct feedback when there is no regex match' do
        regex_check = Comprehension::RegexCheck.new("this is not a regex match", @prompt)
        assert_equal regex_check.feedback, Comprehension::RegexCheck::ALL_CORRECT_FEEDBACK
      end

      should 'should be regex feedback when there is a regex match' do
        regex_check = Comprehension::RegexCheck.new("Test regex string to match", @prompt)
        assert_equal regex_check.feedback, @feedback.text
      end
    end
  end
end
