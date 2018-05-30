require "csv"

namespace :free_lunch do
  desc 'update free lunch column in schools'
  task :parse => :environment do
    CsvParser::parse_csv
  end

  module CsvParser

    def self.parse_csv
      file = File.expand_path('../lunch_column.csv', __FILE__)
      puts 'Rake task beginning'
      CSV.foreach(file, headers: true) do |row|
        insert_free_lunch_data(row)
      end
      puts 'Rake task completed'
    end

    def self.insert_free_lunch_data(row)
      n_id = santize_nces_id(row["NCESSCH"])
      school = School.find_by(nces_id: n_id)
      school.try {update(free_lunches: row["free_lunches"].to_i)}
    end

    def self.santize_nces_id(n_id)
      n_id.prepend('0') if n_id.length == 11
      n_id
    end

  end

end
