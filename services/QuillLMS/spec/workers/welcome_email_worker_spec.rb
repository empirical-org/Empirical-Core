require 'rails_helper'

describe WelcomeEmailWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }

    it 'should send the welcome email' do
      expect_any_instance_of(User).to receive(:send_welcome_email)
      subject.perform(user.id)
    end
  end
end