# frozen_string_literal: true

Rails.application.config.to_prepare do
  unless Rails.env.test?
    Analytics::SegmentIo.configure { |c| c.write_key = ENV['SEGMENT_WRITE_KEY'] }
  end
end
