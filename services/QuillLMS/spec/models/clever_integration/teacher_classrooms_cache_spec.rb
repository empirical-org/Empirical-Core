# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherClassroomsCache do
  let(:user_id) { create(:user).id }
  let(:data) { { "classrooms" => [] }.to_json }
  let(:cache) { described_class }

  context 'key is not cached' do
    it 'returns true message after caching' do
      expect(cache.write(user_id, data)).to eq true
    end

    it 'nothing will retrieved from cache' do
      expect(cache.read(user_id)).to eq nil
    end
  end

  context 'key is already cached' do
    before { cache.write(user_id, data) }

    it 'allows retrieval' do
      expect(cache.read(user_id)).to eq data
    end

    it 'allows for expiration' do
      cache.write(user_id, data, 0.1)
      sleep 0.1
      expect(cache.read(user_id)).to eq nil
    end

    it 'deletes data' do
      expect { cache.delete(user_id) }.to change { cache.read(user_id) }.from(data).to(nil)
    end
  end
end
