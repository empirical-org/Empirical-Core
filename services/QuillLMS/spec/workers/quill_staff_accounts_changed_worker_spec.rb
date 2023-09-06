# frozen_string_literal: true

require 'rails_helper'

describe QuillStaffAccountsChangedWorker, type: :worker do
  let(:worker) { described_class.new }
  let(:staff_accounts_cache_key) { described_class::STAFF_ACCOUNTS_CACHE_KEY }

  describe "#perform" do
    let(:staff) { create_list(:staff, 2) }
    let(:serialized_staff) { staff.to_json(only: described_class::PARAMS_TO_TRACK) }
    let(:expires_in) { described_class::EXPIRES_IN }

    it "should send notification if cached staff and current staff are different" do
      expect(worker).to receive(:cached_staff_account_data).and_return({})
      expect(worker).to receive(:notify_staff)
      expect($redis).to receive(:set).with(staff_accounts_cache_key, serialized_staff, ex: expires_in)
      worker.perform
    end

    it "should not send a notification if cached staff and current staff are the same" do
      expect($redis).to receive(:get).with(staff_accounts_cache_key).and_return(staff.to_json(only: described_class::PARAMS_TO_TRACK))
      expect(worker).not_to receive(:notify_staff)
      expect($redis).to receive(:set).with(staff_accounts_cache_key, serialized_staff, ex: expires_in)
      worker.perform
    end
  end

  describe "#current_staff_account_data" do
    let!(:staff_user) { create(:staff) }

    it "returns a hash containing all staff accounts" do
      current_accounts = worker.current_staff_account_data
      expect(current_accounts.length).to eq(1)
      expect(current_accounts[0]["id"]).to eq(staff_user.id)
    end
  end

  describe "#cached_staff_account_data" do
    it "retrieves cached data from Redis" do
      expect($redis).to receive(:get).with(staff_accounts_cache_key)
      worker.cached_staff_account_data
    end
  end

  describe "#notify_staff" do
    let!(:staff) { create(:staff) }

    it "sends an email if current and previous staff data is different" do
      mailer_double = double
      expect(ActionMailer::Base).to receive(:mail).and_return(mailer_double)
      expect(mailer_double).to receive(:deliver)
      current_accounts = worker.current_staff_account_data
      worker.notify_staff(current_accounts, [])
    end

    it "does not send an email if current and staff data is identical" do
      expect(ActionMailer::Base).not_to receive(:mail)
      current_accounts = worker.current_staff_account_data
      worker.notify_staff(current_accounts, current_accounts)
    end
  end

end
