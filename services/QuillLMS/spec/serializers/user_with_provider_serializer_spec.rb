# frozen_string_literal: true

require 'rails_helper'

describe UserWithProviderSerializer, type: :serializer do
  let(:user) { create(:teacher) }
  let(:serializer) { described_class.new(user) }

  describe '#to_json output' do
    let(:json) { serializer.to_json(root: 'user') }
    let(:parsed) { JSON.parse(json) }
    let(:parsed_user) { parsed['user'] }

    it { expect(parsed.keys).to include('user')}
    it { expect(parsed_user.keys).to include('provider') }
    it { expect(parsed_user.keys).to include('user_external_id') }

    context 'when user is a google user' do
      let(:google_id) { Faker::Number.number(digits: 21).to_s }

      before { user.update(google_id: google_id) }

      it { expect(parsed_user['provider']).to eq User::GOOGLE_PROVIDER  }
      it { expect(parsed_user['user_external_id']).to eq google_id  }
    end

    context 'when user is a clever user' do
      let(:clever_id) { SecureRandom.hex(12) }

      before { user.update(clever_id: clever_id) }

      it { expect(parsed_user['provider']).to eq User::CLEVER_PROVIDER  }
      it { expect(parsed_user['user_external_id']).to eq clever_id  }
    end

    # The canvas user construction is different since we can't uniquely identify
    # the user_external_id without a canvas_auth_credential which ties the canvas_instance to the user
    context 'when user is a canvas user' do
      let(:user) { create(:canvas_auth_credential).user }
      let(:canvas_instance) { user.canvas_instances.first }

      it { expect(parsed_user['provider']).to eq User::CANVAS_PROVIDER }
      it { expect(parsed_user['user_external_id']).to eq user.user_external_id(canvas_instance: canvas_instance) }
    end

    context 'when user has a school that is linked to canvas' do
      let(:school) { create(:schools_users, user: user).school }
      let!(:canvas_instance_school) { create(:canvas_instance_school, school: school) }

      before { user.reload }

      it { expect(parsed_user['school_linked_to_canvas']).to eq true }
    end

    context 'when user has a school that is not linked to canvas' do
      let(:school) { create(:schools_users, user: user).school }

      before { user.reload }

      it { expect(parsed_user['school_linked_to_canvas']).to eq nil }
    end

    context 'when user does not have a school' do
      it { expect(parsed_user['school_linked_to_canvas']).to eq nil }
    end
  end
end
