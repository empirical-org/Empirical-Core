# frozen_string_literal: true

namespace :translate do
  desc 'translate hints (concept feedback)'
  task hints: :environment do
    hints = ConceptFeedback.limit(3)
    hints.map(&:create_translation_mappings)
    english_texts = hints.map(&:english_text)
    Gengo::RequestTranslations.run(english_texts)
  end
end
