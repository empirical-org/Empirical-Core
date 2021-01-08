require 'rails_helper'

describe Api::V1::FeedbackHistoriesController, type: :controller do
  context "index" do
    it "should return successfully - no history" do
      get :index

      parsed_response = JSON.parse(response.body)['feedback_histories']

      assert_response :success
      assert_equal Array, parsed_response.class
      assert parsed_response.empty?
    end

    context 'with feedback_history' do
      setup do
        create(:feedback_history, entry: 'This is the first entry in history')
        create(:feedback_history, entry: 'This is the second entry in history')
      end

      it "should return successfully" do
        get :index

        parsed_response = JSON.parse(response.body)['feedback_histories']

        assert_response :success
        assert_equal Array, parsed_response.class
        refute parsed_response.empty?

        assert_equal "This is the first entry in history", parsed_response.first['entry']
        assert_equal "This is the second entry in history", parsed_response.last['entry']
      end
    end
  end

  context "create" do
    it "should create a valid record and return it as json" do
      post :create, feedback_history: { activity_session_uid: '1', attempt: 1, optimal: false, used: true,
                                        time: DateTime.now, entry: 'This is the entry provided by the student',
                                        feedback_text: 'This is the feedback provided by the algorithm',
                                        feedback_type: 'semantic', metadata: {foo: 'bar'} }

      parsed_response = JSON.parse(response.body)

      assert_equal 201, response.code.to_i
      assert_equal "This is the entry provided by the student", parsed_response['entry']
      assert_equal 1, FeedbackHistory.count
    end

    it "should set prompt_type to Comprehension::Prompt if prompt_id is provided" do
      activity = Comprehension::Activity.create(target_level: 1, title: 'Test Activity Title')
      prompt = Comprehension::Prompt.create(activity: activity, text: 'Test prompt text', conjunction: 'but')
      post :create, feedback_history: { activity_session_uid: '1', attempt: 1, optimal: false, used: true,
                                        time: DateTime.now, entry: 'This is the entry provided by the student',
                                        feedback_text: 'This is the feedback provided by the algorithm',
                                        feedback_type: 'semantic', metadata: {foo: 'bar'}, prompt_id: prompt.id }

      parsed_response = JSON.parse(response.body)

      assert_equal 201, response.code.to_i
      assert_equal 1, FeedbackHistory.count
      assert_equal "Comprehension::Prompt", FeedbackHistory.find(parsed_response['id']).prompt_type
    end

    it "should not create an invalid record and return errors as json" do
      post :create, feedback_history: { entry: nil }

      parsed_response = JSON.parse(response.body)

      assert_equal 422, response.code.to_i
      assert parsed_response['entry'].include?("can't be blank")
      assert_equal 0, Activity.count
    end
  end

  context "batch" do
    it "should create valid records and return them as json" do
      post :batch, feedback_histories: [{ activity_session_uid: '1', attempt: 1, optimal: false, used: true,
                                          time: DateTime.now, entry: 'This is the entry provided by the student',
                                          feedback_text: 'This is the feedback provided by the algorithm',
                                          feedback_type: 'semantic', metadata: {foo: 'bar'} },
                                        { activity_session_uid: '1', attempt: 1, optimal: false, used: true,
                                          time: DateTime.now, entry: 'This is the entry provided by the student',
                                          feedback_text: 'This is the feedback provided by the algorithm',
                                          feedback_type: 'semantic', metadata: {foo: 'bar'} }]

      assert_equal 201, response.code.to_i
      assert_equal 2, FeedbackHistory.count
    end

    it "should not create valid records if one is invalid record but return errors as json" do
      post :batch, feedback_histories: [{ activity_session_uid: '1', attempt: 1, optimal: false, used: true,
                                          time: DateTime.now, entry: 'This is the entry provided by the student',
                                          feedback_text: 'This is the feedback provided by the algorithm',
                                          feedback_type: 'semantic', metadata: {foo: 'bar'} },
                                        { attempt: 1, optimal: false, used: true,
                                          time: DateTime.now, entry: 'This is the entry provided by the student',
                                          feedback_text: 'This is the feedback provided by the algorithm',
                                          feedback_type: 'semantic', metadata: {foo: 'bar'} }]

      parsed_response = JSON.parse(response.body)

      assert_equal 422, response.code.to_i
      assert_equal parsed_response['feedback_histories'][0], {}
      assert parsed_response['feedback_histories'][1]['activity_session_uid'].include?("can't be blank")
      assert_equal 1, FeedbackHistory.count
    end

  end

  context "show" do
    setup do
      @feedback_history = create(:feedback_history, entry: 'This is the first entry in history')
    end

    it "should return json if found" do
      get :show, id: @feedback_history.id

      parsed_response = JSON.parse(response.body)

      assert_equal 200, response.code.to_i
      assert_equal "This is the first entry in history", parsed_response['entry']
    end

    it "should raise if not found (to be handled by parent app)" do
      get :show, id: 99999
      assert_equal 404, response.status
      assert response.body.include?("The resource you were looking for does not exist")
    end

    it "should attach include prompt model if attached" do
      activity = Comprehension::Activity.create(target_level: 1, title: 'Test Activity Title')
      prompt = Comprehension::Prompt.create(activity: activity, text: 'Test prompt text', conjunction: 'but')
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
      @feedback_history = create(:feedback_history)
    end

    it "should update record if valid, return nothing" do
      put :update, id: @feedback_history.id, feedback_history: { entry: 'This is the new student entry which is different' }

      assert_equal "", response.body
      assert_equal 204, response.code.to_i

      @feedback_history.reload

      assert_equal "This is the new student entry which is different", @feedback_history.entry
    end

    it "should not update record and return errors as json" do
      put :update, id: @feedback_history.id, feedback_history: { entry: '<5' }

      parsed_response = JSON.parse(response.body)

      assert_equal 422, response.code.to_i
      assert parsed_response['entry'].include?("is too short (minimum is 5 characters)")
    end
  end

  context 'destroy' do
    setup do
      @feedback_history = create(:feedback_history)
    end

    it "should destroy record at id" do
      delete :destroy, id: @feedback_history.id

      assert_equal "", response.body
      assert_equal 204, response.code.to_i
      assert @feedback_history.id # still in test memory
      assert_nil FeedbackHistory.find_by_id(@feedback_history.id) # not in DB.
    end
  end
end
