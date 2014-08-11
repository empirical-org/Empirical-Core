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
    else
      nces_grade
  end
end

namespace :schools do
  desc "Import schools from CSV"
  task import: :environment do

    puts "Beginning school import..."
    total_imported = 0

    CSV.foreach( open('https://s3.amazonaws.com/ldc-seeds/schools/SCH11_pre.txt'),
      :col_sep => "\t",
      :headers => true,
      :encoding => "ISO-8859-1" ) do |row|
        sh = row.to_hash
        school = School.where(nces_id: sh['NCESSCH'], lea_id: sh['LEAID']).first_or_initialize
        school.leanm = sh['LEANM'].titleize
        school.name = sh['SCHNAM'].titleize
        school.phone = sh['PHONE']
        school.mail_street = sh['MSTREE'].titleize
        school.mail_city = sh['MCITY'].titleize
        school.mail_state = sh['MSTATE']
        school.mail_zipcode = sh['MZIP']
        school.street = sh['LSTREE'].titleize
        school.city = sh['LCITY'].titleize
        school.state = sh['LSTATE']
        school.zipcode = sh['LZIP']
        school.nces_type_code = sh['TYPE']
        school.nces_status_code = sh['STATUS']
        school.ulocal = sh['ULOCAL']
        school.longitude = sh['LONCOD']
        school.latitude = sh['LATCOD']
        school.lower_grade = nces_grade_level_mapping(sh['GSLO'])
        school.upper_grade = nces_grade_level_mapping(sh['GSHI'])
        school.charter = sh['CHARTR']

        school.save!

        total_imported += 1
        puts "Imported #{total_imported}..." if total_imported % 1000 == 0
    end

    puts "Finished importing #{total_imported} schools."
  end
end
