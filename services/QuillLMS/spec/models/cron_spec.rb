# frozen_string_literal: true

require 'rails_helper'
require 'sidekiq/testing'

describe "Cron", type: :model do
  describe "#interval_10_min" do
    [20, 50].each do |num_minutes|
      it "enqueues ResetGhostInspectorAccountWorker at #{num_minutes} minute marks" do
        time = Time.current.midnight + num_minutes.minutes
        expect(Cron).to receive(:now).at_least(:twice).and_return(time)
        expect(ResetGhostInspectorAccountWorker).to receive(:perform_async)
        Cron.interval_10_min
      end
    end

    [0, 10, 30, 40].each do |num_minutes|
      it "does not enqueue ResetGhostInspectorAccountWorker at #{num_minutes} minute marks" do
        time = Time.current.midnight + num_minutes.minutes
        expect(Cron).to receive(:now).at_least(:twice).and_return(time)
        expect(ResetGhostInspectorAccountWorker).not_to receive(:perform_async)
        Cron.interval_10_min
      end
    end
  end

  describe "#interval_1_hour" do
    it "enqueues CreditReferringAccountsWorker" do
      expect(CreditReferringAccountsWorker).to receive(:perform_async)
      Cron.interval_1_hour
    end
  end

  describe "#interval_1_day" do
    it "calls run_saturday is now is a Saturday" do
      a_saturday = Time.utc(2019, 10, 19)
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

    it "enqueues DemoAccountResetWorker" do
      expect(DemoAccountResetWorker).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues RematchUpdatedQuestionsWorker" do
      expect(RematchUpdatedQuestionsWorker).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues RefreshQuestionCacheWorker" do
      expect(RefreshQuestionCacheWorker).to receive(:perform_async).exactly(7).times
      Cron.interval_1_day
    end

    it "enqueues PreCacheAdminDashboardsWorker" do
      expect(PreCacheAdminDashboardsWorker).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues AlertSoonToExpireSubscriptionsWorker" do
      expect(AlertSoonToExpireSubscriptionsWorker).to receive(:perform_async)
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

    it 'enqueues DeleteObsoleteActiveActivitySessionsWorker' do
      expect(DeleteObsoleteActiveActivitySessionsWorker).to receive(:perform_async)
      Cron.run_saturday
    end
  end
end
