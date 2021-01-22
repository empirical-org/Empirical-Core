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

        post :create, rule: { concept_uid: @rule.concept_uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: @rule.suborder, rule_type: @rule.rule_type, universal: @rule.universal }

        parsed_response = JSON.parse(response.body)
        assert_equal 201, response.code.to_i

        assert_equal @rule.name, parsed_response['name']

        assert_equal @rule.description, parsed_response['description']

        assert_equal @rule.universal, parsed_response['universal']

        assert_equal @rule.rule_type, parsed_response['rule_type']

        assert_equal @rule.optimal, parsed_response['optimal']

        assert_equal @rule.suborder, parsed_response['suborder']

        assert_equal @rule.concept_uid, parsed_response['concept_uid']

        assert_equal 1, Rule.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, rule: { concept_uid: @rule.uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: -1, rule_type: @rule.rule_type, universal: @rule.universal }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['suborder'].include?("must be greater than or equal to 0")
        assert_equal 0, Rule.count
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
        @rule = create(:comprehension_rule)
      end

      should "update record if valid, return nothing" do
        patch :update, id: @rule.id, rule: { concept_uid: @rule.concept_uid, description: @rule.description, name: @rule.name, optimal: @rule.optimal, suborder: @rule.suborder, rule_type: @rule.rule_type, universal: @rule.universal }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

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
