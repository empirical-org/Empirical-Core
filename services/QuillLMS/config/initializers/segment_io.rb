# frozen_string_literal: true

Analytics::SegmentIo.configure { |c| c.write_key = ENV['SEGMENT_WRITE_KEY'] } unless Rails.env.test?
