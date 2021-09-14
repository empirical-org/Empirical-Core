require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherClassroomsCache do
  let(:user_id) { create(:user).id }
  let(:data) { { "classrooms" => [] }.to_json }
  let(:cache) { described_class }

  context 'key is not cached' do
    it 'returns OK message after caching' do
      expect(cache.set(user_id, data)).to eq "OK"
    end

    it 'nothing will retrieved from cache' do
      expect(cache.get(user_id)).to eq nil
    end
  end

  context 'key is already cached' do
    before { cache.set(user_id, data) }

    it 'allows retrieval' do
      expect(cache.get(user_id)).to eq data
    end

    it 'allows for expiration' do
      cache.expire(user_id, 0.1)
      sleep 0.1
      expect(cache.get(user_id)).to eq nil
    end

    it 'deletes data' do
      expect { cache.del(user_id) }.to change { cache.get(user_id) }.from(data).to(nil)
    end
  end
end
