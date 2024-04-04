# frozen_string_literal: true

namespace :diagnostic_question_optimal_concepts do
  DELIMITER = "\n"
  CSV_PATH = "diagnostic_question_concepts4.csv"

  DIAGNOSTIC_INDEX = 0
  QUESTION_INDEX = 2
  QUESTION_NUMBER_INDEX = 6
  OPTIMAL_CONCEPTS_INDEX = 3

  DIAGNOSTIC_ID_LOOKUP = {
    "Starter Pre" => 1663,
    "Starter Post" => 1664,
    "Intermediate Pre" => 1668,
    "Intermediate Post" => 1669,
    "Advanced Pre" => 1678,
    "Advanced Post" => 1680,
    "ELL Starter Pre" => 1161,
    "ELL Starter Post" => 1774,
    "ELL Intermediate Pre" => 1568,
    "ELL Intermediate Post" => 1814,
    "ELL Advanced Pre" => 1590,
    "ELL Advanced Post" => 1818,
    "Springboard" => 1432,
    "PreAP 1" => 1229,
    "PreAP 2" => 1230,
    "AP" => 992
  }

  desc 'Populate diagnostic_question_optimal_concepts from CSV extracted from Curriculum Notion database: https://www.notion.so/quill/f937b1cc8d2d4ed8943a36ce35dca177?v=7dd55ee1f04e4b5daf79645aae960aa1'
  task populate_from_csv: :environment do
    diagnostics = DIAGNOSTIC_ID_LOOKUP.to_h {|diagnostic_name, id| [diagnostic_name, Activity.find(id)]}

    total_count = 0
    duplicate_count = 0
    missing_concept_count = 0
    CSV.read(CSV_PATH, headers: true).each do |row|
      activity = diagnostics[row[DIAGNOSTIC_INDEX]]
      activity_questions = activity.data['questions'].filter {|d| d['questionType'] != 'titleCards' }
      question_number = row[QUESTION_NUMBER_INDEX].to_i
      question_uid = activity_questions[question_number - 1]['key']
      question = Question.find_by(uid: question_uid)
      concepts_row = row[OPTIMAL_CONCEPTS_INDEX]

      full_concept_names = concepts_row.split(DELIMITER).reject{|concept| concept == ""}.uniq
      concepts = full_concept_names.map do |concept_name|
        level0, level1, level2 = concept_name.split("|").map(&:strip).reverse
        concepts = Concept.left_outer_joins(:parent)
          .joins("LEFT OUTER JOIN concepts AS grandparent ON parent.parent_id = grandparent.id")
          .where(visible: true)
          .where.not(parent: {parent_id: nil})
        concepts = concepts.where(parent: {name: level1}) if level1
        concepts = concepts.where(grandparent: {name: level2}) if level2
        concept = concepts.where(name: level0)
        if concept.length > 1
          puts "Matched too many Concepts: #{concept_name}"
        elsif concept.length == 1
          # A number of questions are used in multiple diagnostics, but should have the same Optimal Concepts for each question.  Since each question has a row in the CSV for every diagnostic it's in, we expect to have about 50 duplicates which we can skip over
          begin
            DiagnosticQuestionOptimalConcept.create!(concept_id: concept.first.id, question_uid: question.uid)
          rescue ActiveRecord::RecordNotUnique
            duplicate_count += 1
          end
        else
          puts "Failed to find Concept: #{concept_name}"
          missing_concept_count += 1
        end
        total_count += 1
      end
    end
    puts "Total rows in CSV processed: #{total_count}"
    puts "Duplicate question + concept data rows: #{duplicate_count}"
    puts "Records with failures to match: #{missing_concept_count}"
  end

  desc "Validate the input CSV to ensure that all data that we expect to find in the LMS using the CSV is found.  This will flag cases where there's some kind of mis-match so that we can manually confirm that any discrepancies are just typos, but that the correct data is being found."
  task validate_csv_data: :environment do

    diagnostics = DIAGNOSTIC_ID_LOOKUP.to_h {|diagnostic_name, id| [diagnostic_name, Activity.find(id)]}

    questions_to_audit = []
    concepts_to_audit = []    
    CSV.read(CSV_PATH, headers: true).each do |row|
      activity = diagnostics[row[DIAGNOSTIC_INDEX]]
      questions = activity.data['questions'].filter {|d| d['questionType'] != 'titleCards' }
      question_number = row[QUESTION_NUMBER_INDEX].to_i
      question_uid = questions[question_number - 1]['key']
      question = Question.find_by(uid: question_uid)

      # Flag any cases where the question from the CSV doesn't exactly match the text of the same question number in the LMS for auditing to ensure that we're actually looking at data for the right question
      # Note: from the most recent Notion CSV there are 5 questions with discrepancies, but they're all minor typos in Notion that aren't worth dealing with.  Confirmed that all questions in Notion refer to the correct question in LMS.
      sanitized_question = question.data['prompt']
        .gsub("&#x27;", "'")
        .gsub(/<[^>]*>/,"")
        .gsub(/\./, ". ")
        .gsub(/\s+/, " ")
        .strip
      csv_question = row[QUESTION_INDEX]
      sanitized_csv_question = csv_question.gsub(/\./, ". ")
        .gsub("’", "'")
        .gsub(">", "")
        .gsub(/\s+/, " ")
        .gsub(/___[_]+/, "___")
        .strip
      unless sanitized_question.include?(sanitized_csv_question)
        questions_to_audit.push("#{activity.name},#{question_number},#{sanitized_csv_question},#{sanitized_question}")
      end

      concepts_row = row[OPTIMAL_CONCEPTS_INDEX]

      # Flag cases where recorded optimal concepts in the Notion data can not be matched to a concept in the LMS.  Some of these may be fine, but we want to ensure that every concept that does matter gets accurately matched.
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
        concepts_to_audit.push("#{activity.name},#{question_number},\"#{full_concept_names.join("\n")}\",\"#{level_0_concepts.map {|concept| [concept.parent.parent.name, concept.parent.name, concept.name].join(" | ") }.join("\n")}\"")
      end
    end
    puts questions_to_audit
    puts "========================"
    puts concepts_to_audit
  end
end
