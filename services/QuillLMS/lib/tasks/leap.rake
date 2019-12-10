require 'open-uri'
require 'csv'

namespace :leap do
  desc "Import LEAP District ID values from a CSV piped to the command"
  task :import_from_pipe, [:email_domain] => :environment do |_, args|
    include LeapTaskHelpers
    set_arg_values(args)

    pipe_data = STDIN.read unless STDIN.tty?

    if !@EMAIL_DOMAIN or !pipe_data
      puts('You must pipe the csv data you want to process and provide the email domain to use to identify users')
      puts('Example usage:')
      puts('  cat lee-elementary-leap-district-ids.csv | rake leap:import_from_pipe[cps.edu]')
      exit
    end

    data = CSV.parse(pipe_data, headers:true)
    process_data(data)
  end

  desc "Import LEAP District ID values from a CSV"
  task :import, [:csv_path, :email_domain] => :environment do |_, args|
    include LeapTaskHelpers
    set_arg_values(args)

    if !@CSV_PATH || !@EMAIL_DOMAIN
      puts('You must provide a path to the csv file you want to process and the email domain to use to identify users')
      puts('Example usage:')
      puts('  rake leap:import[lee-elementary-leap-district-ids.csv,cps.edu]')
      exit
    end

    data = CSV.new(open(args[:csv_path]), headers:true)
    process_data(data)
  end

  module LeapTaskHelpers

    def set_arg_values(args)
      @EMAIL_DOMAIN = args[:email_domain]
      @CSV_PATH = args[:csv_path]
      @GOOGLE_ID_COLUMN_NAME = "Google ID"
      @DISTRICT_ID_COLUMN_NAME = "District ID"
      @EMAIL_DOMAIN = @EMAIL_DOMAIN
      @ID_SOURCE = ThirdPartyUserId::SOURCES::LEAP
    end

    def process_data(data)
      data.each do |row|
        process_row(row)
      end
    end

    def process_row(row)
      email = "#{row[@GOOGLE_ID_COLUMN_NAME].strip}@#{@EMAIL_DOMAIN}".downcase
      user = User.find_by(email: email)
      if !user
        puts "Could not find user with email #{email}"
      else
        district_id = ThirdPartyUserId.find_or_create_by(user: user,
                                                         source: @ID_SOURCE)
        district_id.third_party_id = row[@DISTRICT_ID_COLUMN_NAME].strip
        district_id.save! 
      end
    end
  end
end
