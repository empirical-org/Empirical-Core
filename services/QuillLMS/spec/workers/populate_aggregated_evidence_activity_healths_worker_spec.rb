# frozen_string_literal: true

require 'rails_helper'

RSpec::Matchers.define :a_multiple_of do |x|
  match { |actual| (actual % x).zero? }
end

describe PopulateAggregatedEvidenceActivityHealthsWorker do
  subject { described_class.new }

  let(:connect) { create(:activity_classification, key: 'connect') }
  let(:connect_activity) { create(:activity, activity_classification_id: connect.id) }
  let(:evidence_activity) { create(:evidence_activity, notes: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1) }
  let(:evidence_activity_two) { create(:evidence_activity, notes: 'Title_2', title: 'Title 2', parent_activity_id: 1, target_level: 1) }
  let(:parent_archived_activity) { create(:activity, flag: 'archived') }
  let(:archived_evidence_activity) { create(:evidence_activity, notes: 'Title_3', title: 'Title 3', parent_activity_id: parent_archived_activity.id, target_level: 1) }

  it 'should kick off populate activity health worker jobs spread out by interval' do
    stub_const('PopulateEvidenceActivityHealthsWorker::INTERVAL', 5)

    expect(PopulateEvidenceActivityHealthWorker).to receive(:perform_in).with(a_multiple_of(5), evidence_activity.id)
    expect(PopulateEvidenceActivityHealthWorker).to receive(:perform_in).with(a_multiple_of(5), evidence_activity_two.id)
    subject.perform
  end

  it 'should not run for connect activity' do
    stub_const('PopulateEvidenceActivityHealthsWorker::INTERVAL', 5)

    expect(PopulateEvidenceActivityHealthWorker).to receive(:perform_in).with(0, evidence_activity.id).once
    expect(PopulateEvidenceActivityHealthWorker).to_not receive(:perform_in).with(5, connect_activity.id)

    subject.perform
  end

  it 'should truncate the table each time the job is run' do
    create(:evidence_activity_health)
    expect(Evidence::ActivityHealth.count).to eq(1)

    subject.perform
    expect(Evidence::ActivityHealth.count).to eq(0)
    expect(Evidence::ActivityHealth.create(name: 'title1', activity_id: 1, flag: 'alpha', version: 1, version_plays: 0, total_plays: 0).id).to eq(1)
  end

  it 'should not run for archived evidence activity' do
    stub_const('PopulateEvidenceActivityHealthsWorker::INTERVAL', 5)

    expect(PopulateEvidenceActivityHealthWorker).to receive(:perform_in).with(0, evidence_activity.id).once
    expect(PopulateEvidenceActivityHealthWorker).not_to receive(:perform_in).with(a_multiple_of(5), archived_evidence_activity.id)

    subject.perform
  end
end
