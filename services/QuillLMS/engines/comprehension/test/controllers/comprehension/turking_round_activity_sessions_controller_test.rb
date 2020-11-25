require 'test_helper'

module Comprehension
  class TurkingRoundActivitySessionsControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
     should "return successfully - no turking_round_activity_session" do
        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with turking_round_activity_sessions' do
        setup do
          @turking_round_activity_session = create(:comprehension_turking_round_activity_session)
        end

        should "return successfully" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?
      
        end
      end
    end

    context "create" do
      setup do
        @turking_round_activity_session = build(:comprehension_turking_round_activity_session)
      end

      should "create a valid record and return it as json" do
        turking_round = create(:comprehension_turking_round)
        post :create, turking_round_activity_session: { turking_round_id: turking_round.id, activity_session_uid: SecureRandom.uuid }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
    
        assert_equal 1, TurkingRoundActivitySession.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, turking_round_activity_session: { activity_session_uid: nil }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['activity_session_uid'].include?("can't be blank")
        assert_equal 0, TurkingRoundActivitySession.count
      end
    end

    context "show" do
      setup do
        @turking_round_activity_session = create(:comprehension_turking_round_activity_session)
      end

      should "return json if found" do
        get :show, id: @turking_round_activity_session.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
    
      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @turking_round_activity_session = create(:comprehension_turking_round_activity_session)
      end

      should "update record if valid, return nothing" do
        new_session_uid = SecureRandom.uuid
        patch :update, id: @turking_round_activity_session.id, turking_round_activity_session: { activity_session_uid: new_session_uid }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @turking_round_activity_session.reload
        assert_equal @turking_round_activity_session.activity_session_uid, new_session_uid
      end

      should "not update record and return errors as json" do
        patch :update, id: @turking_round_activity_session.id, turking_round_activity_session: { activity_session_uid: nil }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['activity_session_uid'].include?("can't be blank")
      end
    end

    context 'destroy' do
      setup do
        @turking_round_activity_session = create(:comprehension_turking_round_activity_session)
      end

      should "destroy record at id" do
        delete :destroy, id: @turking_round_activity_session.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @turking_round_activity_session.id # still in test memory
        assert_nil TurkingRoundActivitySession.find_by_id(@turking_round_activity_session.id) # not in DB.
      end
    end
  end
end
