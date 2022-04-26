# frozen_string_literal: true

require "csv"

namespace :nces_sync do

  # Every year we need to run a fresh update of our data with NCES data.

  # To run a fresh update:

  # 1. Go to the NCES website here: https://nces.ed.gov/ccd/elsi/
  # 2. On the NCES website, click "Public School District Directory"
  # 3. On the table field selector, select all the fields corresponding to the fields on our Districts table (name, nces id, state, etc.).
  # 4. Download the NCES table as a csv.
  # 5. Save the NCES csv in lib/data and change the column names to match the column headers in this task.
  # 6. Make sure data looks clean (no leading or trailing description rows, NCES ID column contains only integers).
  # 6. Pass the file path of the csv into this task and run it.

  desc 'update the Districts table with data from a csv e.g. bundle exec rake nces_sync:import_districts[2021_nces_districts.csv]'
  task :import_districts, [:data_file] => [:environment] do |t, args|
    file = File.read("lib/data/#{args[:data_file]}")

    ActiveRecord::Base.transaction do
      CSV.parse(file, headers: true) do |row|
        attributes_hash = {
          name: row["District Name"].titleize,
          nces_id: row["NCES ID"],
          city: row["City"].titleize,
          state: row["State"],
          zipcode: row["Zip"],
          phone: row["Phone"],
          total_schools: row["Total Schools"],
          total_students: row["Total Students"],
          grade_range: "#{row['Lowest Grade Offered']} - #{row['Highest Grade Offered']}"
        }

        district = District.where("lower(name) = ?", attributes_hash[:name].downcase).first
        if district.present?
          district.update!(attributes_hash)
        else
          District.create!(attributes_hash)
        end

        puts "updated district #{row['District Name']}"
      end
    end
  end

  # I recommend running this task AFTER running the district task, in case there are new districts
  # that don't exist in our DB yet.

  # To run a fresh update:

  # 1. Go to the NCES website here: https://nces.ed.gov/ccd/elsi/
  # 2. On the NCES website, click "Public School Directory"
  # 3. On the table field selector, select all the fields corresponding to the fields on our Schools table (name, nces id, state, etc.).
  # 4. Download the NCES table as a csv.
  # 5. Save the NCES csv in lib/data and change the column names to match the column headers in this task.
  # 6. Make sure data looks clean (no leading or trailing description rows, NCES ID column contains only integers).
  # 6. Pass the file path of the csv into this task and run it.

  desc 'update the Schools table with data from a csv e.g. bundle exec rake nces_sync:import_schools[2021_nces_schools.csv]'
  task :import_schools, [:data_file] => [:environment] do |t, args|
    file = File.read("lib/data/#{args[:data_file]}")

    ActiveRecord::Base.transaction do
      CSV.parse(file, headers: true) do |row|
        attributes_hash = {
          name: row["School Name"].titleize,
          nces_id: row["NCES ID"].to_i,
          city: row["City"].titleize,
          state: row["State"].strip,
          zipcode: row["Zip"],
          phone: row["Phone"],
          mail_street: row["Mailing Street"],
          mail_city: row["Mailing City"],
          mail_state: row["Mailing State"].strip,
          mail_zipcode: row["Mailing Zip"],
          street: row["Street"],
          nces_type_code: CSVHelper.clean_string(row["School Type"]),
          nces_status_code: CSVHelper.clean_string(row["Status"]),
          magnet: CSVHelper.clean_string(row["Magnet"]),
          charter: CSVHelper.clean_string(row["Charter"]),
          longitude: row["Longitude"].to_f,
          latitude: row["Latitude"].to_f,
          ulocal: CSVHelper.clean_string(row["Locale"]).to_i,
          fte_classroom_teacher: row["FTE Teachers"].to_i,
          free_lunches: row["Total Students"].to_i > 0 ? row["Free Lunch"].to_i / row["Total Students"].to_i : nil,
          total_students: row["Total Students"].to_i
        }

        district = District.find_by(nces_id: row["District NCES ID"])
        attributes_hash[:district_id] = district&.id

        school = School.find_by(nces_id: row["NCES ID"])
        if school.present?
          school.update!(attributes_hash.except(:name))
        else
          School.create!(attributes_hash)
        end

        puts "updated school #{row['School Name']}"
      end
    end
  end

  module CSVHelper
    def self.clean_string(string)
      string.split("-")[0]
    end
  end
end
