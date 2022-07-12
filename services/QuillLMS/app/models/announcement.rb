# frozen_string_literal: true

# == Schema Information
#
# Table name: announcements
#
#  id                :integer          not null, primary key
#  announcement_type :string
#  end               :datetime
#  link              :text
#  start             :datetime
#  text              :text
#
# Indexes
#
#  index_announcements_on_start_and_end  (start,end DESC)
#
class Announcement < ApplicationRecord
  TYPES = {
    webinar: 'webinar'
  }

  TIME_ZONE = 'America/New_York'

  def self.current_webinar_announcement
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          text,
          link
        FROM announcements
        WHERE announcements.announcement_type = '#{TYPES[:webinar]}'
          AND NOW() AT TIME ZONE '#{TIME_ZONE}'
          BETWEEN announcements.start AND announcements.end
        ORDER BY id DESC
        LIMIT 1;
      SQL
    ).to_a.first
  end
end
