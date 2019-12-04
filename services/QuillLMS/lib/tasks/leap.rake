require 'csv'

namespace :leap do
  desc "Import LEAP District ID values from a CSV"
  task :import, [:csv_path] => :environment do |_, args|
    if !args[:csv_path]
      puts('You must provide a path to the csv file you want to process')
      puts('Example usage:')
      puts('  rake leap:import_data[lee-elementary-leap-district-ids.csv]')
      exit
    end

    GOOGLE_ID_COLUMN_NAME = "Google ID"
    DISTRICT_ID_COLUMN_NAME = "District ID"
    EMAIL_DOMAIN = "cps.edu"
    ID_SOURCE = ThirdPartyUserId::SOURCES::LEAP

    data = CSV.read(args[:csv_path], headers:true)
    data.each do |row|
      email = "#{row[GOOGLE_ID_COLUMN_NAME].strip}@#{EMAIL_DOMAIN}".downcase
      user = User.find_by(email: email)
      if !user
        puts "Could not find user with email #{email}"
      else
        district_id = ThirdPartyUserId.find_or_create_by(user: user,
                                                         source: ID_SOURCE)
        district_id.third_party_id = row[DISTRICT_ID_COLUMN_NAME].strip
        district_id.save! 
      end
    end
  end
end
