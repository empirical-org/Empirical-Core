# frozen_string_literal: true

namespace :diagnostic_question_optimal_concepts do
  desc 'Populate diagnostic_question_optimal_concepts from CSV extracted from Curriculum Notion database: https://www.notion.so/quill/f937b1cc8d2d4ed8943a36ce35dca177?v=7dd55ee1f04e4b5daf79645aae960aa1'
  task populate_from_csv: :environment do
    DELIMITER = ">"
    CSV_PATH = "diagnostic_question_concepts.csv"

    DIAGNOSTIC_ID_LOOKUP = {
      "Starter Pre" => Activity.find(1663),
      "Starter Post" => Activity.find(1664),
      "Intermediate Pre" => Activity.find(1668),
      "Intermediate Post" => Activity.find(1669),
      "Advanced Pre" => Activity.find(1678),
      "Advanced Post" => Activity.find(1680),
      "ELL Starter Pre" => Activity.find(1161),
      "ELL Starter Post" => Activity.find(1774),
      "ELL Intermediate Pre" => Activity.find(1568),
      "ELL Intermediate Post" => Activity.find(1814),
      "ELL Advanced Pre" => Activity.find(1590),
      "ELL Advanced Post" => Activity.find(1818),
      "Springboard" => Activity.find(1432),
      "PreAP 1" => Activity.find(1229),
      "PreAP 2" => Activity.find(1230),
      "AP" => Activity.find(992)
    }

    DIAGNOSTIC_INDEX = 0
    QUESTION_INDEX = 2
    QUESTION_NUMBER_INDEX = 5
    QUESTION_CONCEPTS_FALLBACK_INDEX = 6
    QUESTION_CONCEPTS_INDEX = 7
    OPTIMAL_CONCEPTS_INDEX = 13

    count = 0
    CSV.read(CSV_PATH, headers: true).each do |row|
      activity = DIAGNOSTIC_ID_LOOKUP[row[DIAGNOSTIC_INDEX]]
      questions = activity.data['questions'].filter {|d| d['questionType'] != 'titleCards' }
      question_number = row[QUESTION_NUMBER_INDEX].to_i
      question_uid = questions[question_number - 1]['key']
      question = Question.find_by(uid: question_uid)
      sanitized_question = question.data['prompt']
        .gsub("&#x27;", "'")
        .gsub(/<[^>]*>/,"")
        .gsub(/\./, ". ")
        .gsub(/[ ]+/, " ")
      csv_question = row[QUESTION_INDEX]
      sanitized_csv_question = csv_question.gsub(/\./, ". ")
        .gsub("’", "'")
        .gsub(">", "")
        .gsub(/[ ]+/, " ")
        .gsub(/___[_]+/, "___")
      #unless sanitized_question.include?(sanitized_csv_question)
      #  puts "#{activity.name},#{question_number},#{sanitized_csv_question},#{sanitized_question}"
      #end

      #concepts_row = row[QUESTION_CONCEPTS_INDEX] || row[QUESTION_CONCEPTS_FALLBACK_INDEX]
      #full_concept_names = concepts_row.split(DELIMITER).reject{|concept| concept == ""}.uniq
      #level_0_concept_names = full_concept_names.map{ |name| name.split("|").last.strip }
      #level_1_concept_names = full_concept_names.map{ |name| name.split("|")[-2]&.strip }
      #level_2_concept_names = full_concept_names.map{ |name| name.split("|")[-3]&.strip }
      #level_0_concepts = level_0_concept_names.map.with_index do |name, i|
      #  concepts = Concept.where(name:, visible: true).left_outer_joins(:parent).joins("LEFT OUTER JOIN concepts AS grandparent ON parent.parent_id = grandparent.id").where.not(parent: {parent_id: nil})
      #  concepts = level_1_concept_names[i] ? concepts.where(parent: {name: level_1_concept_names[i]}) : concepts
      #  concepts = level_2_concept_names[i] ? concepts.where(grandparent: {name: level_2_concept_names[i]}) : concepts
      #  concepts
      #end.flatten
      #if (level_0_concept_names.length != level_0_concepts.length || level_0_concepts.length == 0)
      #  puts "Multiple concepts found by name" if level_0_concept_names.length < level_0_concepts.length
      #  puts "#{activity.name},#{question_number},\"#{full_concept_names.join("\n")}\",\"#{level_0_concepts.map {|concept| [concept.parent.parent.name, concept.parent.name, concept.name].join(" | ") }.join("\n")}\""
      #  count += 1
      #end

      concepts_row = row[OPTIMAL_CONCEPTS_INDEX]
      next if concepts_row.nil?

      full_concept_names = concepts_row.split(DELIMITER).reject{|concept| concept == ""}.uniq
      level_0_concept_names = full_concept_names.map{ |name| name.split("|").last.strip }
      level_1_concept_names = full_concept_names.map{ |name| name.split("|")[-2]&.strip }
      level_2_concept_names = full_concept_names.map{ |name| name.split("|")[-3]&.strip }
      level_0_concepts = level_0_concept_names.map.with_index do |name, i|
        concepts = Concept.where(name:, visible: true).left_outer_joins(:parent).joins("LEFT OUTER JOIN concepts AS grandparent ON parent.parent_id = grandparent.id").where.not(parent: {parent_id: nil})
        concepts = level_1_concept_names[i] ? concepts.where(parent: {name: level_1_concept_names[i]}) : concepts
        concepts = level_2_concept_names[i] ? concepts.where(grandparent: {name: level_2_concept_names[i]}) : concepts
        concepts
      end.flatten.compact
      if (level_0_concept_names.length != level_0_concepts.length || level_0_concepts.length == 0)
        puts "Multiple concepts found by name" if level_0_concept_names.length < level_0_concepts.length
        puts "#{activity.name},#{question_number},\"#{full_concept_names.join("\n")}\",\"#{level_0_concepts.map {|concept| [concept.parent.parent.name, concept.parent.name, concept.name].join(" | ") }.join("\n")}\""
        count += 1
      end
    end
    puts "Questions with issues count: #{count}"
  end
end
