# frozen_string_literal: true

require 'csv'

namespace :plagiarized_responses do

  desc "Reads a csv of responses and returns a csv with plagiarized responses filtered out"

  task :filter, [:passage, :responses] => :environment do |t, args|
    passage_file_path = args[:passage]
    response_csv = args[:responses]

    passage_file = File.open(passage_file_path)
    passage_text = passage_file.read.chomp

    responses_table = CSV.parse(File.read(response_csv), headers: true)
    optimal_file = "filtered_responses.csv"
    plagiarized_file = "plagiarized_responses.csv"
    CSV.open(plagiarized_file, 'w', write_headers: true, headers: responses_table.headers) do |plagiarized_writer|
      CSV.open(optimal_file, 'w', write_headers: true, headers: responses_table.headers) do |writer|
        responses_table.each do |row|
          response_text = row[0]
          plagiarism_check = Evidence::PlagiarismCheck.new(response_text, passage_text, "")
          if plagiarism_check.optimal?
            writer << row
          else
            plagiarized_writer << row
          end
        end
      end
    end
  end

  desc "Reads a CSV of historical responses and applies theoretical plagiarism algorithms to them, then outputs the responses and those plagiarism results into a new CSV for comparison"

  # Intended to operate on data generated via the following query:
  # SELECT comprehension_prompts.text, entry, feedback_text, feedback_type, comprehension_plagiarism_texts.text AS plagiarism_text
  # FROM feedback_histories
  # JOIN comprehension_prompts
  #     ON feedback_histories.prompt_id = comprehension_prompts.id
  # JOIN comprehension_prompts_rules
  #     ON feedback_histories.prompt_id = comprehension_prompts_rules.prompt_id
  # JOIN comprehension_plagiarism_texts
  #     ON comprehension_prompts_rules.rule_id = comprehension_plagiarism_texts.rule_id

  task :test, [:input_csv_path] => :environment do |t, args|

    # Derived from lib/evidence/evidence/plagiarism_check.rb 'match_entry_on_passage'
    def minimum_edit_distance_per_slice(entry, plagiarism_text)
      match_minimum = 10
      shortest_distance_we_care_about = 3

      entry_arr = entry.gsub(/[[:punct:]]/, '').downcase.split
      plagiarism_arr = plagiarism_text.gsub(/[[:punct:]]/, '').downcase.split

      slices = entry_arr.each_cons(match_minimum).map { |slice| slice.join(' ') }
      plagiarism_slices = plagiarism_arr.each_cons(match_minimum).map { |slice| slice.join(' ') }
      min_distance = nil
      slices.each do |slice|
        plagiarism_slices.each do |pslice|
          min_distance = DidYouMean::Levenshtein.distance(slice, pslice)
          return min_distance if min_distance <= shortest_distance_we_care_about
        end
      end
      min_distance
    end

    input = CSV.read(args[:input_csv_path], headers: true)
    output_file_path = args[:input_csv_path].sub('.csv', '.result.csv')
    output_headers = input.headers + ['Plagiarism Feedback', '3 Character Difference', '5 Character Difference', '3 and 5 Match?']
    start = Time.current
    CSV.open(output_file_path, 'w', write_headers: true, headers: output_headers) do |output|
      input.each do |row|
        row['Plagiarism Feedback'] = (row['feedback_type'] == 'plagiarism')
        row['3 Character Difference'] = false
        row['5 Character Difference'] = false
        row['3 and 5 Match?'] = true
        closest_plagiarism = minimum_edit_distance_per_slice(row['entry'], row['plagiarism_text'])
        unless closest_plagiarism.nil?
          row['3 Character Difference'] = (closest_plagiarism <= 3)
          row['5 Character Difference'] = (closest_plagiarism <= 5)
          row['3 and 5 Match?'] = (closest_plagiarism <= 3) == (closest_plagiarism <= 5)
        end
        output << row
      end
    end
    stop = Time.current
    puts stop - start
  end
end
