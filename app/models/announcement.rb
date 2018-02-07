class Announcement < ActiveRecord::Base
  TYPES = {
    webinar: 'webinar'
  }

  TIME_ZONE = 'America/New_York'

  def self.get_current_webinar_announcement
    ActiveRecord::Base.connection.execute("
      SELECT text, link FROM announcements
      WHERE announcements.announcement_type = '#{TYPES[:webinar]}'
      AND NOW() AT TIME ZONE '#{TIME_ZONE}' BETWEEN announcements.start AND announcements.end
    ").to_a.first
  end
end
