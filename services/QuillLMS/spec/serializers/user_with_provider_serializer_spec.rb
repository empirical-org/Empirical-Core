# frozen_string_literal: true

require 'rails_helper'

describe UserWithProviderSerializer, type: :serializer do
  let(:user) { create(:teacher) }
  let(:serializer) { described_class.new(user) }

  describe '#to_json output' do
    let(:json) { serializer.to_json(root: 'user') }
    let(:parsed) { JSON.parse(json) }

    it { expect(parsed.keys).to include('user')}

    describe "'user' object" do
      let(:parsed_user) { parsed['user'] }

      it { expect(parsed_user.keys).to include('provider') }
    end
  end
end
