# frozen_string_literal: true

class IdentifyUnmigratedOldConceptResultsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  REPORT_RECIPIENT = 'thomas@quill.org'
  BATCH_SIZE = 10_000_000

  def perform(start_id, max_id)
    max_id ||= OldConceptResult.maximum(:id)

    start_id ||= 1

    missing_id_ranges = []

    while start_id < max_id
      stop_id = [(start_id + BATCH_SIZE - 1), max_id].min

      missing_ids_query(start_id, stop_id).find_each(batch_size: 1_000) do |old_concept_result|
        if missing_id_ranges.last&.last == old_concept_result.id - 1
          missing_id_ranges.last[-1] = old_concept_result.id
        else
          missing_id_ranges.push([old_concept_result.id, old_concept_result.id])
        end
      end
      start_id += BATCH_SIZE
    end

    csv_output = ""
    missing_id_ranges.each do |id_range|
      csv_output += CSV.generate_line(id_range)
    end

    send_report(csv_output)
  end

  def send_report(csv_output)
    SendAttachmentMailer.send_attached_file(REPORT_RECIPIENT, 'Unmigrated OldConceptResult IDs', 'unmigrated_old_concept_result_id_ranges.csv', csv_output).deliver_now!
  end

  def missing_ids_query(start_id, stop_id)
    OldConceptResult
      .select(:id)
      .left_outer_joins(:concept_result)
      .where(concept_results: {id: nil})
      .where(id: (start_id..stop_id))
      .order(:id)
  end
end
