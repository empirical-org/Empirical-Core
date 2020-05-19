class Author < ActiveRecord::Base
  has_many :unit_templates
  after_commit :delete_relevant_caches

  DEFAULT_AVATAR_URL = 'https://assets.quill.org/images/authors/placeholder.png'

  def avatar_url
    avatar.blank? ? DEFAULT_AVATAR_URL : avatar
  end

  private
  def delete_relevant_caches
    UnitTemplate.delete_all_caches
  end
end
