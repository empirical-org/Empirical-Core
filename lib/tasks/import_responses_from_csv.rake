require 'csv'

namespace :responses_csv do
  task :import => :environment do
    import_from_db_csv
  end

  def import_from_db_csv 
    File.open('../../../Desktop/responses.csv', 'r') do |file|
      csv = CSV.new(file)
      csv.shift
      sum = 0
      rows = []
      columns = ["id","uid","parent_id","parent_uid","question_uid","author","text","feedback","count","first_attempt_count","child_count","optimal","weak","concept_results","created_at","updated_at"]
      while row = csv.shift
        rows.push row

        if rows.length == 1000
          begin

            Response.transaction do
              Response.import columns, rows, validate: false;0
            end;0

          rescue ActiveRecord::RecordNotUnique
          end
          rows = []
        end
      end
    end
  end
end