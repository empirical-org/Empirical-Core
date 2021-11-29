# frozen_string_literal: true

require 'analytics/segment_io'

if !Rails.env.test?
  SegmentIo.configure do |c|
    c.write_key = ENV['SEGMENT_WRITE_KEY']
  end
end