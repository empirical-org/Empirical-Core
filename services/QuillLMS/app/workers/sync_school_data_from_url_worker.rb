# frozen_string_literal: true

class SyncSchoolDataFromUrlWorker
  include Sidekiq::Worker

  def perform(url)
    response = HTTParty.get(url).parsed_response

    if response['next']
      SyncSchoolDataFromUrlWorker.perform_async(response['next'])
    end

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
        free_lunches: school_data["enrollment"].to_i > 0 ? (school_data["free_or_reduced_price_lunch"].to_i / school_data["enrollment"].to_f * 100).to_i : nil, # we receive free_or_reduced_price_lunch as an integer but want to store it as a percentage,
        direct_certification: school_data["enrollment"].to_i > 0 ? (school_data["direct_certification"].to_i / school_data["enrollment"].to_f * 100).to_i : nil, # we receive direct_certification as an integer but want to store it as a percentage
        total_students: school_data["enrollment"],
      }

      district = District.find_by(nces_id: school_data['leaid'].to_i)
      attributes_hash[:district_id] = district&.id

      school = School.find_by(nces_id: attributes_hash[:nces_id])
      if school.present?
        school.update!(attributes_hash.except(:name))
      else
        School.create!(attributes_hash)
      end
    end
  end
end
