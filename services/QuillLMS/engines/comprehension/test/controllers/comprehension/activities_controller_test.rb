require 'test_helper'

module Comprehension
  class ActivitiesControllerTest < ActionController::TestCase
    include FactoryBot::Syntax::Methods
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
          create(:comprehension_activity, quill_activity_id: 1, title: "First Activity", target_level: 8)
          create(:comprehension_activity, quill_activity_id: 2, title: "Second Activity",
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
          assert_equal  8, parsed_response.first['target_level']
        end
      end
    end

    context "create" do
      setup do
        @activity = build(:comprehension_activity, quill_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
      end

      should "create a valid record and return it as json" do
        post :create, activity: { quill_activity_id: @activity.quill_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal 1, Activity.count
      end


      should "not create an invalid record and return errors as json" do
        post :create, activity: { quill_activity_id: @activity.quill_activity_id }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['title'].include?("can't be blank")
        assert_equal 0, Activity.count
      end
    end


    context "show" do
      setup do
        @activity = create(:comprehension_activity, quill_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
      end

      should "return json if found" do
        get :show, id: @activity.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
      end


      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @activity = create(:comprehension_activity, quill_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
      end

      should "update record if valid, return nothing" do
        put :update, id: @activity.id, activity: { quill_activity_id: 2, scored_level: "5th grade", target_level: 9, title: "New title" }


        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @activity.reload

        assert_equal 2, @activity.quill_activity_id
        assert_equal "5th grade",  @activity.scored_level
        assert_equal 9, @activity.target_level
        assert_equal "New title",  @activity.title
      end

      should "not update record and return errors as json" do
        put :update, id: @activity.id, activity: { quill_activity_id: 2, scored_level: "5th grade", target_level: 99999999, title: "New title" }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['target_level'].include?("must be less than or equal to 12"), "Missing error message in response #{parsed_response['target_level']}"
      end

    end

    # test "should create activity" do
    #   assert_difference('Activity.count') do
    #     post :create, activity: { quill_activity_id: @activity.quill_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title }
    #   end

    #   assert_equal
    # end

    # test "should show activity" do
    #   get :show, id: @activity
    #   assert_response :success
    # end

    # test "should update activity" do
      # patch :update, id: @activity, activity: { quill_activity_id: @activity.quill_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title }
      # assert_redirected_to activity_path(assigns(:activity))
    # end

    # test "should destroy activity" do
    #   assert_difference('Activity.count', -1) do
    #     delete :destroy, id: @activity
    #   end

    #   assert_redirected_to activities_path
    # end
  end
end
