# frozen_string_literal: true

namespace :diagnostic_question_optimal_concepts do
  DELIMITER = "\n"

  DIAGNOSTIC_INDEX = 0
  QUESTION_INDEX = 2
  QUESTION_NUMBER_INDEX = 6
  OPTIMAL_CONCEPTS_INDEX = 3

  DIAGNOSTIC_ID_LOOKUP = {
    'Starter Pre' => 1663,
    'Starter Post' => 1664,
    'Intermediate Pre' => 1668,
    'Intermediate Post' => 1669,
    'Advanced Pre' => 1678,
    'Advanced Post' => 1680,
    'ELL Starter Pre' => 1161,
    'ELL Starter Post' => 1774,
    'ELL Intermediate Pre' => 1568,
    'ELL Intermediate Post' => 1814,
    'ELL Advanced Pre' => 1590,
    'ELL Advanced Post' => 1818,
    'Springboard' => 1432,
    'PreAP 1' => 1229,
    'PreAP 2' => 1230,
    'AP' => 992
  }

  desc 'Populate diagnostic_question_optimal_concepts from CSV extracted from Curriculum Notion database: https://www.notion.so/quill/f937b1cc8d2d4ed8943a36ce35dca177?v=7dd55ee1f04e4b5daf79645aae960aa1'
  task populate_from_csv: :environment do
    include SeedDiagnosticQuestionOptimalConcepts

    total_count = 0
    invalid_questions = 0
    invalid_concepts = 0
    duplicate_count = 0
    missing_concept_count = 0
    CSV.parse(pipe_data, headers: true).each do |row|
      unless question_valid?(row)
        puts "Invalid question: #{diagnostics[row[DIAGNOSTIC_INDEX]]}, question #{row[QUESTION_NUMBER_INDEX]}"
        invalid_questions += 1
        next
      end

      unless concepts_valid?(row)
        puts "Concepts not fully matched in LMS: #{row[OPTIMAL_CONCEPTS_INDEX]}"
        invalid_concepts += 1
        next
      end

      question = fetch_question_from_row(row)
      concepts_row = row[OPTIMAL_CONCEPTS_INDEX]

      full_concept_names = concepts_row.split(DELIMITER).reject { |concept| concept == '' }.uniq
      concepts = full_concept_names.map do |concept_name|
        concept = fetch_concept(concept_name)
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
    puts "Questions not processed due to LMS mismatch: #{invalid_questions}"
    puts "Questions not processed due to Concept mismatch in LMS: #{invalid_concepts}"
  end

  module SeedDiagnosticQuestionOptimalConcepts
    def diagnostics = DIAGNOSTIC_ID_LOOKUP.transform_values { |id| Activity.find(id) }

    def pipe_data
      @pipe_data ||= $stdin.read unless $stdin.tty?

      return @pipe_data if @pipe_data

      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake diagnostic_question_optimal_concepts:validate_csv_data < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake diagnostic_question_optimal_concepts:validate_csv_data -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    def fetch_concept(concept_name)
      level0, level1, level2 = concept_name.split('|').map(&:strip).reverse
      concepts = Concept.left_outer_joins(:parent)
        .joins('LEFT OUTER JOIN concepts AS grandparent ON parent.parent_id = grandparent.id')
        .where(visible: true)
        .where.not(parent: { parent_id: nil })
      concepts = concepts.where(parent: { name: level1 }) if level1
      concepts = concepts.where(grandparent: { name: level2 }) if level2
      concepts.where(name: level0)
    end

    def fetch_question_from_row(row)
      activity = diagnostics[row[DIAGNOSTIC_INDEX]]
      # Filter out titleCards from the questions array
      activity_questions = activity.data['questions'].filter { |d| d['questionType'] != 'titleCards' }
      question_number = row[QUESTION_NUMBER_INDEX].to_i
      # Use -1 to go from 1-indexed data in the CSV to 0-indexed data in the database
      question_uid = activity_questions[question_number - 1]['key']
      Question.find_by(uid: question_uid)
    end

    def sanitize_question(question)
      question
        .gsub('&#x27;', "'")
        .gsub('’', "'")
        .gsub(/<[^>]*>/, '')
        .gsub(/\./, '. ')
        .gsub(/\s+/, ' ')
        .gsub(/_[_]+/, '___')
        .strip
    end

    def question_valid?(row)
      question = fetch_question_from_row(row)

      sanitize_question(question.prompt) == sanitize_question(row[QUESTION_INDEX])
    end

    def concepts_valid?(row)
      concepts_row = row[OPTIMAL_CONCEPTS_INDEX]

      full_concept_names = concepts_row.split(DELIMITER).reject { |concept| concept == '' }.uniq
      concepts = full_concept_names.map { |concept_name| fetch_concept(concept_name) }.flatten

      full_concept_names.length == concepts.length
    end
  end
end
