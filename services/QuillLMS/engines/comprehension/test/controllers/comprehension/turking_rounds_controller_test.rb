require 'test_helper'

module Comprehension
  class TurkingRoundsControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
      should "return successfully - no turking_round" do
        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with turking_rounds' do
        setup do
          @turking_round = create(:comprehension_turking_round)
        end

        should "return successfully" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?
          assert_equal @turking_round.activity.id, parsed_response.first['activity_id']
          assert_equal @turking_round.expires_at.iso8601(3), parsed_response.first['expires_at']
          assert_equal @turking_round.uuid, parsed_response.first['uuid']
        end
      end
    end

    context "create" do
      setup do
        @activity = create(:comprehension_activity)
        @turking_round = build(:comprehension_turking_round, activity: @activity)
      end

      should "create a valid record and return it as json" do
        post :create, turking_round: { activity_id: @activity.id, uuid: @turking_round.uuid, expires_at: @turking_round.expires_at.iso8601(3) }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal @turking_round.activity_id, parsed_response['activity_id']
        assert_equal @turking_round.uuid, parsed_response['uuid']
        assert_equal @turking_round.expires_at.iso8601(3), parsed_response['expires_at']
        assert_equal 1, TurkingRound.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, turking_round: { activity_id: nil, expires_at: nil }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['activity_id'].include?("can't be blank")
        assert parsed_response['expires_at'].include?("can't be blank")
        assert_equal 0, TurkingRound.count
      end
    end

    context "show" do
      setup do
        @turking_round = create(:comprehension_turking_round)
      end

      should "return json if found" do
        get :show, id: @turking_round.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
        assert_equal @turking_round.activity.id, parsed_response['activity_id']
        assert_equal @turking_round.uuid, parsed_response['uuid']
        assert_equal @turking_round.expires_at.iso8601(3), parsed_response['expires_at']
      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @turking_round = create(:comprehension_turking_round)
      end

      should "update record if valid, return nothing" do
        new_activity = create(:comprehension_activity)
        new_datetime = DateTime.now.utc
        patch :update, id: @turking_round.id, turking_round: { activity_id: new_activity.id, expires_at: new_datetime }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @turking_round.reload
        assert_equal new_activity.id, @turking_round.activity_id
        assert_equal new_datetime.to_s(:db), @turking_round.expires_at.to_s(:db)
      end

      should "not update record and return errors as json" do
        patch :update, id: @turking_round.id, turking_round: { activity_id: nil, uuid: nil, expires_at: nil }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['activity_id'].include?("can't be blank")
        assert parsed_response['uuid'].include?("can't be blank")
        assert parsed_response['expires_at'].include?("can't be blank")
      end
    end

    context 'destroy' do
      setup do
        @turking_round = create(:comprehension_turking_round)
      end

      should "destroy record at id" do
        delete :destroy, id: @turking_round.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @turking_round.id # still in test memory
        assert_nil TurkingRound.find_by_id(@turking_round.id) # not in DB.
      end
    end
  end
end
