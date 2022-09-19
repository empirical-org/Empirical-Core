# frozen_string_literal: true

namespace :update_schools_with_4_digit_zipcodes do
  desc 'update schools with 4 digit zipcodes to append missing 0'
  task :run => :environment do
    School.all.each do |school|
      if school.zipcode&.length == 4
        school.zipcode = "0#{school.zipcode}"
        school.save!
      end
    end
  end
end
