# frozen_string_literal: true

require "csv"

namespace :nces_sync do

  # Every year we need to run a fresh update of our data with NCES data.

  desc 'update the Districts table with data from Urban Institute database and a year, e.g. bundle exec rake nces_sync:import_districts_from_urban_institute[2022]'
  task :import_districts_from_urban_institute, [:year] => :environment do |t, args|
    get_districts_from_url("https://educationdata.urban.org/api/v1/school-districts/ccd/directory/#{args[:year]}/")
  end

  def get_districts_from_url(url)
    response = HTTParty.get(url).parsed_response
    districts_data = response['results']

    districts_data.each do |district_data|
      attributes_hash = {
        name: district_data["lea_name"].titleize,
        nces_id: district_data["leaid"].to_i,
        city: district_data["city_location"],
        state: district_data["state_location"],
        zipcode: district_data["zip_location"],
        phone: district_data["phone"],
        total_schools: district_data["number_of_schools"],
        total_students: district_data["enrollment"],
        grade_range: "#{district_data['lowest_grade_offered']} - #{district_data['highest_grade_offered']}"
      }

      district = District.find_by(nces_id: attributes_hash[:nces_id])

      if district.present?
        district.update!(attributes_hash)
      else
        District.create!(attributes_hash)
      end

      puts "updated district #{district_data['lea_name']}"
    end

    if response['next']
      get_districts_from_url(response['next'])
    end
  end

  # I recommend running this task AFTER running the district task, in case there are new districts
  # that don't exist in our DB yet.

  desc 'update the Schools table with data from Urban Institute database and a year, e.g. bundle exec rake nces_sync:import_schools_from_urban_institute[2022]'
  task :import_schools_from_urban_institute, [:year] => [:environment] do |t, args|
    get_schools_from_url("https://educationdata.urban.org/api/v1/schools/ccd/directory/#{args[:year]}/")
  end

  def get_schools_from_url(url)
    response = HTTParty.get(url).parsed_response
    schools_data = response['results']

    schools_data.each do |school_data|
      attributes_hash = {
        name: school_data["school_name"].titleize,
        nces_id: school_data["ncessch_num"],
        street: school_data["street_location"].titleize,
        city: school_data["city_location"].titleize,
        state: school_data["state_location"],
        zipcode: school_data["zip_location"],
        phone: school_data["phone"],
        mail_street: school_data["street_mailing"].titleize,
        mail_city: school_data["city_mailing"].titleize,
        mail_state: school_data["state_mailing"].strip,
        mail_zipcode: school_data["zip_mailing"],
        nces_type_code: school_data["school_type"],
        nces_status_code: school_data["school_status"],
        magnet: school_data["magnet"],
        charter: school_data["charter"],
        longitude: school_data["longitude"].to_f,
        latitude: school_data["latitude"].to_f,
        ulocal: school_data["urban_centric_locale"],
        fte_classroom_teacher: school_data["teachers_fte"].to_i,
        free_lunches: school_data["enrollment"].to_i > 0 ? (school_data["free_or_reduced_price_lunch"].to_i / school_data["enrollment"].to_f * 100).to_i : nil, # we receive free_or_reduced_price_lunch as an integer but want to store it as a percentage
        total_students: school_data["enrollment"]
      }

      district = District.find_by(nces_id: school_data['leaid'].to_i)
      attributes_hash[:district_id] = district&.id

      school = School.find_by(nces_id: attributes_hash[:nces_id])
      if school.present?
        school.update!(attributes_hash.except(:name))
      else
        School.create!(attributes_hash)
      end

      puts "updated school #{attributes_hash[:name]}"
    end

    if response['next']
      get_schools_from_url(response['next'])
    end
  end

end
