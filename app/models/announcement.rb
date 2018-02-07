class Announcement < ActiveRecord::Base
  TYPES = {
    webinar: 'webinar'
  }

  def self.get_current_webinar_announcement
    # TODO add the time with time zone constraint query
    Announcement.where(announcement_type: TYPES[:webinar]).last
  end
end
