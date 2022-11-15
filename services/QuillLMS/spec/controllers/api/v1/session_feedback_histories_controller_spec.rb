# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::SessionFeedbackHistoriesController, type: :controller do
  context "index" do
    it "should return successfully - no history" do
      get :index, as: :json

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

        get :index, as: :json

        parsed_response = JSON.parse(response.body)

        expect(response).to have_http_status(200)
        expect(parsed_response['activity_sessions'].length).to eq(2)
      end

      context 'pagination' do
        before do
          stub_const('FeedbackHistory::DEFAULT_PAGE_SIZE', 2)
          create_list(:feedback_history, 3)
        end

        it "should return 2 records at a time" do
          get :index, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(2)
        end

        it "should skip pages if specified" do
          get :index, params: { page: 2 }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
        end
      end

      context 'activity_id' do
        before do
          @activity = Evidence::Activity.create!(notes: 'Title 1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
          @prompt = Evidence::Prompt.create!(activity: @activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          create_list(:feedback_history, 10, prompt: @prompt)
          create_list(:feedback_history, 10)
        end

        it 'should retrieve only items from the specified activity' do
          get :index, params: { activity_id: @activity.id }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(10)
        end

        it 'should retrieve all items if no activity_id is specified' do
          get :index, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(20)

        end
      end

      context 'start_date, end_date' do
        before do
          create(:feedback_history, created_at: '2021-04-05T20:43:27.698Z')
          create(:feedback_history, created_at: '2021-04-06T20:43:27.698Z')
          create(:feedback_history, created_at: '2021-04-07T20:43:27.698Z')
          create(:feedback_history, created_at: '2021-04-08T20:43:27.698Z')
          create(:feedback_history, created_at: '2021-04-09T20:43:27.698Z')
        end

        it 'should retrieve only items from the specified start_date' do
          get :index, params: { start_date: '2021-04-06T20:43:27.698Z' }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(4)
        end

        it 'should retrieve only items from the specified start_date and end_date' do
          get :index, params: { start_date: '2021-04-06T20:43:27.698Z', end_date: '2021-04-08T20:43:27.698Z' }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(3)

        end
      end

      context 'filters' do
        before do
          user = create(:user)
          @feedback_history1 = create(:feedback_history)
          feedback_history_rating1 = create(:feedback_history_rating, user_id: user.id, feedback_history_id: @feedback_history1.id, rating: true)
          @feedback_history2 = create(:feedback_history)
          feedback_history_rating2 = create(:feedback_history_rating, user_id: user.id, feedback_history_id: @feedback_history2.id, rating: nil)
          @feedback_history3 = create(:feedback_history)
          feedback_history_rating3 = create(:feedback_history_rating, user_id: user.id, feedback_history_id: @feedback_history3.id, rating: false)
        end

        it 'should retrieve all sessions when filter_type is all' do
          get :index, params: { filter_type: "all" }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(3)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history3.feedback_session_uid)
          expect(parsed_response['activity_sessions'][1]['session_uid']).to eq(@feedback_history2.feedback_session_uid)
          expect(parsed_response['activity_sessions'][2]['session_uid']).to eq(@feedback_history1.feedback_session_uid)
        end

        it 'should retrieve only scored sessions when filter_type is scored' do
          get :index, params: { filter_type: "scored" }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(2)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history3.feedback_session_uid)
          expect(parsed_response['activity_sessions'][1]['session_uid']).to eq(@feedback_history1.feedback_session_uid)
        end

        it 'should retrieve only unscored sessions when filter_type is unscored' do
          get :index, params: { filter_type: "unscored" }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history2.feedback_session_uid)
        end

        it 'should retrieve only weak sessions when filter_type is weak' do
          get :index, params: { filter_type: "weak" }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
          expect(parsed_response['activity_sessions'][0]['session_uid']).to eq(@feedback_history3.feedback_session_uid)
        end

        it 'should retrieve only incomplete sessions when filter_type is incomplete' do
          get :index, params: { filter_type: "incomplete" }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(3)
        end

        it 'should retrieve only complete sessions when filter_type is complete' do
          activity = Evidence::Activity.create!(notes: 'Title 1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
          because_prompt = Evidence::Prompt.create!(activity: activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          but_prompt = Evidence::Prompt.create!(activity: activity, conjunction: 'but', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          so_prompt = Evidence::Prompt.create!(activity: activity, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
          activity_session = create(:activity_session)
          feedback_history3 = create(:feedback_history, feedback_session_uid: activity_session.uid, prompt: because_prompt, optimal: true)
          feedback_history4 = create(:feedback_history, feedback_session_uid: activity_session.uid, prompt: but_prompt, optimal: true)
          feedback_history5 = create(:feedback_history, feedback_session_uid: activity_session.uid, prompt: so_prompt, optimal: true)

          get :index, params: { filter_type: "complete" }, as: :json

          parsed_response = JSON.parse(response.body)

          expect(response).to have_http_status(200)
          expect(parsed_response['activity_sessions'].length).to eq(1)
        end
      end
    end
  end

  context "show" do
    before { @feedback_history = create(:feedback_history, entry: 'This is the first entry in history') }

    it "should return json if found" do
      get :show, params: { id: @feedback_history.feedback_session_uid }, as: :json

      parsed_response = JSON.parse(response.body)

      expect(response.code.to_i).to eq(200)
      expect(parsed_response.to_json).to eq(FeedbackHistory.serialize_detail_by_activity_session(@feedback_history.feedback_session_uid).to_json)
    end

    it "should raise if not found (to be handled by parent app)" do
      get :show, params: { id: 99999 }, as: :json
      expect(response.status).to eq(404)
      expect(response.body.include?("The resource you were looking for does not exist")).to be
    end
  end

  context "session_data_for_csv" do
    before do
      user = create(:user)
      @activity = Evidence::Activity.create!(notes: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
      @because_prompt = Evidence::Prompt.create!(activity: @activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      @but_prompt = Evidence::Prompt.create!(activity: @activity, conjunction: 'but', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      @so_prompt = Evidence::Prompt.create!(activity: @activity, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      @activity_session1_uid = SecureRandom.uuid
      @activity_session2_uid = SecureRandom.uuid
      @feedback_history1 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, created_at: '2021-04-05T20:43:27.698Z', prompt_id: @because_prompt.id)
      @feedback_history2 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, created_at: '2021-04-06T20:43:27.698Z', prompt_id: @because_prompt.id)
      @feedback_history3 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, created_at: '2021-04-07T20:43:27.698Z', prompt_id: @but_prompt.id)
      @feedback_history4 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, created_at: '2021-04-08T20:43:27.698Z', prompt_id: @but_prompt.id)
      @feedback_history5 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, created_at: '2021-04-09T20:43:27.698Z', prompt_id: @so_prompt.id)
      @feedback_history6 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, created_at: '2021-04-10T20:43:27.698Z', prompt_id: @so_prompt.id)
      @feedback_history7 = create(:feedback_history, feedback_session_uid: @activity_session2_uid, created_at: '2021-04-11T20:43:27.698Z', prompt_id: @because_prompt.id)
    end

    it 'should retrieve all feedback histories with no filters' do
      get :session_data_for_csv, params: { activity_id: @activity.id }, as: :json

      parsed_response = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(parsed_response.length).to eq(7)
      expect(parsed_response[0]).to eq(@feedback_history7)
      expect(parsed_response[1]).to eq(@feedback_history6)
      expect(parsed_response[2]).to eq(@feedback_history5)
      expect(parsed_response[3]).to eq(@feedback_history4)
      expect(parsed_response[4]).to eq(@feedback_history3)
      expect(parsed_response[5]).to eq(@feedback_history2)
      expect(parsed_response[6]).to eq(@feedback_history1)
    end

    it 'should retrieve all feedback histories between date params' do
      get :session_data_for_csv, params: { activity_id: @activity.id, start_date: '2021-04-06T20:43:27.698Z', end_date: '2021-04-08T20:43:27.698Z' }, as: :json

      parsed_response = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(parsed_response.length).to eq(3)
      expect(parsed_response[0]).to eq(@feedback_history4)
      expect(parsed_response[1]).to eq(@feedback_history3)
      expect(parsed_response[2]).to eq(@feedback_history2)
    end

    it 'should retrieve all feedback histories qualifying for scoring' do
      get :session_data_for_csv, params: { activity_id: @activity.id, responses_for_scoring: true }, as: :json

      parsed_response = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(parsed_response.length).to eq(6)
      expect(parsed_response[0]).to eq(@feedback_history6)
      expect(parsed_response[1]).to eq(@feedback_history5)
      expect(parsed_response[2]).to eq(@feedback_history4)
      expect(parsed_response[0]).to eq(@feedback_history3)
      expect(parsed_response[1]).to eq(@feedback_history2)
      expect(parsed_response[2]).to eq(@feedback_history1)
    end
  end
end
