require 'test_helper'
require 'webmock/minitest'

module Comprehension
  class SpellingCheckTest < ActiveSupport::TestCase

    context '#feedback_object' do
      should 'return appropriate feedback attributes if there is a spelling error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20a%20spelin%20error%20here")
        .to_return(status: 200, body: {flaggedTokens: [{token: 'spelin'}]}.to_json, headers: {})

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
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here")
        .to_return(status: 200, body: {flaggedTokens: {}}.to_json, headers: {})

        entry = "there is no spelling error here"
        spelling_check = Comprehension::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        assert feedback[:feedback], 'Correct spelling!'
        assert feedback[:feedback_type], 'spelling'
        assert feedback[:optimal]
        assert feedback[:entry], entry
        assert feedback[:rule_uid], ''
        assert feedback[:concept_uid], 'H-2lrblngQAQ8_s-ctye4g'
      end

      should 'return appropriate error if the endpoint returns an error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here")
        .to_return(status: 200, body: {error: {message: "There's a problem here"}}.to_json, headers: {})
        entry = "there is no spelling error here"
        spelling_check = Comprehension::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        assert spelling_check.error, "There's a problem here"
      end
    end

  end
end
