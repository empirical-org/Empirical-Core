class Author < ActiveRecord::Base
  has_many :unit_templates

  DEFAULT_AVATAR_URL = 'https://assets.quill.org/images/authors/placeholder.png'

  def avatar_url
    self.avatar.blank? ? DEFAULT_AVATAR_URL : self.avatar
  end
end
