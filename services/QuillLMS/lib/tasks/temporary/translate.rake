# frozen_string_literal: true

namespace :translate do
  desc 'translate hints (concept feedback)'
  task hints: :environment do
    jobs_list = ConceptFeedback.limit(3).map(&:queue_translation).compact
    return unless jobs_list.present?

    EnglishText.translate!(jobs_list:)
  end
end
