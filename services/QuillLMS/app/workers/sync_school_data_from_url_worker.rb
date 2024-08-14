# frozen_string_literal: true

class SyncSchoolDataFromUrlWorker
  include Sidekiq::Worker

  NCES_ID_TYPE_COERCION_QUERY = "CAST(CASE WHEN nces_id ~ '^[0-9]+$' THEN nces_id ELSE '0' END AS BIGINT) = ?"

  def perform(url)
    response = HTTParty.get(url).parsed_response

    schools_data = response['results']

    schools_data.each do |school_data|
      attributes_hash = build_attribute_hash(school_data)

      district = District.find_by(nces_id: school_data['leaid'].to_i)
      attributes_hash[:district_id] = district&.id

      # we have to do this complicated search because historically nces ids, which are largely but not always numerals stored as strings in our database, have sometimes been stored with leading zeroes and sometimes without
      # this type coercion ensures that we'll find the matching one no matter what

      nces_id = attributes_hash[:nces_id]

      school = School.find_by(nces_id:) || School.find_by(NCES_ID_TYPE_COERCION_QUERY, nces_id)
      school.present? ? school.update!(attributes_hash.except(:name)) : School.create!(attributes_hash)
    end

    SyncSchoolDataFromUrlWorker.perform_async(response['next']) if response['next']
  end

  def build_attribute_hash(school_data)
    enrollment = school_data['enrollment']
    free_or_reduced_price_lunch = school_data['free_or_reduced_price_lunch']
    direct_certification = school_data['direct_certification']

    {
      name: school_data['school_name'].titleize,
      nces_id: school_data['ncessch_num'],
      street: school_data['street_location'].titleize,
      city: school_data['city_location'].titleize,
      state: school_data['state_location'],
      zipcode: school_data['zip_location'],
      phone: school_data['phone'],
      mail_street: school_data['street_mailing'].titleize,
      mail_city: school_data['city_mailing'].titleize,
      mail_state: school_data['state_mailing'].strip,
      mail_zipcode: school_data['zip_mailing'],
      nces_type_code: school_data['school_type'],
      nces_status_code: school_data['school_status'],
      magnet: school_data['magnet'],
      charter: school_data['charter'],
      longitude: school_data['longitude'].to_f,
      latitude: school_data['latitude'].to_f,
      ulocal: school_data['urban_centric_locale'],
      fte_classroom_teacher: school_data['teachers_fte'].to_i,
      free_lunches: free_or_reduced_price_lunch && enrollment.to_i > 0 ? (free_or_reduced_price_lunch.to_i / enrollment.to_f * 100).to_i : nil,
      direct_certification: direct_certification && enrollment.to_i > 0 ? (direct_certification.to_i / enrollment.to_f * 100).to_i : nil,
      total_students: enrollment
    }
  end
end
