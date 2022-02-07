# frozen_string_literal: true

require 'rails_helper'

describe ExpirePasswordTokenWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }

    it 'should set user token to nil' do
      user.refresh_token!
      subject.perform(user.id)
      expect(user.reload.token).to eq nil
    end
  end
end

