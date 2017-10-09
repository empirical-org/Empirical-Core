class Author < ActiveRecord::Base
  has_many :unit_templates

  DEFAULT_AVATAR_URL = 'http://jaredsilver.name/headshot.jpg'

  def avatar_url
    self.avatar.blank? ? DEFAULT_AVATAR_URL : self.avatar
  end
end
