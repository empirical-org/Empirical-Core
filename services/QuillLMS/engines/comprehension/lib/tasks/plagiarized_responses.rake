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
          plagiarism_check = Comprehension::PlagiarismCheck.new(response_text, passage_text, "")
          if plagiarism_check.optimal?
            writer << row
          else
            plagiarized_writer << row
          end
        end
      end
    end
  end
end
