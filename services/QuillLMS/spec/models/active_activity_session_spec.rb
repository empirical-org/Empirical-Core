# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActiveActivitySession, type: :model do
  let(:active_activity_session) { create(:active_activity_session) }

  describe '#valid?' do
    it 'should be valid from the factory' do
      expect(active_activity_session.valid?).to be true
    end

    it 'should be invalid without a uid' do
      active_activity_session.uid = nil
      expect(active_activity_session.valid?).to be false
    end

    it 'should be invalid without data' do
      active_activity_session.data = nil
      expect(active_activity_session.valid?).to be false
    end

    it 'should be invalid if data is not a hash' do
      active_activity_session.data = 1
      expect(active_activity_session.valid?).to be false
      expect(active_activity_session.errors[:data]).to include('must be a hash')
    end

    it 'should be invalid if the uid is not unique' do
      new_active_activity_session = ActiveActivitySession.new(uid: active_activity_session.uid, data: {foo: 'bar'})
      expect(new_active_activity_session.valid?).to be false
    end
  end

  describe '#as_json' do
    it 'should just be the data attribute' do
      expect(active_activity_session.as_json).to eq(active_activity_session.data)
    end
  end
end
