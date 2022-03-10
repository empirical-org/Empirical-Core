# frozen_string_literal: true

require 'rails_helper'
require 'webmock/minitest'

module Evidence
  RSpec.describe(FeedbackController, :type => :controller) do
    before do
      @routes = Engine.routes
      create(:evidence_regex_rule, :regex_text => "^test", :rule => (rule_regex))
      create(:evidence_prompts_rule, :rule => (rule), :prompt => (prompt))
      create(:evidence_prompts_rule, :rule => (rule_regex), :prompt => (prompt))
      create(:evidence_plagiarism_text, :text => (plagiarized_text1), :rule => (rule))
      create(:evidence_plagiarism_text, :text => (plagiarized_text2), :rule => (rule))
    end

    let!(:prompt) { create(:evidence_prompt) }
    let!(:rule) { create(:evidence_rule, :rule_type => "plagiarism") }
    let!(:rule_regex) { create(:evidence_rule, :rule_type => "rules-based-1") }
    let(:plagiarized_text1) { "do not plagiarize this text please there will be consequences" }
    let(:plagiarized_text2) { "this is completely different text that you also should not plagiarize or else" }
    let!(:hint) { create(:evidence_hint, :rule => (rule)) }
    let!(:first_feedback) { create(:evidence_feedback, :text => "here is our first feedback", :rule => (rule), :order => 0) }
    let!(:second_feedback) { create(:evidence_feedback, :text => "here is our second feedback", :rule => (rule), :order => 1) }

    describe '#create' do
      context "autoML test" do
        it 'should return feedback payloads based on the lib matched_rule value' do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::AutoML])

          entry = "entry"
          AutomlCheck.stub_any_instance(:matched_rule, rule) do
            Rule.stub_any_instance(:determine_feedback_from_history, first_feedback) do
              post :create, params: {entry: entry, prompt_id: prompt.id, session_id: 1, previous_feedback: ([]) }, as: :json

              parsed_response = JSON.parse(response.body)
              expect({
                :feedback => first_feedback.text,
                :feedback_type => "autoML",
                :optimal => rule.optimal,
                :response_id => "",
                :entry => entry,
                :concept_uid => rule.concept_uid,
                :rule_uid => rule.uid,
                :highlight => ([]),
                :hint => rule.hint.serializable_hash
              }.stringify_keys).to(eq(parsed_response))
            end
          end
        end
      end

      context "spelling test" do
        it 'should return correct spelling feedback when endpoint returns 200' do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::Spelling])
          stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=test%20spelin%20error").to_return(:status => 200, :body => { :flaggedTokens => ([{ :token => "spelin" }]) }.to_json, :headers => ({}))
          post :create, params: { entry: "test spelin error", :prompt_id => prompt.id, :session_id => 1 }, as: :json

          parsed_response = JSON.parse(response.body)
          expect(response.status).to(eq(200))
          expect(parsed_response["optimal"]).to be false
        end
      end

      context 'regex1 test' do
        it 'should return successfully when there is regex1 feedback' do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::RegexSentence])
          post :create, params: {entry: "test regex response", prompt_id: prompt.id, session_id: 1, previous_feedback: ([]) }, as: :json

          parsed_response = JSON.parse(response.body)
          expect(parsed_response["optimal"]).to be false
        end
      end

      context 'regex2 test' do
        let!(:rule_regex2) { create(:evidence_regex_rule, :regex_text => "^test", :rule => (rule2)) }
        let!(:rule2) { create(:evidence_rule, :rule_type => "rules-based-2") }
        let!(:prompts_rule2) { create(:evidence_prompts_rule, :rule => (rule2), :prompt => (prompt)) }

        it 'should return successfully when there is regex2 feedback' do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::RegexPostTopic])
          post :create, params: {entry: "test regex response", prompt_id: prompt.id, session_id: 1, previous_feedback: ([]) }, as: :json

          parsed_response = JSON.parse(response.body)
          expect(parsed_response["optimal"]).to be false
        end
      end

      context 'regex3 test' do
        let!(:rule_regex3) { create(:evidence_regex_rule, :regex_text => "^test", :rule => (rule3)) }
        let!(:rule3) { create(:evidence_rule, :rule_type => "rules-based-3") }
        let!(:prompts_rule3) { create(:evidence_prompts_rule, :rule => (rule3), :prompt => (prompt)) }

        it 'should return successfully when there is regex3 feedback' do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::RegexTypo])
          post :create, params: {entry: "test regex response", prompt_id: prompt.id, session_id: 1, previous_feedback: ([]) }, as: :json

          parsed_response = JSON.parse(response.body)
          expect(parsed_response["optimal"]).to be false
        end
      end

      context 'plagiarism test' do
        it 'should return successfully when there is plagiarism that matches the second plagiarism text string' do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::Plagiarism])
          post :create, params: { entry: "bla bla bla #{plagiarized_text2}", prompt_id: prompt.id, session_id: 1, previous_feedback: [] }, as: :json

          parsed_response = JSON.parse(response.body)
          expect(parsed_response["optimal"]).to be false
          expect(plagiarized_text2).to(eq(parsed_response["highlight"][0]["text"]))
          expect(plagiarized_text2).to(eq(parsed_response["highlight"][1]["text"]))
          expect(first_feedback.text).to(eq(parsed_response["feedback"]))
          request.env.delete("RAW_POST_DATA")
          post("plagiarism", :params => ({ :entry => ("bla bla bla #{plagiarized_text2}"), :prompt_id => prompt.id, :session_id => 5, :previous_feedback => ([parsed_response]) }), :as => :json)
          parsed_response = JSON.parse(response.body)
          expect(parsed_response["optimal"]).to be false
          expect(second_feedback.text).to(eq(parsed_response["feedback"]))
        end
      end

      context 'prefilter test' do
        let!(:profanity_rule) do
          create(:evidence_rule, rule_type: 'prefilter', uid: 'fdee458a-f017-4f9a-a7d4-a72d1143abeb')
        end

        before do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::Prefilter])
        end

        context 'profanity violation' do
          it 'should return correct rule uid' do
            post :create, params: {
              entry: "nero was an ahole",
              prompt_id: prompt.id,
              session_id: 1,
              previous_feedback: ([])
            }, :as => :json
            expect(response.status).to eq 200
            parsed_response = JSON.parse(response.body)
            expect(parsed_response['optimal']).to be false
            expect(parsed_response['rule_uid']).to eq profanity_rule.uid
          end
        end

        context 'no violation' do
          it 'should return empty response' do
            post :create, params: {
              entry: "the quick brown fox",
              prompt_id: prompt.id,
              session_id: 1,
              previous_feedback: ([])
            }, :as => :json

            expect(response.status).to eq 200
            parsed_response = JSON.parse(response.body)
            expect(parsed_response).to eq({})
          end
        end
      end

      context "grammar rule test" do
        let(:example_error) { 'example_error' }
        let(:example_rule_uid) { 123 }
        let(:incoming_payload) do
          {
            'entry' => 'eat junk food at home.',
            'prompt_id' => prompt.id
          }
        end

        let(:client_response) do
          {
            'gapi_error' => example_error,
            'highlight' => [{
              'type': 'response',
              'text': 'someText',
              'character': 0
            }]
          }
        end

        let!(:grammar_rule) do
          create(:evidence_rule, uid: example_rule_uid, optimal: false, concept_uid: 'xyz')
        end

        let!(:grammar_hint) { create(:evidence_hint, rule: grammar_rule) }

        before do
          allow(Grammar::FeedbackAssembler).to receive(:error_to_rule_uid).and_return(
            { example_error => example_rule_uid }
          )
          allow_any_instance_of(Grammar::Client).to receive(:post).and_return(client_response)
        end

        it 'should return a valid json response' do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::Grammar])
          post :create, params: incoming_payload, as: :json

          expect(JSON.parse(response.body)).to eq({
            'concept_uid' => 'xyz',
            'feedback' => nil,
            'feedback_type' => 'grammar',
            'optimal' => false,
            'response_id' => '0',
            'highlight' => [
              { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
            ],
            'hint' => { 'id' => grammar_hint.id, 'explanation' => grammar_hint.explanation, 'image_link' => grammar_hint.image_link, 'image_alt_text' => grammar_hint.image_alt_text, 'rule_id' => grammar_hint.rule_id },
            'labels' => '',
            'rule_uid' => example_rule_uid.to_s
          })
        end
      end

      context "opinion test" do
        let(:example_error) { 'example_error' }
        let(:example_rule_uid) { 123 }
        let(:incoming_payload) do
          {
            'entry' => 'eat junk food at home.',
            'prompt_id' => prompt.id
          }
        end

        let(:client_response) do
          {
            'oapi_error' => example_error,
            'highlight' => [{
              'type': 'response',
              'text': 'someText',
              'character': 0
            }]
          }
        end

        let!(:opinion_rule) do
          create(:evidence_rule, uid: example_rule_uid, optimal: false, concept_uid: 'xyz')
        end

        let!(:opinion_hint) { create(:evidence_hint, rule: opinion_rule) }

        before do
          stub_const("Evidence::Check::ALL_CHECKS", [Check::Opinion])
          allow(Opinion::FeedbackAssembler).to receive(:error_to_rule_uid).and_return(
            { example_error => example_rule_uid }
          )
          allow_any_instance_of(Opinion::Client).to receive(:post).and_return(client_response)
        end

        it 'should return a valid json response' do
          post :create, params: incoming_payload, as: :json

          expect(JSON.parse(response.body)).to eq({
            'concept_uid' => 'xyz',
            'feedback' => nil,
            'feedback_type' => 'opinion',
            'optimal' => false,
            'response_id' => '0',
            'highlight' => [
              { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
            ],
            'hint' => { 'id' => opinion_hint.id, 'explanation' => opinion_hint.explanation, 'image_link' => opinion_hint.image_link, 'image_alt_text' => opinion_hint.image_alt_text, 'rule_id' => opinion_hint.rule_id },
            'labels' => '',
            'rule_uid' => example_rule_uid.to_s
          })
        end

        context 'Rule.feedback exists' do
          before do
            create(:evidence_feedback, rule_id: opinion_rule.id, text: 'lorem ipsum')
          end

          it 'should return a valid json response' do
            post :create, params: incoming_payload, as: :json

            expect(JSON.parse(response.body)).to eq({
              'concept_uid' => 'xyz',
              'feedback' => 'lorem ipsum',
              'feedback_type' => 'opinion',
              'optimal' => false,
              'response_id' => '0',
              'highlight' => [
                { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
              ],
              'hint' => { 'id' => opinion_hint.id, 'explanation' => opinion_hint.explanation, 'image_link' => opinion_hint.image_link, 'image_alt_text' => opinion_hint.image_alt_text, 'rule_id' => opinion_hint.rule_id },
              'labels' => '',
              'rule_uid' => example_rule_uid.to_s
            })
          end
        end
      end
    end

    describe '#grammar' do
      let(:example_error) { 'example_error' }
      let(:example_rule_uid) { 123 }
      let(:incoming_payload) do
        {
          'entry' => 'eat junk food at home.',
          'prompt_text' => 'Schools should not allow junk food to be sold on campus, but'
        }
      end

      let(:client_response) do
        {
          'gapi_error' => example_error,
          'highlight' => [{
            'type': 'response',
            'text': 'someText',
            'character': 0
          }]
        }
      end

      let!(:grammar_rule) do
        create(:evidence_rule, uid: example_rule_uid, optimal: false, concept_uid: 'xyz')
      end

      let!(:grammar_hint) { create(:evidence_hint, rule: grammar_rule) }

      before do
        allow(Grammar::FeedbackAssembler).to receive(:error_to_rule_uid).and_return(
          { example_error => example_rule_uid }
        )
        allow_any_instance_of(Grammar::Client).to receive(:post).and_return(client_response)
      end

      it 'should return a valid json response' do
        post :grammar, params: incoming_payload, as: :json

        expect(JSON.parse(response.body)).to eq({
          'concept_uid' => 'xyz',
          'feedback' => nil,
          'feedback_type' => 'grammar',
          'optimal' => false,
          'response_id' => '0',
          'highlight' => [
            { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
          ],
          'hint' => { 'id' => grammar_hint.id, 'explanation' => grammar_hint.explanation, 'image_link' => grammar_hint.image_link, 'image_alt_text' => grammar_hint.image_alt_text, 'rule_id' => grammar_hint.rule_id },
          'labels' => '',
          'rule_uid' => example_rule_uid.to_s
        })
      end

      context 'Rule.feedback exists' do
        before do
          create(:evidence_feedback, rule_id: grammar_rule.id, text: 'lorem ipsum')
        end

        it 'should return a valid json response' do
          post :grammar, params: incoming_payload, as: :json

          expect(JSON.parse(response.body)).to eq({
            'concept_uid' => 'xyz',
            'feedback' => 'lorem ipsum',
            'feedback_type' => 'grammar',
            'optimal' => false,
            'response_id' => '0',
            'highlight' => [
              { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
            ],
            'hint' => { 'id' => grammar_hint.id, 'explanation' => grammar_hint.explanation, 'image_link' => grammar_hint.image_link, 'image_alt_text' => grammar_hint.image_alt_text, 'rule_id' => grammar_hint.rule_id },
            'labels' => '',
            'rule_uid' => example_rule_uid.to_s
          })
        end
      end

    end

    describe '#opinion' do
      let(:example_error) { 'example_error' }
      let(:example_rule_uid) { 123 }
      let(:incoming_payload) do
        {
          'entry' => 'eat junk food at home.',
          'prompt_text' => 'Schools should not allow junk food to be sold on campus, but'
        }
      end

      let(:client_response) do
        {
          'oapi_error' => example_error,
          'highlight' => [{
            'type': 'response',
            'text': 'someText',
            'character': 0
          }]
        }
      end

      let!(:opinion_rule) do
        create(:evidence_rule, uid: example_rule_uid, optimal: false, concept_uid: 'xyz')
      end

      let!(:opinion_hint) { create(:evidence_hint, rule: opinion_rule) }

      before do
        allow(Opinion::FeedbackAssembler).to receive(:error_to_rule_uid).and_return(
          { example_error => example_rule_uid }
        )
        allow_any_instance_of(Opinion::Client).to receive(:post).and_return(client_response)
      end

      it 'should return a valid json response' do
        post :opinion, params: incoming_payload, as: :json

        expect(JSON.parse(response.body)).to eq({
          'concept_uid' => 'xyz',
          'feedback' => nil,
          'feedback_type' => 'opinion',
          'optimal' => false,
          'response_id' => '0',
          'highlight' => [
            { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
          ],
          'hint' => { 'id' => opinion_hint.id, 'explanation' => opinion_hint.explanation, 'image_link' => opinion_hint.image_link, 'image_alt_text' => opinion_hint.image_alt_text, 'rule_id' => opinion_hint.rule_id },
          'labels' => '',
          'rule_uid' => example_rule_uid.to_s
        })
      end

      context 'Rule.feedback exists' do
        before do
          create(:evidence_feedback, rule_id: opinion_rule.id, text: 'lorem ipsum')
        end

        it 'should return a valid json response' do
          post :opinion, params: incoming_payload, as: :json

          expect(JSON.parse(response.body)).to eq({
            'concept_uid' => 'xyz',
            'feedback' => 'lorem ipsum',
            'feedback_type' => 'opinion',
            'optimal' => false,
            'response_id' => '0',
            'highlight' => [
              { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
            ],
            'hint' => { 'id' => opinion_hint.id, 'explanation' => opinion_hint.explanation, 'image_link' => opinion_hint.image_link, 'image_alt_text' => opinion_hint.image_alt_text, 'rule_id' => opinion_hint.rule_id },
            'labels' => '',
            'rule_uid' => example_rule_uid.to_s
          })
        end
      end

    end

    describe '#prefilter' do
      let!(:profanity_rule) do
        create(:evidence_rule, rule_type: 'prefilter', uid: 'fdee458a-f017-4f9a-a7d4-a72d1143abeb')
      end

      context 'profanity violation' do
        it 'should return correct rule uid' do
          post "prefilter", :params => ({
            :entry => "nero was an ahole",
            :prompt_id => prompt.id,
            :session_id => 1,
            :previous_feedback => ([])
          }), :as => :json
          expect(response.status).to eq 200
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['optimal']).to be false
          expect(parsed_response['rule_uid']).to eq profanity_rule.uid
        end
      end

      context 'no violation' do
        it 'should return successfully' do
          post "prefilter", :params => ({
            :entry => "the quick brown fox",
            :prompt_id => prompt.id,
            :session_id => 1,
            :previous_feedback => ([])
          }), :as => :json
          expect(response.status).to eq 200
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['optimal']).to be true
          expect(parsed_response['rule_uid']).to eq PrefilterCheck::OPTIMAL_RULE_UID
        end
      end
    end

    context 'should plagiarism' do
      it 'should return successfully' do
        post("plagiarism", :params => ({ :entry => "No plagiarism here.", :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be true
      end

      it 'should return 404 if prompt id does not exist' do
        post("plagiarism", :params => ({ :entry => "No plagiarism here.", :prompt_id => 100, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        expect(response.status).to(eq(404))
      end

      it 'should return successfully when there is plagiarism that matches the first plagiarism text string' do
        post("plagiarism", :params => ({ :entry => ("bla bla bla #{plagiarized_text1}"), :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be false
        expect(plagiarized_text1).to(eq(parsed_response["highlight"][0]["text"]))
        expect(plagiarized_text1).to(eq(parsed_response["highlight"][1]["text"]))
        expect(first_feedback.text).to(eq(parsed_response["feedback"]))
        request.env.delete("RAW_POST_DATA")
        post("plagiarism", :params => ({ :entry => ("bla bla bla #{plagiarized_text1}"), :prompt_id => prompt.id, :session_id => 5, :previous_feedback => ([parsed_response]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be false
        expect(second_feedback.text).to(eq(parsed_response["feedback"]))
      end

      it 'should return successfully when there is plagiarism that matches the second plagiarism text string' do
        post("plagiarism", :params => ({ :entry => ("bla bla bla #{plagiarized_text2}"), :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be false
        expect(plagiarized_text2).to(eq(parsed_response["highlight"][0]["text"]))
        expect(plagiarized_text2).to(eq(parsed_response["highlight"][1]["text"]))
        expect(first_feedback.text).to(eq(parsed_response["feedback"]))
        request.env.delete("RAW_POST_DATA")
        post("plagiarism", :params => ({ :entry => ("bla bla bla #{plagiarized_text2}"), :prompt_id => prompt.id, :session_id => 5, :previous_feedback => ([parsed_response]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be false
        expect(second_feedback.text).to(eq(parsed_response["feedback"]))
      end

      it 'should return successfully when there is fuzzy match plagiarism' do
        post("plagiarism", :params => ({ :entry => ("bla bla bla FZY#{plagiarized_text1}"), :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be false
        expect("FZY#{plagiarized_text1}").to(eq(parsed_response["highlight"][0]["text"]))
        expect(plagiarized_text1).to(eq(parsed_response["highlight"][1]["text"]))
        expect(first_feedback.text).to(eq(parsed_response["feedback"]))
        request.env.delete("RAW_POST_DATA")
        post("plagiarism", :params => ({ :entry => ("bla bla bla #{plagiarized_text1}"), :prompt_id => prompt.id, :session_id => 5, :previous_feedback => ([parsed_response]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be false
        expect(second_feedback.text).to(eq(parsed_response["feedback"]))
      end
    end

    context 'should regex' do

      it 'should return successfully' do
        post("regex", :params => ({ :rule_type => rule_regex.rule_type, :entry => "no regex problems here.", :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be true
      end

      it 'should return 404 if prompt id does not exist' do
        post("regex", :params => ({ :rule_type => rule_regex.rule_type, :entry => "no regex problems here.", :prompt_id => 100, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        expect(response.status).to(eq(404))
      end

      it 'should return 404 if rule_type does not exist' do
        post("regex", :params => ({ :rule_type => "not-rule-type", :entry => "no regex problems here.", :prompt_id => 100, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        expect(response.status).to(eq(404))
      end

      it 'should return successfully when there is regex feedback' do
        post("regex", :params => ({ :rule_type => rule_regex.rule_type, :entry => "test regex response", :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["optimal"]).to be false
      end
    end

    context 'should #automl' do

      it 'should return 404 if prompt id does not exist' do
        post("automl", :params => ({ :entry => "some text", :prompt_id => (prompt.id + 1000), :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        expect(response.status).to(eq(404))
      end

      it 'should return 404 if prompt has no associated automl_model' do
        post("automl", :params => ({ :entry => "some text", :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        expect(response.status).to(eq(404))
      end

      it 'should return feedback payloads based on the lib matched_rule value' do
        entry = "entry"
        AutomlCheck.stub_any_instance(:matched_rule, rule) do
          Rule.stub_any_instance(:determine_feedback_from_history, first_feedback) do
            post("automl", :params => ({ :entry => entry, :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
            parsed_response = JSON.parse(response.body)
            expect({
              :feedback => first_feedback.text,
              :feedback_type => "autoML",
              :optimal => rule.optimal,
              :response_id => "",
              :entry => entry,
              :concept_uid => rule.concept_uid,
              :rule_uid => rule.uid,
              :highlight => ([]),
              :hint => rule.hint.serializable_hash
            }.stringify_keys).to(eq(parsed_response))
          end
        end
      end
    end

    context 'should #spelling' do

      it 'should return correct spelling feedback when endpoint returns 200' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=test%20spelin%20error").to_return(:status => 200, :body => { :flaggedTokens => ([{ :token => "spelin" }]) }.to_json, :headers => ({}))
        post("spelling", :params => ({ :entry => "test spelin error", :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to(eq(200))
        expect(parsed_response["optimal"]).to be false
      end

      it 'should return 500 if there is an error on the bing API' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_return(:status => 200, :body => { :error => ({ :message => "There's a problem here" }) }.to_json, :headers => ({}))
        post("spelling", :params => ({ :entry => "there is no spelling error here", :prompt_id => prompt.id, :session_id => 1, :previous_feedback => ([]) }), :as => :json)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to(eq(500))
        expect(parsed_response["error"]).to(eq("There's a problem here"))
      end
    end
  end
end
