require 'test_helper'

module Comprehension
  class RuleSetsControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
      should "return successfully - no rule_set" do
        activity = create(:comprehension_activity)
        get :index, activity_id: activity.id

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with rule_sets' do
        setup do
          @rule_set = create(:comprehension_rule_set)
        end

        should "return successfully" do
          get :index, activity_id: @rule_set.activity_id

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?
      
          assert_equal @rule_set.activity_id, parsed_response.first['activity_id']
          assert_equal @rule_set.prompts, parsed_response.first['prompts']
          assert_equal @rule_set.name, parsed_response.first['name']
          assert_equal @rule_set.feedback, parsed_response.first['feedback']
          assert_equal @rule_set.priority, parsed_response.first['priority']
        end
      end
    end

    context "create" do
      setup do
        @activity = create(:comprehension_activity)
        @rule_set = build(:comprehension_rule_set, activity: @activity)
      end

      should "create a valid record and return it as json" do
        post :create, activity_id: @activity.id, rule_set: { feedback: @rule_set.feedback, name: @rule_set.name, priority: @rule_set.priority, prompts: @rule_set.prompts }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
	assert_equal @activity.id, parsed_response['activity_id']
        assert_equal @rule_set.prompts, parsed_response['prompts']
        assert_equal @rule_set.name, parsed_response['name']
        assert_equal @rule_set.feedback, parsed_response['feedback']
        assert_equal @rule_set.priority, parsed_response['priority']
        assert_equal 1, RuleSet.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, activity_id: @rule_set.activity_id, rule_set: { feedback: 'x' * 501, name: 'x' * 101, priority: 1.5 }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['name'].include?("is too long (maximum is 100 characters)")
        assert parsed_response['feedback'].include?("is too long (maximum is 500 characters)")
        assert parsed_response['priority'].include?("must be an integer")
        assert_equal 0, RuleSet.count
      end
    end

    context "show" do
      setup do
        @rule_set = create(:comprehension_rule_set)
        @rule = create(:comprehension_rule, rule_set: @rule_set)
      end

      should "return json if found" do
        get :show, activity_id: @rule_set.activity_id, id: @rule_set.id

        assert_equal 200, response.code.to_i

        parsed_response = JSON.parse(response.body)
    
        assert_equal @rule_set.prompts, parsed_response['prompts']
        assert_equal @rule_set.name, parsed_response['name']
        assert_equal @rule_set.feedback, parsed_response['feedback']
        assert_equal @rule_set.priority, parsed_response['priority']

        rule_response = parsed_response['rules'].first

        assert_equal @rule.id, rule_response['id']
        assert_equal @rule.regex_text, rule_response['regex_text']
        assert_equal @rule.case_sensitive, rule_response['case_sensitive']
      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, activity_id: @rule_set.activity_id, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @prompt = create(:comprehension_prompt)
        @rule_set = create(:comprehension_rule_set, activity: @prompt.activity)
        @rule = create(:comprehension_rule, rule_set: @rule_set)
      end

      should "update record if valid, return nothing" do
        patch :update, activity_id: @rule_set.activity_id, id: @rule_set.id, rule_set: { feedback: 'Updated feedback', name: 'Updated name', priority: 100, prompt_ids: [@prompt.id] }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @rule_set.reload
    
        assert_equal [@prompt], @rule_set.prompts
        assert_equal "Updated name", @rule_set.name
        assert_equal "Updated feedback", @rule_set.feedback
        assert_equal 100, @rule_set.priority
      end

      should "update rule if valid, return nothing" do
        patch :update, activity_id: @rule_set.activity_id, id: @rule_set.id, rule_set: { rules_attributes: [{id: @rule.id, regex_text: 'Some updated text', case_sensitive: true}] }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @rule.reload

        assert_equal 'Some updated text', @rule.regex_text
        assert_equal true, @rule.case_sensitive
      end

      should "not update record and return errors as json" do
        patch :update, activity_id: @rule_set.activity_id, id: @rule_set.id, rule_set: { feedback: 'x' * 501, name: 'x' * 101, priority: 1.5, prompts: @rule_set.prompts }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['name'].include?("is too long (maximum is 100 characters)")
        assert parsed_response['feedback'].include?("is too long (maximum is 500 characters)")
        assert parsed_response['priority'].include?("must be an integer")
      end
    end

    context 'destroy' do
      setup do
        @rule_set = create(:comprehension_rule_set)
      end

      should "destroy record at id" do
        delete :destroy, activity_id: @rule_set.activity_id, id: @rule_set.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @rule_set.id # still in test memory
        assert_nil RuleSet.find_by_id(@rule_set.id) # not in DB.
      end
    end
  end
end
