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
    it "calls run_saturday if now is a Saturday" do
      a_saturday = Time.utc(2019, 10, 19)
      allow(Cron).to receive(:now).and_return(a_saturday)
      expect(Cron).to receive(:run_saturday)
      Cron.interval_1_day
    end

    it "calls run_weekday if now is a weekday" do
      a_thursday = Time.utc(2019, 10, 17)
      allow(Cron).to receive(:now).and_return(a_thursday)
      expect(Cron).to receive(:run_weekday)
      Cron.interval_1_day
    end

    it "calls run_school_year_start if is July 1" do
      july_first = Time.utc(2022, 7, 1)
      allow(Cron).to receive(:now).and_return(july_first)
      expect(Cron).to receive(:run_school_year_start)
      Cron.interval_1_day
    end

    it "calls run_school_year_start if is NOT July 1" do
      july_second = Time.utc(2022, 7, 2)
      allow(Cron).to receive(:now).and_return(july_second)
      expect(Cron).not_to receive(:run_school_year_start)
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

    it "enqueues Demo::RecreateAccountWorker" do
      expect(Demo::RecreateAccountWorker).to receive(:perform_async)
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

    it "enqueues PopulateAggregatedEvidenceActivityHealthsWorker" do
      expect(PopulateAggregatedEvidenceActivityHealthsWorker).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues AlertSoonToExpireSubscriptionsWorker" do
      expect(AlertSoonToExpireSubscriptionsWorker).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues CalculateAndCacheSchoolsDataForSegmentWorker" do
      expect(CalculateAndCacheSchoolsDataForSegmentWorker).to receive(:perform_async)
      Cron.interval_1_day
    end

    it "enqueues SendSegmentIdentifyCallForAllAdminsWorker" do
      expect(SendSegmentIdentifyCallForAllAdminsWorker).to receive(:perform_async)
      Cron.interval_1_day
    end
  end

  describe "#run_weekday" do
    it "enqueues IdentifyStripeInvoicesWithoutSubscriptionsWorker" do
      expect(IdentifyStripeInvoicesWithoutSubscriptionsWorker).to receive(:perform_async)
      Cron.run_weekday
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

  describe "#run_school_year_start" do
    it "enqueues PopulateAnnualVitallyWorker" do
      expect(PopulateAnnualVitallyWorker).to receive(:perform_async)
      Cron.run_school_year_start
    end
  end
end
