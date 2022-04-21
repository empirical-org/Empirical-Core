# frozen_string_literal: true

require "csv"

namespace :import_districts do
  desc 'update the Districts table with data from 2 csvs, the general data csv and the demographic data csv, e.g. bundle exec rake import_districts:import[nces_district_data.csv,nces_district_demographics_data.csv]'
  task :import, [:general_data, :demographic_data] => [:environment] do |t, args|
    general_file = File.read("lib/data/#{args[:general_data]}")
    demographic_file = File.read("lib/data/#{args[:demographic_data]}")

    ActiveRecord::Base.transaction do
      CSV.parse(general_file, headers: true) do |row|
        attributes_hash = {
          name: row["LEA_NAME"],
          nces_id: row["LEAID"],
          city: row["MCITY"],
          state: row["MSTATE"],
          zipcode: row["MZIP"],
          phone: row["PHONE"]
        }

        district = District.find_or_create_by(name: attributes_hash[:name])
        district.update!(attributes_hash)
      end

      CSV.parse(demographic_file, headers: true) do |row|
        attributes_hash = {
          total_schools: row["Total Schools"],
          total_students: row["Total Students"],
          grade_range: "#{row["Lowest Grade Offered"]} - #{row["Highest Grade Offered"]}"
        }

        district = District.find_by(nces_id: row["NCES ID"])
        district&.update!(attributes_hash)
      end
    end

  end

end
