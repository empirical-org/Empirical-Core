# frozen_string_literal: true

require 'csv'

namespace :leap do
  desc "Import LEAP District ID values from a CSV piped to the command"
  task :import_from_pipe, [:email_domain] => :environment do |_, args|
    include LeapTaskHelpers
    arg_values(args)

    pipe_data = $stdin.read unless $stdin.tty?

    if !@email_domain || !pipe_data
      puts('You must pipe the csv data you want to process and provide the email domain to use to identify users')
      puts('Example usage:')
      puts('  cat lee-elementary-leap-district-ids.csv | rake leap:import_from_pipe[cps.edu]')
      exit
    end

    data = CSV.parse(pipe_data, headers: true)
    process_data(data)
  end

  desc "Import LEAP District ID values from a CSV"
  task :import, [:csv_path, :email_domain] => :environment do |_, args|
    include LeapTaskHelpers
    arg_values(args)

    if !@csv_path || !@email_domain
      puts('You must provide a path to the csv file you want to process and the email domain to use to identify users')
      puts('Example usage:')
      puts('  rake leap:import[lee-elementary-leap-district-ids.csv,cps.edu]')
      exit
    end

    begin
      file = File.open(@csv_path)
    rescue Errno::ENOENT
      begin
        file = URI.parse(@csv_path).open
      rescue OpenURI::HTTPError
        puts("Could not find a valid local file or public URL for #{@csv_path}")
        exit 1
      end
    end

    data = CSV.new(file, headers: true)
    process_data(data)
  end

  module LeapTaskHelpers

    def arg_values(args)
      @email_domain = args[:email_domain]
      @csv_path = args[:csv_path]
      @google_id_column_name = "Google ID"
      @district_id_column_name = "District ID"
      @id_source = ThirdPartyUserId::SOURCES::LEAP
    end

    def process_data(data)
      data.each do |row|
        process_row(row)
      end
    end

    def process_row(row)
      email = "#{row[@google_id_column_name].strip}@#{@email_domain}".downcase
      user = User.find_by(email: email)
      if user
        district_id = ThirdPartyUserId.find_or_create_by(user: user,
                                                         source: @id_source)
        district_id.third_party_id = row[@district_id_column_name].strip
        district_id.save!
      else
        puts "Could not find user with email #{email}"
      end
    end
  end
end
