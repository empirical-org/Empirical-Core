require 'test_helper'

module Comprehension
  class FeedbackHistoriesControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
      should "return successfully - no history" do
        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with feedback_history' do
        setup do
          create(:comprehension_feedback_history, entry: 'This is the first entry in history')
          create(:comprehension_feedback_history, entry: 'This is the second entry in history')
        end

        should "return successfully" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?

          assert_equal "This is the first entry in history", parsed_response.first['entry']
          assert_equal "This is the second entry in history", parsed_response.last['entry']
        end
      end
    end

    context "create" do
      should "create a valid record and return it as json" do
        post :create, feedback_history: { attempt: 1, optimal: false, used: true, time: DateTime.now,
                                          entry: 'This is the entry provided by the student',
                                          feedback_text: 'This is the feedback provided by the algorithm',
                                          feedback_type: 'semantic', metadata: {foo: 'bar'}
                                        }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal "This is the entry provided by the student", parsed_response['entry']
        assert_equal 1, FeedbackHistory.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, feedback_history: { entry: nil }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['entry'].include?("can't be blank")
        assert_equal 0, Activity.count
      end
    end

    context "show" do
      setup do
        @feedback_history = create(:comprehension_feedback_history, entry: 'This is the first entry in history')
      end

      should "return json if found" do
        get :show, id: @feedback_history.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
        assert_equal "This is the first entry in history", parsed_response['entry']
      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, id: 99999
        end
      end

      should "attach include prompt model if attached" do
        prompt = create(:comprehension_prompt)
        @feedback_history.prompt = prompt
        @feedback_history.save

        get :show, id: @feedback_history.id
        
        parsed_response = JSON.parse(response.body)
        
        assert_equal 200, response.code.to_i
        assert_equal prompt.as_json, parsed_response['prompt']
      end
    end

    context "update" do
      setup do
        @feedback_history = create(:comprehension_feedback_history)
      end

      should "update record if valid, return nothing" do
        put :update, id: @feedback_history.id, feedback_history: { entry: 'This is the new student entry which is different' }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @feedback_history.reload

        assert_equal "This is the new student entry which is different", @feedback_history.entry
      end

      should "not update record and return errors as json" do
        put :update, id: @feedback_history.id, feedback_history: { entry: 'Too short' }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['entry'].include?("is too short (minimum is 25 characters)")
      end
    end

    context 'destroy' do
      setup do
        @feedback_history = create(:comprehension_feedback_history)
      end

      should "destroy record at id" do
        delete :destroy, id: @feedback_history.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @feedback_history.id # still in test memory
        assert_nil FeedbackHistory.find_by_id(@feedback_history.id) # not in DB.
      end
    end
  end
end
