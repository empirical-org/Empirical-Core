# frozen_string_literal: true

require 'rails_helper'

describe IdentifyUnmigratedOldConceptResultsWorker, type: :worker do

  context '#send_report' do
    it 'should instantiate a mailer and call for delivery' do
      send_me = 'test'

      mailer_double = double
      expect(mailer_double).to receive(:deliver_now!)
      expect(SendAttachmentMailer).to receive(:send_attached_file)
        .with(IdentifyUnmigratedOldConceptResultsWorker::REPORT_RECIPIENT,
          'Unmigrated OldConceptResult IDs',
          'unmigrated_old_concept_result_id_ranges.csv',
          send_me)
        .and_return(mailer_double)

      subject.send_report(send_me)
    end
  end

  context '#perform' do
    let(:activity_session) { create(:activity_session_without_concept_results) }
    let(:old_concept_results) { (1..10).map { create(:old_concept_result, activity_session: activity_session) } }
    let!(:concept_result) { create(:concept_result, old_concept_result_id: old_concept_results[5].id, activity_session_id: activity_session.id) }

    let(:unmigrated_ranges) {
      [
        [old_concept_results[0].id, old_concept_results[4].id],
        [old_concept_results[6].id, old_concept_results[-1].id]
      ]
    }

    it 'should identify OldConceptResult records with no corresponding ConceptResult' do
      csv_data = unmigrated_ranges.map { |range| CSV.generate_line(range) }.join

      expect_any_instance_of(IdentifyUnmigratedOldConceptResultsWorker).to receive(:send_report).with(csv_data)

      subject.perform(nil, nil)
    end

    it 'should allow specification of the OldConceptResult ID to start with' do
      csv_data = CSV.generate_line(unmigrated_ranges.last)

      expect_any_instance_of(IdentifyUnmigratedOldConceptResultsWorker).to receive(:send_report).with(csv_data)

      subject.perform(unmigrated_ranges.last.first, nil)
    end

    it 'should allow specification of the OldConceptResult ID to stop with' do
      csv_data = CSV.generate_line(unmigrated_ranges.first)

      expect_any_instance_of(IdentifyUnmigratedOldConceptResultsWorker).to receive(:send_report).with(csv_data)

      subject.perform(nil, unmigrated_ranges.first.last)
    end
  end
end

