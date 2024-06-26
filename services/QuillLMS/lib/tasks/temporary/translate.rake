# frozen_string_literal: true

namespace :translate do
  desc 'translate hints (concept feedback)'
  task hints: :environment do
    hints = ConceptFeedback.all
    count = hints.count
    hints.each_with_index do |hint, index|
      puts "translating #{index + 1}/#{count}..."
      res = Evidence::OpenAI::Translate.run(english_text: hint.description)
      hint.create_translation_mappings
      hint.english_texts.first.openai_translated_texts.create(
        translation: res,
        locale: Gengo::SPANISH_LOCALE)
    end

  end

  task activities: :environment do
    activities = Activity.where("id in (?)", activity_ids).limit(50)
    CSV.open("open_ai_spanish_activities.csv", "wb") do |csv|
      csv << ["english", "spanish"]
      activities.each_with_index do |activity, index|
        puts "translating #{index + 1}/50..."
        html = activity.data["landingPageHtml"]
        next unless html.present?
        res = Evidence::OpenAI::Translate.run(english_text: html)
        csv << [html, res]
        puts ""
      end
    end
  end

  task questions: :environment do
    activities = Activity.where("id in (?)", activity_ids).limit(1)
    CSV.open("open_ai_spanish_questions.csv", "wb") do |csv|
      csv << ["question_id", "question_uid", "english", "spanish"]
      activities.each_with_index do |activity, index|
        puts "translating activity #{index + 1}/50..."
        questions = activity.data["questions"]
        next if questions.empty?
        length = questions.length
        questions.each_with_index do |q, q_index|
          puts "translating question #{q_index + 1}/#{length} for activity #{index + 1}"
          question = Question.find_by(uid: q["key"])
          instruction = question.data["instructions"]
          next unless instruction.present?
          res = Evidence::OpenAI::Translate.run(english_text: instruction)
          csv << [question.id, question.uid, instruction, res]
        end
      end
    end

  end

  def activity_ids
    %w(
      1100
      1849
      1127
      1123
      1101
      1567
      2119
      1913
      1569
      1153
      1834
      1154
      1852
      1155
      1904
      1151
      1853
      1138
      1662
      2146
      1551
      1914
      1581
      2121
      1571
      1959
      1657
      2150
      1658
      2148
      1135
      1844
      1157
      1891
      1156
      1113
      1114
      1134
      1843
      1580
      2117
      1584
      2124
      1552
      1916
      1583
      2123
      1585
      2125
      )
  end
end
