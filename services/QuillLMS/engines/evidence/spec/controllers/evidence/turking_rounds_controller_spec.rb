# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(TurkingRoundsController, :type => :controller) do
    before { @routes = Engine.routes }

    context 'should index' do

      it 'should return successfully - no turking_round' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context 'should with turking_rounds' do
        let!(:turking_round) { create(:evidence_turking_round) }

        it 'should return successfully' do
          get(:index)
          parsed_response = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["activity_id"]).to(eq(turking_round.activity.id))
          expect(parsed_response.first["expires_at"]).to(eq(turking_round.expires_at.iso8601(3)))
          expect(parsed_response.first["uuid"]).to(eq(turking_round.uuid))
        end
      end
    end

    context 'should create' do
      let!(:activity) { create(:evidence_activity) }
      let!(:turking_round) { build(:evidence_turking_round, :activity => (activity)) }

      it 'should create a valid record and return it as json' do
        post(:create, :params => ({ :turking_round => ({ :activity_id => activity.id, :uuid => turking_round.uuid, :expires_at => turking_round.expires_at.iso8601(3) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["activity_id"]).to(eq(turking_round.activity_id))
        expect(parsed_response["uuid"]).to(eq(turking_round.uuid))
        expect(parsed_response["expires_at"]).to(eq(turking_round.expires_at.iso8601(3)))
        expect(TurkingRound.count).to(eq(1))
      end

      it 'should not create an invalid record and return errors as json' do
        post(:create, :params => ({ :turking_round => ({ :activity_id => nil, :expires_at => nil }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["activity_id"].include?("can't be blank")).to(eq(true))
        expect(parsed_response["expires_at"].include?("can't be blank")).to(eq(true))
        expect(TurkingRound.count).to(eq(0))
      end
    end

    context 'should show' do
      let!(:turking_round) { create(:evidence_turking_round) }

      it 'should return json if found' do
        get(:show, :params => ({ :id => turking_round.id }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["activity_id"]).to(eq(turking_round.activity.id))
        expect(parsed_response["uuid"]).to(eq(turking_round.uuid))
        expect(parsed_response["expires_at"]).to(eq(turking_round.expires_at.iso8601(3)))
      end

      it 'should raise if not found (to be handled by parent app)' do
        expect { get(:show, :params => ({ :id => 99999 })) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end

    context 'should update' do
      let!(:turking_round) { create(:evidence_turking_round) }

      it 'should update record if valid, return nothing' do
        new_activity = create(:evidence_activity)
        new_datetime = DateTime.current.utc
        patch(:update, :params => ({ :id => turking_round.id, :turking_round => ({ :activity_id => new_activity.id, :expires_at => new_datetime }) }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        turking_round.reload
        expect(turking_round.activity_id).to(eq(new_activity.id))
        expect(turking_round.expires_at.to_s(:db)).to(eq(new_datetime.to_s(:db)))
      end

      it 'should not update record and return errors as json' do
        patch(:update, :params => ({ :id => turking_round.id, :turking_round => ({ :activity_id => nil, :uuid => nil, :expires_at => nil }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["activity_id"].include?("can't be blank")).to(eq(true))
        expect(parsed_response["uuid"].include?("can't be blank")).to(eq(true))
        expect(parsed_response["expires_at"].include?("can't be blank")).to(eq(true))
      end
    end

    context 'should destroy' do
      let!(:turking_round) { create(:evidence_turking_round) }

      it 'should destroy record at id' do
        delete(:destroy, :params => ({ :id => turking_round.id }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect(turking_round.id).to(be_truthy)
        expect(TurkingRound.find_by_id(turking_round.id)).to(be_nil)
      end
    end
  end
end
