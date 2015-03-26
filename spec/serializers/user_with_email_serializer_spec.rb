require 'rails_helper'

describe UserWithEmailSerializer, type: :serializer do
  let(:user) { FactoryGirl.create(:teacher) }
  let(:serializer)     { UserWithEmailSerializer.new(user) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json(root: 'user') }
    let(:parsed) { JSON.parse(json) }

    it "includes 'user' key" do
      expect(parsed.keys).to include('user')
    end

    describe "'user' object" do
      let(:parsed_user) { parsed['user'] }

      it 'has the extra email key' do
        expect(parsed_user.keys)
          .to include("email")
      end
    end
  end
end
