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
      context 'filters' do
        setup do
          user = create(:user)
          @feedback_history1 = create(:feedback_history)
          feedback_history_rating1 = create(:feedback_history_rating, user_id: user.id, feedback_history_id: @feedback_history1.id, rating: true)
          @feedback_history2 = create(:feedback_history)
          feedback_history_rating2 = create(:feedback_history_rating, user_id: user.id, feedback_history_id: @feedback_history2.id, rating: nil)
          @feedback_history3 = create(:feedback_history)
          feedback_history_rating3 = create(:feedback_history_rating, user_id: user.id, feedback_history_id: @feedback_history3.id, rating: false)
        end

        it 'should retrieve all sessions when filter_type is all' do
          get :index, filter_type: "all"

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(3)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history3.feedback_session_uid)
          expect(parsed_response['activity_sessions'][1]['session_uid']).to eq(@feedback_history2.feedback_session_uid)
          expect(parsed_response['activity_sessions'][2]['session_uid']).to eq(@feedback_history1.feedback_session_uid)
        end

        it 'should retrieve only scored sessions when filter_type is scored' do
          get :index, filter_type: "scored"

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(2)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history3.feedback_session_uid)
          expect(parsed_response['activity_sessions'][1]['session_uid']).to eq(@feedback_history1.feedback_session_uid)
        end

        it 'should retrieve only unscored sessions when filter_type is unscored' do
          get :index, filter_type: "unscored"

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history2.feedback_session_uid)
        end

        it 'should retrieve only weak sessions when filter_type is weak' do
          get :index, filter_type: "weak"

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history3.feedback_session_uid)
        end

        it 'should retrieve only incomplete sessions when filter_type is incomplete' do
          get :index, filter_type: "incomplete"

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(3)
        end

        it 'should retrieve only complete sessions when filter_type is complete' do
          activity = Comprehension::Activity.create!(notes: 'Title 1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
          because_prompt = Comprehension::Prompt.create!(activity: activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          but_prompt = Comprehension::Prompt.create!(activity: activity, conjunction: 'but', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          so_prompt = Comprehension::Prompt.create!(activity: activity, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          activity_session = create(:activity_session)
          feedback_history3 = create(:feedback_history, feedback_session_uid: activity_session.uid, prompt: because_prompt, optimal: true)
          feedback_history4 = create(:feedback_history, feedback_session_uid: activity_session.uid, prompt: but_prompt, optimal: true)
          feedback_history5 = create(:feedback_history, feedback_session_uid: activity_session.uid, prompt: so_prompt, optimal: true)

          get :index, filter_type: "complete"

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
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
