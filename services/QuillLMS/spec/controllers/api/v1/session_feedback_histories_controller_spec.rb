require 'rails_helper'

describe Api::V1::SessionFeedbackHistoriesController, type: :controller do
  context "index" do
    it "should return successfully - no history" do
      get :index

      parsed_response = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(parsed_response).to eq({
        total_pages: 0,
        total_activity_sessions: 0,
        current_page: 1,
        activity_sessions: []
      }.stringify_keys)
    end

    context 'with feedback_history' do
      it "should return successfully" do
        create(:feedback_history, entry: 'This is the first entry in history')
        create(:feedback_history, entry: 'This is the second entry in history')

        get :index

        parsed_response = JSON.parse(response.body)

        expect(response).to have_http_status(200)
        expect(parsed_response['activity_sessions'].length).to eq(2)
      end

      context 'pagination' do
        setup do
          stub_const('FeedbackHistory::DEFAULT_PAGE_SIZE', 2)
          3.times { create(:feedback_history) }
        end

        it "should return 2 records at a time" do
          get :index

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(2)
        end

        it "should skip pages if specified" do
          get :index, params: { page: 2 }

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
        end
      end

      context 'activity_id' do
        setup do
          @activity = Comprehension::Activity.create!(notes: 'Title 1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
          @prompt = Comprehension::Prompt.create!(activity: @activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          10.times { create(:feedback_history, prompt: @prompt) }
          10.times { create(:feedback_history) }
        end

        it 'should retrieve only items from the specified activity' do
          get :index, params: { activity_id: @activity.id }

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(10)
        end

        it 'should retrieve all items if no activity_id is specified' do
          get :index

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(20)

        end
      end

      context 'start_date, end_date' do
        setup do
          create(:feedback_history, created_at: '2021-04-05T20:43:27.698Z')
          create(:feedback_history, created_at: '2021-04-06T20:43:27.698Z')
          create(:feedback_history, created_at: '2021-04-07T20:43:27.698Z')
          create(:feedback_history, created_at: '2021-04-08T20:43:27.698Z')
          create(:feedback_history, created_at: '2021-04-09T20:43:27.698Z')
        end

        it 'should retrieve only items from the specified time constraints' do
          get :index, params: { start_date: '2021-04-06T20:43:27.698Z' }

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(4)
        end

        it 'should retrieve only items from the specified time constraints' do
          get :index, params: { start_date: '2021-04-06T20:43:27.698Z', end_date: '2021-04-08T20:43:27.698Z' }

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(3)

        end
      end
      context 'turk_session_uid' do
        setup do
          @activity_session = create(:activity_session)
          @comprehension_turking_round = create(:comprehension_turking_round_activity_session, activity_session_uid: @activity_session.uid)
          @feedback_history1 = create(:feedback_history, feedback_session_uid: @activity_session.uid)
          @feedback_history2 = create(:feedback_history, feedback_session_uid: "def")
          @feedback_history3 = create(:feedback_history, feedback_session_uid: "ghi")
        end

        it 'should retrieve only items with the specified turk_session_uid' do
          get :index, params: { turk_session_id: @comprehension_turking_round.turking_round_id }

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history1.feedback_session_uid)
        end
      end
    end
  end

  context "show" do
    setup do
      @feedback_history = create(:feedback_history, entry: 'This is the first entry in history')
    end

    it "should return json if found" do
      get :show, params: { id: @feedback_history.feedback_session_uid }

      parsed_response = JSON.parse(response.body)

      expect(200).to eq(response.code.to_i)
      expect(parsed_response.to_json).to eq(FeedbackHistory.serialize_detail_by_activity_session(@feedback_history.feedback_session_uid).to_json)
    end

    it "should raise if not found (to be handled by parent app)" do
      get :show, params: { id: 99999 }
      expect(404).to eq(response.status)
      expect(response.body.include?("The resource you were looking for does not exist")).to be
    end
  end
end
