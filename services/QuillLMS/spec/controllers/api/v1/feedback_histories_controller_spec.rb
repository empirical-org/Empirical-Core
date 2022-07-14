# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::FeedbackHistoriesController, type: :controller do
  context "index" do
    it "should return successfully - no history" do
      get :index, as: :json

      parsed_response = JSON.parse(response.body)['feedback_histories']

      expect(response).to have_http_status(200)
      expect(Array).to eq(parsed_response.class)
      expect(parsed_response.empty?).to be
    end

    context 'with feedback_history' do
      before do
        create(:feedback_history, entry: 'This is the first entry in history')
        create(:feedback_history, entry: 'This is the second entry in history')
      end

      it "should return successfully" do
        get :index, as: :json

        parsed_response = JSON.parse(response.body)['feedback_histories']

        expect(response).to have_http_status(200)
        expect(Array).to eq(parsed_response.class)
        refute parsed_response.empty?

        expect(parsed_response.first['entry']).to eq("This is the first entry in history")
        expect(parsed_response.last['entry']).to eq("This is the second entry in history")
      end
    end
  end

  context "create" do
    it "should create a valid record and return it as json" do
      post :create,
        params: {
          feedback_history: {
            feedback_session_uid: '1',
            attempt: 1,
            optimal: false,
            used: true,
            time: DateTime.current,
            entry: 'This is the entry provided by the student',
            feedback_text: 'This is the feedback provided by the algorithm',
            feedback_type: 'autoML',
            metadata: {
              foo: 'bar'
            }
          }
        },
        as: :json

      parsed_response = JSON.parse(response.body)

      expect(response.code.to_i).to eq(201)
      expect(parsed_response['entry']).to eq("This is the entry provided by the student")
      expect(FeedbackHistory.count).to eq(1)
    end

    it "should populate metadata['highlight']" do
      metadata = {
        "highlight" => [
          { 'text' => 'is',
            'type' => 'response',
            'category' => 'lorem',
            'character' => 40 }
        ]
      }

      post :create,
        params: {
          feedback_history: {
            feedback_session_uid: '1',
            attempt: 1,
            optimal: false,
            used: true,
            time: DateTime.current,
            entry: 'This is the entry provided by the student',
            feedback_text: 'This is the feedback provided by the algorithm',
            feedback_type: 'autoML',
            metadata: metadata
          }
        },
        as: :json

      parsed_response = JSON.parse(response.body)
      expect(parsed_response['metadata']['highlight'].first.keys).to eq metadata['highlight'].first.keys
    end

    it "should set prompt_type to Evidence::Prompt if prompt_id is provided" do
      activity = Evidence::Activity.create(target_level: 1, title: 'Test Activity Title')
      prompt = Evidence::Prompt.create(activity: activity, text: 'Test prompt text', conjunction: 'but')
      post :create,
        params: {
          feedback_history: {
            feedback_session_uid: '1',
            attempt: 1,
            optimal: false,
            used: true,
            time: DateTime.current,
            entry: 'This is the entry provided by the student',
            feedback_text: 'This is the feedback provided by the algorithm',
            feedback_type: 'autoML',
            prompt_id: prompt.id,
            metadata: {
              foo: 'bar'
            }
          },
        },
        as: :json

      parsed_response = JSON.parse(response.body)

      expect(response.code.to_i).to eq(201)
      expect(FeedbackHistory.count).to eq(1)
      expect(FeedbackHistory.find(parsed_response['id']).prompt_type).to eq("Evidence::Prompt")
    end

    it "should not create an invalid record and return errors as json" do
      post :create, params: { feedback_history: { entry: nil } }, as: :json

      parsed_response = JSON.parse(response.body)

      expect(response.code.to_i).to eq(422)
      expect(parsed_response['entry'].include?("can't be blank")).to be
      expect(Activity.count).to eq(0)
    end
  end

  context "show" do
    before { @feedback_history = create(:feedback_history, entry: 'This is the first entry in history') }

    it "should return json if found" do
      get :show, params: { id: @feedback_history.id }, as: :json

      parsed_response = JSON.parse(response.body)

      expect(response.code.to_i).to eq(200)
      expect(parsed_response['entry']).to eq("This is the first entry in history")
    end

    it "should raise if not found (to be handled by parent app)" do
      get :show, params: { id: 99999 }, as: :json
      expect(response.status).to eq(404)
      expect(response.body.include?("The resource you were looking for does not exist")).to be
    end

    it "should attach include prompt model if attached" do
      activity = Evidence::Activity.create(target_level: 1, title: 'Test Activity Title')
      prompt = Evidence::Prompt.create(activity: activity, text: 'Test prompt text', conjunction: 'but')
      feedback_history = build(:feedback_history)
      feedback_history.prompt = prompt
      feedback_history.save

      get :show, params: { id: feedback_history.id }, as: :json

      parsed_response = JSON.parse(response.body)

      expect(response.code.to_i).to eq(200)
      expect(prompt.as_json).to eq(parsed_response['prompt'])
    end
  end
end
