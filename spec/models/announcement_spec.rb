require 'rails_helper'

describe Announcement, type: :model do
  describe '.get_current_webinar_announcement' do
    let!(:another_current_announcement) { create(:announcement) }
    let!(:most_recent_current_announcement) { create(:announcement) }
    let!(:expired_announcement) { create(:announcement, :expired) }
    let!(:not_yet_started_announcement) { create(:announcement, :not_yet_started) }

    it 'should return the latest announcement that has started and not yet ended' do
      expect(Announcement.get_current_webinar_announcement).to eq({
        'text' => most_recent_current_announcement.text,
        'link' => most_recent_current_announcement.link
      })
    end
  end
end
