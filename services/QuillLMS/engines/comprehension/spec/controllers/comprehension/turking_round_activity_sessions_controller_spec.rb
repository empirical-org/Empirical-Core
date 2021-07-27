require 'rails_helper'

module Comprehension
  RSpec.describe(TurkingRoundActivitySessionsController, :type => :controller) do
    before { @routes = Engine.routes }

    context 'should index' do

      it 'should return successfully - no turking_round_activity_session' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context 'should with turking_round_activity_sessions' do
        let!(:turking_round_activity_session) { create(:comprehension_turking_round_activity_session) }

        it 'should return successfully' do
          get(:index)
          parsed_response = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
        end
      end
    end

    context 'should create' do
      let!(:turking_round_activity_session) { build(:comprehension_turking_round_activity_session) }

      it 'should create a valid record and return it as json' do
        turking_round = create(:comprehension_turking_round)
        post(:create, :params => ({ :turking_round_activity_session => ({ :turking_round_id => turking_round.id, :activity_session_uid => SecureRandom.uuid }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(TurkingRoundActivitySession.count).to(eq(1))
      end

      it 'should not create an invalid record and return errors as json' do
        post(:create, :params => ({ :turking_round_activity_session => ({ :activity_session_uid => nil }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["activity_session_uid"].include?("can't be blank")).to(eq(true))
        expect(TurkingRoundActivitySession.count).to(eq(0))
      end
    end

    context 'should show' do
      let!(:turking_round_activity_session) { create(:comprehension_turking_round_activity_session) }

      it 'should return json if found' do
        get(:show, :params => ({ :id => turking_round_activity_session.id }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
      end

      it 'should raise if not found (to be handled by parent app)' do
        expect { get(:show, :params => ({ :id => 99999 })) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end

    context 'should update' do
      let!(:turking_round_activity_session) { create(:comprehension_turking_round_activity_session) }

      it 'should update record if valid, return nothing' do
        new_session_uid = SecureRandom.uuid
        patch(:update, :params => ({ :id => turking_round_activity_session.id, :turking_round_activity_session => ({ :activity_session_uid => new_session_uid }) }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        turking_round_activity_session.reload
        expect(new_session_uid).to(eq(turking_round_activity_session.activity_session_uid))
      end

      it 'should not update record and return errors as json' do
        patch(:update, :params => ({ :id => turking_round_activity_session.id, :turking_round_activity_session => ({ :activity_session_uid => nil }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["activity_session_uid"].include?("can't be blank")).to(eq(true))
      end
    end

    context 'should destroy' do
      let!(:turking_round_activity_session) { create(:comprehension_turking_round_activity_session) }

      it 'should destroy record at id' do
        delete(:destroy, :params => ({ :id => turking_round_activity_session.id }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect(turking_round_activity_session.id).to(be_truthy)
        expect(TurkingRoundActivitySession.find_by_id(turking_round_activity_session.id)).to(be_nil)
      end
    end
  end
end
