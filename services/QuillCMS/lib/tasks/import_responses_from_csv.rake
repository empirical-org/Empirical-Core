require 'csv'

namespace :responses_csv do

  # e.g. rake responses_csv:import['/Users/danieldrabik/code/data_files/responses.csv']
  desc 'import a csv file of production response data into your local DB for testing'
  task :import, [:file_path] => :environment do |task, args|
    import_from_db_csv(args[:file_path])
  end

  def import_from_db_csv(filepath_to_import)
    File.open(filepath_to_import, 'r') do |file|
      csv = CSV.new(file)
      csv.shift
      sum = 0
      rows = []
      columns = ["uid","parent_id","parent_uid","question_uid","author","text","feedback","count","first_attempt_count","child_count","optimal","weak","concept_results","created_at","updated_at","spelling_error"]
      while row = csv.shift
        # replace "NULL" with nil
        # remove the first (id) column, since the auto-increment of the local DB should be used
        cleaned_row = row.map {|value| value == "NULL" ? nil : value}.drop(1)

        rows.push cleaned_row

        if rows.length == 1000
          begin
            Response.transaction do
              Response.import columns, rows, validate: false;0
            end;0
          rescue ActiveRecord::RecordNotUnique
            nil
          end
          rows = []
        end
      end
    end
  end
end
