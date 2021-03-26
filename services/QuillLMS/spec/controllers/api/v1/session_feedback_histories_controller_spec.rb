require 'rails_helper'

describe Api::V1::SessionFeedbackHistoriesController, type: :controller do
  context "index" do
    it "should return successfully - no history" do
      get :index

      parsed_response = JSON.parse(response.body)

      assert_response :success
      assert_equal parsed_response, {
        total_pages: 0,
        total_activity_sessions: 0,
        current_page: 1,
        activity_sessions: []
      }.stringify_keys
    end

    context 'with feedback_history' do
      it "should return successfully" do
        create(:feedback_history, entry: 'This is the first entry in history')
        create(:feedback_history, entry: 'This is the second entry in history')

        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal parsed_response['activity_sessions'].length, 2
      end

      context 'pagination' do
        setup do
          30.times { create(:feedback_history) }
        end

        it "should return 25 records at a tine" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal parsed_response['activity_sessions'].length, 25
        end

        it "should skip pages if specified" do
          get :index, page: 2

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal parsed_response['activity_sessions'].length, 5
        end
      end

      context 'activity_id' do
        setup do
          @activity = Comprehension::Activity.create!(name: 'Title 1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
          @prompt = Comprehension::Prompt.create!(activity: @activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          10.times { create(:feedback_history, prompt: @prompt) }
          10.times { create(:feedback_history) }
        end

        it 'should retrieve only items from the specified activity' do
          get :index, activity_id: @activity.id

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal parsed_response['activity_sessions'].length, 10
        end

        it 'should retrieve all items if no activity_id is specified' do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal parsed_response['activity_sessions'].length, 20

        end
      end
    end
  end

  context "show" do
    setup do
      @feedback_history = create(:feedback_history, entry: 'This is the first entry in history')
    end

    it "should return json if found" do
      get :show, id: @feedback_history.activity_session_uid

      parsed_response = JSON.parse(response.body)

      assert_equal 200, response.code.to_i
      assert_equal parsed_response, SessionFeedbackHistory.serialize_detail_by_activity_session(@feedback_history.activity_session_uid).stringify_keys
    end

    it "should raise if not found (to be handled by parent app)" do
      get :show, id: 99999
      assert_equal 404, response.status
      assert response.body.include?("The resource you were looking for does not exist")
    end
  end
end
