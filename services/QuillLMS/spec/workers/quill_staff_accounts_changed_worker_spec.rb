# frozen_string_literal: true

require 'rails_helper'

describe QuillStaffAccountsChangedWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    let(:staff) { create(:staff) }
    let(:staff_json) { staff.as_json }

    it "should send notification if cached staff and current staff are different" do

      expect(worker).to receive(:current_staff_account_data).and_return([staff_json])
      expect(worker).to receive(:cached_staff_account_data).and_return({})
      expect(worker).to receive(:notify_staff)
      expect($redis).to receive(:set).with(QuillStaffAccountsChangedWorker::STAFF_ACCOUNTS_CACHE_KEY, [staff_json].to_json, ex: 25.hours.to_i)
      worker.perform
    end

    it "should not send a notification if cached staff and current staff are the same" do
      expect(worker).to receive(:current_staff_account_data).and_return([staff_json])
      expect(worker).to receive(:cached_staff_account_data).and_return([staff_json])
      expect(worker).not_to receive(:notify_staff)
      expect($redis).to receive(:set).with(QuillStaffAccountsChangedWorker::STAFF_ACCOUNTS_CACHE_KEY, [staff_json].to_json, ex: 25.hours.to_i)
      worker.perform
    end

  end

  describe "#current_staff_account_data" do
    let!(:staff_user) { create(:staff) }

    it "returns a hash containing all staff accounts" do
      current_accounts = worker.current_staff_account_data
      expect(current_accounts.length).to eq(1)
      expect(current_accounts[0]["id"]).to eq(staff_user.id.to_s)
    end
  end

  describe "#cached_staff_account_data" do
    it "retrieves cached data from Redis" do
      expect($redis).to receive(:get).with(QuillStaffAccountsChangedWorker::STAFF_ACCOUNTS_CACHE_KEY)
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
