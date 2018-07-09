require 'rails_helper'

describe AccountCreationCallbacks do
  describe '#trigger' do
    context 'when user is teacher' do
      let(:user) { double(:user, role: "teacher", id: "some_id") }
      let(:subject) { described_class.new(user, "some_ip") }

      it 'should trigger the welcome email, account creation and iplocation worker' do
        expect(WelcomeEmailWorker).to receive(:perform_async).with "some_id"
        expect(AccountCreationWorker).to receive(:perform_async).with "some_id"
        expect(IpLocationWorker).to receive(:perform_async).with "some_id", "some_ip"
        subject.trigger
      end
    end

    context 'when user is student' do
      let(:user) { double(:user, role: "student", id: "some_id") }
      let(:subject) { described_class.new(user, "some_ip") }

      it 'should only trigger the account creation worker' do
        expect(WelcomeEmailWorker).to_not receive(:perform_async)
        expect(AccountCreationWorker).to receive(:perform_async).with "some_id"
        expect(IpLocationWorker).to_not receive(:perform_async)
        subject.trigger
      end
    end
  end
end