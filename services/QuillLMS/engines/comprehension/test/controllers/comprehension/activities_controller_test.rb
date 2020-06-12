require 'test_helper'

module Comprehension
  class ActivitiesControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
      should "return successfully - no activities" do
        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with actitivites' do
        setup do
          create(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8)
          create(:comprehension_activity, parent_activity_id: 2, title: "Second Activity",
            target_level: 5)
        end

        should "return successfully" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?

          assert_equal  "First Activity", parsed_response.first['title']
          assert_equal  8, parsed_response.first['target_level']
          assert_equal  1, parsed_response.first['parent_activity_id']
        end
      end
    end

    context "create" do
      setup do
        @activity = build(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
      end

      should "create a valid record and return it as json" do
        post :create, activity: { parent_activity_id: @activity.parent_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal 1, Activity.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, activity: { parent_activity_id: @activity.parent_activity_id }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['title'].include?("can't be blank")
        assert_equal 0, Activity.count
      end

      should "create a valid record with passage attributes" do
        post :create, activity: { parent_activity_id: @activity.parent_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title, passages_attributes: [{text: ("Hello " * 20) }] }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal 1, Activity.count
        assert_equal 1, Activity.first.passages.count
        assert_equal ("Hello " * 20), Activity.first.passages.first.text
      end

      should "create a valid record with prompt attributes" do
        post :create, activity: { parent_activity_id: @activity.parent_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title, prompts_attributes: [{text: "meat is bad for you.", conjunction: "because" }] }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal 1, Activity.count
        assert_equal 1, Activity.first.prompts.count
        assert_equal "meat is bad for you.", Activity.first.prompts.first.text
      end
    end

    context "show" do
      setup do
        @activity = create(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
        @passage = create(:comprehension_passage, activity: @activity, text: ('Hello' * 20))
        @prompt = create(:comprehension_prompt, activity: @activity, text: "it is good.")
      end

      should "return json if found" do
        get :show, id: @activity.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal ('Hello' * 20), parsed_response['passages'].first['text']
        assert_equal "it is good.", parsed_response['prompts'].first['text']
      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @activity = create(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
        @passage = create(:comprehension_passage, activity: @activity)
        @prompt = create(:comprehension_prompt, activity: @activity)
      end

      should "update record if valid, return nothing" do
        put :update, id: @activity.id, activity: { parent_activity_id: 2, scored_level: "5th grade", target_level: 9, title: "New title" }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @activity.reload

        assert_equal 2, @activity.parent_activity_id
        assert_equal "5th grade",  @activity.scored_level
        assert_equal 9, @activity.target_level
        assert_equal "New title",  @activity.title
      end

      should "update passage if valid, return nothing" do
        put :update, id: @activity.id, activity: { passages_attributes: [{id: @passage.id, text: ('Goodbye' * 20)}] }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @passage.reload

        assert_equal ('Goodbye' * 20), @passage.text
      end

      should "update prompt if valid, return nothing" do
        put :update, id: @activity.id, activity: { prompts_attributes: [{id: @prompt.id, text: "this is a good thing."}] }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @prompt.reload

        assert_equal "this is a good thing.", @prompt.text
      end


      should "not update record and return errors as json" do
        put :update, id: @activity.id, activity: { parent_activity_id: 2, scored_level: "5th grade", target_level: 99999999, title: "New title" }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['target_level'].include?("must be less than or equal to 12"), "Missing error message in response #{parsed_response['target_level']}"
      end
    end

    context 'destroy' do
      setup do
        @activity = create(:comprehension_activity)
        @passage = create(:comprehension_passage, activity: @activity)
      end

      should "destroy record at id" do
        delete :destroy, id: @activity.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @activity.id # still in test memory
        assert_nil Activity.find_by_id(@activity.id) # not in DB.
        assert @passage.id
        assert_nil Passage.find_by_id(@passage.id)
      end
    end
  end
end
