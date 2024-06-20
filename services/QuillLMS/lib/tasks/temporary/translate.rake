# frozen_string_literal: true

namespace :translate do
  desc 'translate hints (concept feedback)'
  task hints: :environment do
    hints = ConceptFeedback.limit(50)
    CSV.open('open_ai_spanish_translate.csv', 'wb') do |csv|

      csv << ["english", "spanish"]
      hints.each_with_index do |hint, index|
        puts "translating #{index}/50..."
        res = Evidence::OpenAI::Translate.run(english_text: hint.description)
        csv << [hint.description, res]
      end
    end



  end
end
