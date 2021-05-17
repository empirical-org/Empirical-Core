# require 'zip'
# require 'csv'
# require 'open-uri'
# require 'httparty' # when you httparty, you must party hard!
# require 'bigdecimal'
# require 'bigdecimal/util'

# URL_OF_ZIPPED_CSV = 'https://assets.quill.org/data/private_schools.csv.zip'
# TMPFILE_PATH = Dir::Tmpname.make_tmpname 'tmp/', nil

# def select_proper_grade(input)
#   case input
#   when '1'
#     return 0
#   when '2'
#     return 0
#   when '3'
#     return 0
#   when '4'
#     return 0
#   when '5'
#     return 1
#   else
#     return input.to_i - 5
#   end
# end

# def exit_task
#   puts "All done!"
#   puts "Here's how many schools with PPINs there are now: #{School.where.not(ppin: nil).count}"
#   exit
# end

# namespace :private_schools do
#   desc 'Import all of the private schools data from CSV'
#   task :import => :environment do
#     puts "The task is beginning!"
#     puts "Here's how many schools with PPINs there were before: #{School.where.not(ppin: nil).count}"
#     zipfile = Tempfile.new
#     zipfile.binmode
#     zipfile.write(HTTParty.get(URL_OF_ZIPPED_CSV).body)
#     zipfile.close
#     Zip::File.open(zipfile.path) do |unzipped_file|
#       unzipped_file.each do |csv|
#         exit_task if File.file?(TMPFILE_PATH)
#         csv.extract(TMPFILE_PATH)
#         CSV.foreach(open(TMPFILE_PATH, 'r')) do |row|
#           next if School.where(ppin: row[0]).any?
#           school = School.new
#           school.ppin = row[0]
#           school.name = row[1]
#           school.mail_street = row[2]
#           school.mail_city = row[3]
#           school.mail_state = row[4]
#           school.mail_zipcode = row[5]
#           school.street = row[6]
#           school.city = row[7]
#           school.state = row[8]
#           school.zipcode = row[9]
#           school.ulocal = row[10].to_i
#           school.latitude = row[11].to_d
#           school.longitude = row[12].to_d
#           school.lower_grade = select_proper_grade(row[13])
#           school.upper_grade = select_proper_grade(row[14])
#           school.school_level = row[15]
#           school.total_students = row[16].to_i
#           school.fte_classroom_teacher = row[17].to_i
#           school.save!
#         end
#       end
#     end
#     exit_task
#   end
# end
