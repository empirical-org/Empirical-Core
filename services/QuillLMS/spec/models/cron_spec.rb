require 'rails_helper'
require 'sidekiq/testing'

describe "Cron", type: :model do
  describe "#interval_1_hour" do
    it "enqueues CreditReferringAccountsWorker" do
      expect(CreditReferringAccountsWorker).to receive(:perform_async)
      Cron.interval_1_hour
    end
  end

  describe "#interval_1_day" do
    it "calls run_saturday is now is a Saturday" do
      a_saturday = Time.new(2019, 10, 19)
      expect(Cron).to receive(:now).and_return(a_saturday)
      expect(Cron).to receive(:run_saturday)
      Cron.interval_1_day
    end

    it "enqueues QuillStaffAccountsChangedWorker" do
      expect(QuillStaffAccountsChangedWorker).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues RenewExpiringRecurringSubscriptionsWorker" do
      expect(RenewExpiringRecurringSubscriptionsWorker).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues DailyStatsEmailJob" do
      expect(DailyStatsEmailJob).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues ResetDemoAccountWorker" do
      expect(ResetDemoAccountWorker).to receive(:perform_async)
      Cron.interval_1_day
    end
  end

  describe "#run_saturday" do
    it "enqueues UploadLeapReportWorker on school_id 29087" do
      expect(UploadLeapReportWorker).to receive(:perform_async)
      Cron.run_saturday
    end

    it "enqueues SetImpactMetricsWorker" do
      expect(SetImpactMetricsWorker).to receive(:perform_async)
      Cron.run_saturday
    end

    it 'enqueues PopulateAllActivityHealthsWorker' do
      expect(PopulateAllActivityHealthsWorker).to receive(:perform_async)
      Cron.run_saturday
    end
  end
end
