require 'rails_helper'

describe "ThirdPartyUserId", type: :model do
  let(:title_card) { create(:title_card) }
  let(:third_party_user_id) { create(:third_party_user_id) }
  let(:new_params) { {user: third_party_user_id.user, source: third_party_user_id.source, third_party_id: third_party_user_id.third_party_id} }

  describe "#valid" do
    it 'should be invalid if required params are not present' do
      required_params = [:user, :third_party_id, :source]
      required_params.each do |p|
        expect(ThirdPartyUserId.new(new_params.except(p)).valid?).to eq(false)
      end
    end

    it 'should be valid if required params are present' do
      expect(ThirdPartyUserId.new(new_params).valid?).to eq(true)
    end

    it 'should only be valid if the ID source is one we already know' do
      expect(ThirdPartyUserId.new(new_params.update({source: "unknown"})).valid?).to eq(false)
    end
  end
end
