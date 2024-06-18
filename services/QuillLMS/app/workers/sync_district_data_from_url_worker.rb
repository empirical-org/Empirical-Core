# frozen_string_literal: true

class SyncDistrictDataFromUrlWorker
  include Sidekiq::Worker

  def perform(url)
    response = HTTParty.get(url).parsed_response

    if response['next']
      SyncDistrictDataFromUrlWorker.perform_async(response['next'])
    end

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
      
    end
  end
end
