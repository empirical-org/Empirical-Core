# frozen_string_literal: true

require 'csv'

namespace :nces_sync do

  # Every year we need to run a fresh update of our data with NCES data.

  desc 'update the Districts table with data from Urban Institute database and a year, e.g. bundle exec rake nces_sync:import_districts_from_urban_institute[2022]'
  task :import_districts_from_urban_institute, [:year] => :environment do |t, args|
    SyncDistrictDataFromUrlWorker.perform_async("https://educationdata.urban.org/api/v1/school-districts/ccd/directory/#{args[:year]}/")
  end

  # I recommend running this task AFTER running the district task, in case there are new districts
  # that don't exist in our DB yet.

  desc 'update the Schools table with data from Urban Institute database and a year, e.g. bundle exec rake nces_sync:import_schools_from_urban_institute[2022]'
  task :import_schools_from_urban_institute, [:year] => [:environment] do |t, args|
    SyncSchoolDataFromUrlWorker.perform_async("https://educationdata.urban.org/api/v1/schools/ccd/directory/#{args[:year]}/")
  end

end
