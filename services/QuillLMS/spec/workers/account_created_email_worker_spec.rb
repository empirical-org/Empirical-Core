# frozen_string_literal: true

require 'rails_helper'

describe AccountCreatedEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }

    it 'should send the account created email to the user' do
      expect_any_instance_of(User).to receive(:send_account_created_email).with("test123", "test")
      subject.perform(user.id, "test123", "test")
    end
  end
end
