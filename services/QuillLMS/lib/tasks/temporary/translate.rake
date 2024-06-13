# frozen_string_literal: true

namespace :translate do
  desc 'translate hints (concept feedback)'
  task hints: :environment do
    hints = ConceptFeedback.limit(3)
    hints.map(&:create_translation_mappings)
    jobs_list = hints.map(&:english_text).map(&:gengo_payload).compact
    return unless jobs_list.present?

    EnglishText.translate!(jobs_list:)
  end
end
