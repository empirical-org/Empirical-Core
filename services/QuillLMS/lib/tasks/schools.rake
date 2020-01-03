require 'csv'
require 'open-uri'

# This code is taken from the Literacy Design Collaborative (ldc.org) and then modified.
def nces_grade_level_mapping(nces_grade)
  case nces_grade
  when 'PK'
      0
  when 'KG'
      0
  when 'M'
      nil
  when 'N'
      nil
  when 'UG'
      nil
  when 'AE'
      nil
  when '13'
      12
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
      school.lea_id = school_hash['LEAID']
      school.leanm = school_hash['LEA_NAME'].titleize
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
      school.leanm = school.leanm&.titleize
      school.name = school.name&.titleize
      school.mail_street = school.mail_street&.titleize
      school.mail_city = school.mail_city&.titleize
      school.street = school.street&.titleize
      school.city = school.street&.titleize
      school.save! 
    end  
  end
end
