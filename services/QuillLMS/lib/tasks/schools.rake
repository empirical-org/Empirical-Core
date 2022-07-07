# frozen_string_literal: true

require 'csv'
require 'open-uri'

# This code is taken from the Literacy Design Collaborative (ldc.org) and then modified.
def nces_grade_level_mapping(nces_grade)
  case nces_grade
  when 'PK', 'KG' then 0
  when 'M', 'N', 'UG', 'AE' then nil
  when '13' then 12
  else
    nces_grade
  end
end

def charter_value(value)
  return value.first if ['No', 'Yes'].include?(value)
end

namespace :schools do
  desc "Import schools from CSV"
  task import: :environment do

    puts "Beginning school import..."
    total_updated = 0
    total_new = 0

    CSV.foreach(open('https://assets.quill.org/data/schools.txt'),
      col_sep: "\t",
      headers: true,
      encoding: "ISO-8859-1"
    ) do |row|
      school_hash = row.to_hash
      school = School.where(nces_id: school_hash['NCESSCH']).first_or_initialize
      school.name = school_hash['SCH_NAME'].titleize
      school.phone = school_hash['PHONE']
      school.mail_street = school_hash['MSTREET1'].titleize
      school.mail_city = school_hash['MCITY'].titleize
      school.mail_state = school_hash['MSTATE']
      school.mail_zipcode = school_hash['MZIP']
      school.street = school_hash['LSTREET1'].titleize
      school.city = school_hash['LCITY'].titleize
      school.state = school_hash['LSTATE']
      school.zipcode = school_hash['LZIP']
      school.nces_type_code = school_hash['SCH_TYPE']
      school.nces_status_code = school_hash['UPDATED_STATUS']
      # school.ulocal = school_hash['ULOCAL']
      # school.longitude = school_hash['LONCOD']
      # school.latitude = school_hash['LATCOD']
      school.lower_grade = nces_grade_level_mapping(school_hash['GSLO'])
      school.upper_grade = nces_grade_level_mapping(school_hash['GSHI'])
      school.charter = charter_value(school_hash['CHARTR'])

      if school.new_record?
        total_new += 1
        puts "New: #{total_new}"
      elsif school.changed?
        total_updated += 1
        puts "Updated: #{total_updated}"
      end

      school.save!
    end

    puts "✨ Task Completed"
    puts "✨ New Schools: #{total_new}"
    puts "✨ Updated Schools: #{total_updated}"
  end

  desc 'Titleize all school name, address and other relevant data points'
  task :titleize => :environment do
    School.all.each do |school|
      school.name = school.name&.titleize
      school.mail_street = school.mail_street&.titleize
      school.mail_city = school.mail_city&.titleize
      school.street = school.street&.titleize
      school.city = school.street&.titleize
      school.save!
    end
  end

  desc 'Update Clever IDs for existing schools based on a CSV file'
  task :update_clever_ids => :environment do

    QUILL_ID_KEY = 'Quill ID'
    CLEVER_ID_KEY = 'Clever School ID'

    pipe_data = $stdin.read unless $stdin.tty?

    unless pipe_data
      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake schools:update_clever_ids < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake schools:update_clever_ids -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    ActiveRecord::Base.transaction do
      CSV.parse(pipe_data, headers: true) do |school|
        # Just in case this CleverID was once assigned to a different school
        original_id_holder = School.find_by(clever_id: school[CLEVER_ID_KEY])
        original_id_holder&.update(clever_id: nil)
        new_id_holder = School.find(school[QUILL_ID_KEY])
        new_id_holder.update!(clever_id: school[CLEVER_ID_KEY])
      end
    end
  end

  # A bit more detail here: when we did our original population of school
  # data from federal NCES data sources, NCES ID values included left-
  # padding "0"s to make them all the same length.  When we updated our
  # data in 2022 from the same federal sources, the NCES IDs were no longer
  # left-padded in the data set, so we ended up creating duplicate schools.
  # One set with leading "0"s and one without.  This task is intended to
  # move any users from the duplicates to the original schools.
  desc 'Move users assigned to duplicate schools to the original schools in prep for cleanup'
  task :reassign_users_from_duplicates => :environment do

    teachers_assigned_to_duplicates = <<-SQL
      SELECT original.id AS original_school_id,
            schools_users.id AS schools_users_id,
            schools_admins.id AS schools_admins_id
          FROM schools AS original
          JOIN schools AS duplicate
              ON original.nces_id = CONCAT('0', duplicate.nces_id)
                  OR original.nces_id = CONCAT('00', duplicate.nces_id)
          LEFT OUTER JOIN schools_admins
              ON duplicate.id = schools_admins.school_id
          LEFT OUTER JOIN schools_users
              ON duplicate.id = schools_users.school_id
    SQL

    users_updated = 0
    admins_updated = 0
    ActiveRecord::Base.connection.execute(teachers_assigned_to_duplicates).each do |row|
      ActiveRecord::Base.transaction do
        if row['schools_users_id']
          school_user = SchoolsUsers.find(row['schools_users_id'])
          school_user.update(school_id: row['original_school_id'])
          users_updated += 1
        end

        if row['schools_admins_id']
          school_admin = SchoolsAdmins.find(row['schools_admins_id'])
          school_admin.update(school_id: row['original_school_id'])
          admins_updated += 1
        end
      end
    end

    puts "Moved #{users_updated} users to the correct school."
    puts "Moved #{admins_updated} admins to the correct school."
  end

  # See not on :reassign_users_from_duplicates.  This task is intended
  # to actually remove the duplicate schools
  desc 'Clean up duplicate schools based on 0-left-padded NCES ID'
  task :clean_up_duplicates => :environment do

    schools_with_duplicates = <<-SQL
      SELECT original.id AS original_school_id,
            duplicate.id AS duplicate_school_id
          FROM schools AS original
          JOIN schools AS duplicate
              ON original.nces_id = CONCAT('0', duplicate.nces_id)
                  OR original.nces_id = CONCAT('00', duplicate.nces_id)
    SQL

    duplicate_schools_deleted = 0
    ActiveRecord::Base.connection.execute(schools_with_duplicates).each do |row|
      ActiveRecord::Base.transaction do
        duplicate = School.find(row['duplicate_school_id'])
        update_hash = duplicate.as_json.except('id', 'nces_id', 'created_at').select { |_,v| v.present? }
        School.update(row['original_school_id'], update_hash)

        duplicate.destroy!
        duplicate_schools_deleted += 1
      end
    end

    puts "Deleted #{duplicate_schools_deleted} duplicate schools."
  end
end
