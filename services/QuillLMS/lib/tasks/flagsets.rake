# frozen_string_literal: true

require 'csv'

namespace :flagsets do
  namespace :users do
    # Example usage: rake 'flagsets:users:update_flagsets_from_csv[filepath, flagset]'
    desc 'Add flagsets to users from csv'
    task :update_flagsets_from_csv, [:filepath, :flagset] => :environment do |t, args|
      iostream = File.read(args[:filepath])
      if (CSV.parse(iostream, headers: true).headers & ["email", "flagset"]).count != 2
        puts "Invalid headers. Exiting."
        exit 1
      end

      CSV.parse(iostream, headers: true) do |row|
        user = User.find_by_email(row['email'])
        if user.nil?
          puts "Unable to locate user with email #{row['email']}"
          next
        end

        user.update!(flagset: args[:flagset] || row['flagset'])
      end
    end
  end
end
