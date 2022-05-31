# frozen_string_literal: true

class UploadLeapReportWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  LEAP_S3_BUCKET = 'quill-leap'
  AWS_ACCESS_KEY_ID = ENV['AWS_UPLOADS_ACCESS_KEY_ID']
  AWS_SECRET_ACCESS_KEY = ENV['AWS_UPLOADS_SECRET_ACCESS_KEY']

  def perform(school_id)
    school = School.find(school_id)
    csv_data = school.generate_leap_csv(current_academic_year_start)
    upload_data_to_s3(csv_data)
  end

  def upload_data_to_s3(csv_data)
    s3 = Aws::S3::Resource.new(
      credentials: Aws::Credentials.new(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY),
      region: 'us-east-1'
    )
    bucket = s3.bucket(LEAP_S3_BUCKET)
    obj = bucket.object("Data/#{Time.current.strftime('%Y-%m-%d_%H-%M-%S')}.csv")
    obj.put(body: csv_data, content_type: "text/csv")
  end

  private def current_academic_year_start
    # We use August 1 as a weak proxy for "start of school year"
    now = Date.current
    year = now.month >= 8 ? now.year : now.year - 1
    Date.parse("#{year}-08-01")
  end
end
