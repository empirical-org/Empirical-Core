require 'test_helper'

module Comprehension
  class RulesControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
      should "return successfully - no rule" do
        rule_set = create(:comprehension_rule_set)
        activity = rule_set.activity
        get :index, activity_id: activity.id, rule_set_id: rule_set.id

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with rules' do
        setup do
          @rule = create(:comprehension_rule)
          @rule_set = @rule.rule_set
          @activity = @rule_set.activity
        end

        should "return successfully" do
          get :index, activity_id: @activity.id, rule_set_id: @rule_set.id

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?
      
          assert_equal @rule.rule_set_id, parsed_response.first['rule_set_id']
          assert_equal @rule.regex_text, parsed_response.first['regex_text']
          assert_equal @rule.case_sensitive, parsed_response.first['case_sensitive']
        end
      end
    end

    context "create" do
      setup do
        @rule = build(:comprehension_rule)
        @rule_set = create(:comprehension_rule_set)
        @activity = @rule_set.activity
      end

      should "create a valid record and return it as json" do
        post :create, activity_id: @activity.id, rule_set_id: @rule_set.id, rule: { case_sensitive: @rule.case_sensitive, regex_text: @rule.regex_text, rule_set_id: @rule.rule_set_id }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal @rule_set.id, parsed_response['rule_set_id']
        assert_equal @rule.regex_text, parsed_response['regex_text']
        assert_equal @rule.case_sensitive, parsed_response['case_sensitive']
        assert_equal 1, Rule.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, activity_id: @activity.id, rule_set_id: @rule_set.id, rule: { regex_text: 'x' * 201 }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['regex_text'].include?("is too long (maximum is 200 characters)")
        assert_equal 0, Rule.count
      end
    end

    context "show" do
      setup do
        @rule = create(:comprehension_rule)
        @rule_set = @rule.rule_set
        @activity = @rule_set.activity
      end

      should "return json if found" do
        get :show, activity_id: @activity.id, rule_set_id: @rule_set.id, id: @rule.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
        assert_equal @rule.rule_set_id, parsed_response['rule_set_id']
        assert_equal @rule.regex_text, parsed_response['regex_text']
        assert_equal @rule.case_sensitive, parsed_response['case_sensitive']
      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, activity_id: @activity.id, rule_set_id: @rule_set.id, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @rule = create(:comprehension_rule)
        @rule_set = @rule.rule_set
        @activity = @rule_set.activity
      end

      should "update record if valid, return nothing" do
        patch :update, activity_id: @activity.id, rule_set_id: @rule_set.id, id: @rule.id, rule: { case_sensitive: false, regex_text: 'Updated text' }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @rule.reload
    
        assert_equal 'Updated text', @rule.regex_text
        assert_equal false, @rule.case_sensitive
      end

      should "not update record and return errors as json" do
        patch :update, activity_id: @activity.id, rule_set_id: @rule_set.id, id: @rule.id, rule: { case_sensitive: nil, regex_text: 'x' * 201 }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['regex_text'].include?("is too long (maximum is 200 characters)")
        assert parsed_response['case_sensitive'].include?("is not included in the list")
      end
    end

    context 'destroy' do
      setup do
        @rule = create(:comprehension_rule)
        @rule_set = @rule.rule_set
        @activity = @rule_set.activity
      end

      should "destroy record at id" do
        delete :destroy, activity_id: @activity.id, rule_set_id: @rule_set.id, id: @rule.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @rule.id # still in test memory
        assert_nil Rule.find_by_id(@rule.id) # not in DB.
      end
    end
  end
end
