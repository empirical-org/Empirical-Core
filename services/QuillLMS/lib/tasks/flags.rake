# frozen_string_literal: true

require 'csv'

namespace :flags do
  namespace :activities do
    desc 'Add college_board flag to all activity holders of gamma flag'
    task :add_college_board_flag_to_gamma_activities => :environment do
      ids = Activity.find_by_sql("select id from activities where flags::text[] @> ARRAY['gamma']").pluck(:id)
      puts ids
      ids.each do |id|
        activity = Activity.find(id)
        activity.update!(flags: activity.flags << 'college_board')
      end
    end
  end

  namespace :users do
    desc 'add custom flagsets for quill.org emails'
    task :add_custom_flagsets => :environment do
      college_board_ids = User.find_by_sql(
        "select id from users where email LIKE '%quill.org'"
      ).pluck(:id)
      puts ids
      ids.each do |id|
        user = User.find(id)
        user.update!(flagset: 'alpha')
      end
    end

    desc 'Add college_board flag to all holders of gamma flag'
    task :add_college_board_flag_to_gamma_users => :environment do
      ids = User.find_by_sql("select id from users where flags::text[] @> ARRAY['gamma']").pluck(:id)
      puts ids
      ids.each do |id|
        user = User.find(id)
        user.update!(flags: user.flags << 'college_board')
      end
    end

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
