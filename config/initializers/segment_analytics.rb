require 'analytics/segment_io'

unless Rails.env.test?
  SegmentIo.configure do |c|
    c.write_key = ENV['SEGMENT_WRITE_KEY']
  end
end
