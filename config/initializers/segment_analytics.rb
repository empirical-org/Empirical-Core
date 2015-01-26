if !Rails.env.test?
  SegmentAnalytics.backend = Segment::Analytics.new({
    write_key: ENV['SEGMENT_WRITE_KEY'],
    on_error: Proc.new { |status, msg| print msg }
  })
end