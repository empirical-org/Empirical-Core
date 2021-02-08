require 'rails_helper'

describe ExpireUserTokensWorker do 
  let(:subject) { described_class.new }
  
  describe '#perform' do 
    let!(:user) { create(:user) }
    let!(:user_2) { create(:user) }

    it 'should set user token to nil' do 
      user.refresh_token!
      user_2.refresh_token!
      subject.perform
      expect(user.reload.token).to eq nil
      expect(user_2.reload.token).to eq nil
    end
  end
end

