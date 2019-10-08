require 'aws-s3'

namespace :leap do
  desc "Build a CSV report for LEAP schools and ship it to S3"
  task :ship_csv, [:school_id] => :environment do |_, args|
    LEAP_S3_BUCKET = 'quill-leap'
    SCHOOL_ID = args[:school_id]
    school = School.find_by!(SCHOOL_ID)
    csv_data = school.generate_leap_csv

    s3 = Aws::S3::Resource.new(region:'us-east-1')
    bucket = s3.bucket(LEAP_S3_BUCKET)
    obj = bucket.object("Data/#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.csv")
    obj.put(body: csv_data)
  end
end
