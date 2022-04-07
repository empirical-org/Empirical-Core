# frozen_string_literal: true

require 'csv'

namespace :flags do
  namespace :users do
    desc 'Update User.flags from a CSV file'
    task :update_from_csv, [:filepath] => :environment do |t, args|
      iostream = File.read(args[:filepath])
      if (CSV.parse(iostream, headers: true).headers & ["email", "flag"]).count != 2
        puts "Invalid headers. Exiting."
        exit 1
      end

      CSV.parse(iostream, headers: true) do |row|
        user = User.find_by_email(row['email'])
        if user.nil?
          puts "Unable to locate user with email #{row['email']}"
          next
        end

        next if user.flags.include?(row['flag'])

        user.flags.append(row['flag'])
        user.save!
      end
    end

    desc 'remove specified flag for users from a CSV file'
    task :remove_from_csv, [:filepath, :flag_name] => :environment do |t, args|
      iostream = File.read(args[:filepath])
      if (CSV.parse(iostream, headers: true).headers & ['id']).count != 1
        puts "Invalid headers. Exiting."
        exit 1
      end

      CSV.parse(iostream, headers: true) do |row|
        user = User.find_by_id(row['id'])
        if user.nil?
          puts "Unable to locate user with id #{row['id']}"
          next
        end

        user.update!(flags: user.flags - [args[:flag_name]])
      end
    end

  end
end
