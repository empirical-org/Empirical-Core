require 'test_helper'


module Comprehension
  class RulesControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
      should "return successfully - no rule" do
        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with rules' do
        setup do
          @rule = create(:comprehension_rule)
        end

        should "return successfully" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?

          assert_equal @rule.uid, parsed_response.first['uid']

          assert_equal @rule.name, parsed_response.first['name']

          assert_equal @rule.description, parsed_response.first['description']

          assert_equal @rule.universal, parsed_response.first['universal']

          assert_equal @rule.rule_type, parsed_response.first['rule_type']

          assert_equal @rule.optimal, parsed_response.first['optimal']

          assert_equal @rule.suborder, parsed_response.first['suborder']

          assert_equal @rule.concept_uid, parsed_response.first['concept_uid']

        end
      end
    end

    context "create" do
      setup do
        @rule = build(:comprehension_rule)
      end

      should "create a valid record and return it as json" do
        assert_equal 0, Rule.count

        post :create, rule: { concept_uid: @rule.concept_uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: @rule.suborder, rule_type: @rule.rule_type, universal: @rule.universal, prompt_ids: @rule.prompt_ids }

        parsed_response = JSON.parse(response.body)
        assert_equal 201, response.code.to_i

        assert_equal @rule.name, parsed_response['name']

        assert_equal @rule.description, parsed_response['description']

        assert_equal @rule.universal, parsed_response['universal']

        assert_equal @rule.rule_type, parsed_response['rule_type']

        assert_equal @rule.optimal, parsed_response['optimal']

        assert_equal @rule.suborder, parsed_response['suborder']

        assert_equal @rule.concept_uid, parsed_response['concept_uid']

        assert_equal @rule.prompt_ids, parsed_response['prompt_ids']

        assert_equal 1, Rule.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, rule: { concept_uid: @rule.uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: -1, rule_type: @rule.rule_type, universal: @rule.universal }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['suborder'].include?("must be greater than or equal to 0")
        assert_equal 0, Rule.count
      end

      should "return an error if regex is invalid" do
        post :create, rule: { concept_uid: @rule.uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: 1, rule_type: @rule.rule_type, universal: @rule.universal,
          regex_rules_attributes:
            [
              {
                regex_text: '(invalid|',
                case_sensitive: false
              }
            ]}

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['errors'][0].include?("Invalid regex")
      end

      should "create a valid record with plagiarism_text attributes" do
        plagiarism_text = "Here is some text to be checked for plagiarism."
        post :create, rule: {
              concept_uid: @rule.concept_uid,
              description: @rule.description,
              name: @rule.name,
              optimal: @rule.optimal,
              suborder: @rule.suborder,
              rule_type: @rule.rule_type,
              universal: @rule.universal,
              plagiarism_text_attributes: {
                text: plagiarism_text
              }
            }

        parsed_response = JSON.parse(response.body)
        assert_equal @rule.name, parsed_response['name']
        assert_equal plagiarism_text, parsed_response['plagiarism_text']['text']
      end

      should "create nested feedback record when present in params" do
        assert_equal 0, Feedback.count

        feedback = build(:comprehension_feedback)
        post :create, rule: {
          concept_uid: @rule.concept_uid,
          description: @rule.description,
          name: @rule.name,
          optimal: @rule.optimal,
          suborder: @rule.suborder,
          rule_type: @rule.rule_type,
          universal: @rule.universal,
          feedbacks_attributes:
            [
              {
                text: feedback.text,
                description: feedback.description,
                order: feedback.order
              }
            ]
        }

        parsed_response = JSON.parse(response.body)
        assert_equal 201, response.code.to_i

        assert_equal feedback.text, parsed_response['feedbacks'][0]['text']
        assert_equal feedback.description, parsed_response['feedbacks'][0]['description']
        assert_equal feedback.order, parsed_response['feedbacks'][0]['order']

        assert_equal 1, Feedback.count
      end

      should "create nested highlight record when nested in feedback_attributes" do
        assert_equal 0, Highlight.count

        feedback = create(:comprehension_feedback, rule: @rule)
        highlight = build(:comprehension_highlight, starting_index: 2)
        post :create, rule: { concept_uid: @rule.concept_uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: @rule.suborder, rule_type: @rule.rule_type, universal: @rule.universal, feedbacks_attributes: [{text: feedback.text, description: feedback.description, order: feedback.order, highlights_attributes: [{text: highlight.text, highlight_type: highlight.highlight_type, starting_index: highlight.starting_index }]}]}

        parsed_response = JSON.parse(response.body)
        assert_equal 201, response.code.to_i

        assert_equal highlight.text, parsed_response['feedbacks'][0]['highlights'][0]['text']
        assert_equal highlight.highlight_type, parsed_response['feedbacks'][0]['highlights'][0]['highlight_type']
        assert_equal highlight.starting_index, parsed_response['feedbacks'][0]['highlights'][0]['starting_index']

        assert_equal 1, Highlight.count
      end

      should "create nested regex rule record when present in params" do
        assert_equal 0, RegexRule.count

        regex_rule = build(:comprehension_regex_rule)
        post :create, rule: {
          concept_uid: @rule.concept_uid,
          description: @rule.description,
          name: @rule.name,
          optimal: @rule.optimal,
          suborder: @rule.suborder,
          rule_type: @rule.rule_type,
          universal: @rule.universal,
          regex_rules_attributes:
            [
              {
                regex_text: regex_rule.regex_text,
                case_sensitive: regex_rule.case_sensitive
              }
            ]
        }

        parsed_response = JSON.parse(response.body)
        assert_equal 201, response.code.to_i

        assert_equal regex_rule.regex_text, parsed_response['regex_rules'][0]['regex_text']
        assert_equal regex_rule.case_sensitive, parsed_response['regex_rules'][0]['case_sensitive']

        assert_equal 1, RegexRule.count
      end
    end

    context "show" do
      setup do
        @rule = create(:comprehension_rule)
      end

      should "return json if found" do
        get :show, id: @rule.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
        assert_equal @rule.uid, parsed_response['uid']

        assert_equal @rule.name, parsed_response['name']

        assert_equal @rule.description, parsed_response['description']

        assert_equal @rule.universal, parsed_response['universal']

        assert_equal @rule.rule_type, parsed_response['rule_type']

        assert_equal @rule.optimal, parsed_response['optimal']

        assert_equal @rule.suborder, parsed_response['suborder']

        assert_equal @rule.concept_uid, parsed_response['concept_uid']

      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @prompt = create(:comprehension_prompt)
        @rule = create(:comprehension_rule, prompt_ids: [@prompt.id])
      end

      should "update record if valid, return nothing" do
        new_prompt = create(:comprehension_prompt)
        patch :update, id: @rule.id, rule: { concept_uid: @rule.concept_uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: @rule.suborder, rule_type: @rule.rule_type, universal: @rule.universal, prompt_ids: [new_prompt.id] }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        assert_equal @rule.reload.prompt_ids, [new_prompt.id]
      end

      should "not update record and return errors as json" do
        patch :update, id: @rule.id, rule: { concept_uid: @rule.concept_uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: -1, rule_type: @rule.rule_type, universal: @rule.universal }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['suborder'].include?("must be greater than or equal to 0")
      end

      should "update a valid record with plagiarism_text attributes" do
        plagiarism_text = "New plagiarism text"
        patch :update, id: @rule.id, rule: { plagiarism_text_attributes: {text: plagiarism_text}}

        assert_equal @rule.reload.plagiarism_text.text, plagiarism_text
      end

      should "update nested feedback attributes if present" do
        feedback = create(:comprehension_feedback, rule: @rule)
        new_text = 'new text for the feedbacks object'
        patch :update, id: @rule.id, rule: { feedbacks_attributes: [{id: feedback.id, text: new_text}]}

        assert_equal 204, response.code.to_i
        assert_equal "", response.body

        feedback.reload
        assert_equal feedback.text, new_text
      end

      should "update nested highlight attributes in feedback if present" do
        feedback = create(:comprehension_feedback, rule: @rule)
        highlight = create(:comprehension_highlight, feedback: feedback)
        new_text = "New text to highlight"

        post :update, id: @rule.id, rule: { feedbacks_attributes: [{id: feedback.id, highlights_attributes: [{id: highlight.id, text: new_text}]}]}

        assert_equal 204, response.code.to_i
        assert_equal "", response.body

        highlight.reload
        assert_equal new_text, highlight.text
      end

      should "update nested regex rule attributes if present" do
        regex_rule = create(:comprehension_regex_rule, rule: @rule)
        new_text = "new regex text"

        post :update, id: @rule.id, rule: { regex_rules_attributes: [{id: regex_rule.id, regex_text: new_text}]}

        assert_equal 204, response.code.to_i
        assert_equal "", response.body

        regex_rule.reload
        assert_equal new_text, regex_rule.regex_text
      end

      should "return an error if regex is invalid" do
        regex_rule = create(:comprehension_regex_rule, rule: @rule)
        new_text = "(invalid|"

        post :update, id: @rule.id, rule: { regex_rules_attributes: [{id: regex_rule.id, regex_text: new_text}]}

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['errors'][0].include?("Invalid regex")
      end

    end

    context 'destroy' do
      setup do
        @rule = create(:comprehension_rule)
      end

      should "destroy record at id" do
        delete :destroy, id: @rule.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @rule.id # still in test memory
        assert_nil Rule.find_by_id(@rule.id) # not in DB.
      end
    end
  end
end
