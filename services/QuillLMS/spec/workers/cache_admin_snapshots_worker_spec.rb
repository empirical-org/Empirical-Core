# frozen_string_literal: true

require 'rails_helper'

describe CacheAdminSnapshotsWorker, type: :worker do
  subject { worker.perform(admin_id) }

  let(:worker) { described_class.new }
  let(:admin) { create(:admin) }
  let(:admin_id) { admin.id }
  let(:schools_admin) { create(:schools_admins, user: admin) }
  let(:school) { schools_admin.school }
  let(:school_ids) { [school.id] }

  let(:previous_timeframe_start) { previous_timeframe_end - 1.day }
  let(:previous_timeframe_end) { current_timeframe_start - 1.day }
  let(:current_timeframe_start) { current_timeframe_end - 1.day }
  let(:current_timeframe_end) { DateTime.current }

  let(:query_name) { 'query' }
  let(:payload) { ['payload'] }
  let(:previous_payload) { ['previous_payload'] }

  before do
    allow(Snapshots::Timeframes).to receive(:calculate_timeframes).with(anything).and_return([current_timeframe_start, current_timeframe_end])
    allow(Snapshots::Timeframes).to receive(:calculate_timeframes).with(anything, previous_timeframe: true).and_return([previous_timeframe_start, previous_timeframe_end])

    stub_const("Snapshots::CacheSnapshotCountWorker::QUERIES", { query_name => nil })
    stub_const("Snapshots::CacheSnapshotTopXWorker::QUERIES", { query_name => nil })
  end

  context 'enqueueing cache workers' do
    it do
      expect(worker).to receive(:generate_worker_payload)
        .with(query_name, previous_timeframe_start, previous_timeframe_end, previous_timeframe: true)
        .once
        .ordered
        .and_return(previous_payload)
      expect(worker).to receive(:generate_worker_payload)
        .with(query_name, current_timeframe_start, current_timeframe_end)
        .twice
        .ordered
        .and_return(payload)
      expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*previous_payload)
      expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*payload)
      expect(Snapshots::CacheSnapshotTopXWorker).to receive(:perform_async).with(*payload)

      subject
    end
  end

  context 'stored report filters' do
    let(:school_filters) do
      [
        {"id" => 129107, "name" => "Vitally Test", "label" => "Vitally Test", "value" => 129107},
        {"id" => 157509, "name" => "Gem Prep => Pocatello School", "label" => "Gem Prep => Pocatello School", "value" => 157509}
      ]
    end
    let(:grade_filters) do
      [
        {"name" => "Kindergarten", "label" => "Kindergarten", "value" => "Kindergarten"},
        {"name" => "1st", "label" => "1st", "value" => "1"}
      ]
    end
    let(:teacher_filters) do
      [
        {"id" => 9639714, "name" => "Peter 1027", "label" => "Peter 1027", "value" => 9639714},
        {"id" => 13837796, "name" => "Test Csv", "label" => "Test Csv", "value" => 13837796}
      ]
    end
    let(:classroom_filters) do
      [
        {"id" => 1267312, "name" => "Academic Block Test", "label" => "Academic Block Test", "value" => 1267312},
        {"id" => 942566, "name" => "Clever 101 - 2021 Import", "label" => "Clever 101 - 2021 Import", "value" => 942566}
      ]
    end
    let(:filter_selections) do
      {
        "schools" => school_filters,
        "grades" => grade_filters,
        "teachers" => teacher_filters,
        "classrooms" => classroom_filters
      }
    end
    let!(:filter_selection) { create(:admin_report_filter_selection, user: admin, report: described_class::REPORT_NAME, filter_selections:) }
    let(:expected_args) do
      [
        anything,
        query_name,
        admin.id,
        anything,
        school_filters.map { |s| s['value'] },
        {
          grades: grade_filters.map { |g| g['value'] },
          teacher_ids: teacher_filters.map { |g| g['value'] },
          classroom_ids: classroom_filters.map { |c| c['value'] }
        }
      ]
    end

    it do
      expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*expected_args + [true])
      expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*expected_args + [nil])
      expect(Snapshots::CacheSnapshotTopXWorker).to receive(:perform_async).with(*expected_args + [nil])

      subject
    end
  end

  context 'non-existent admin_id' do
    let(:admin_id) { admin.id + 1 }

    it do
      expect(Snapshots::Timeframes).not_to receive(:calculate_timeframes)
      subject
    end
  end
end
