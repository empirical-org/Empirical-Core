class Author < ActiveRecord::Base
  has_many :unit_templates
  after_commit :delete_relevant_caches

  DEFAULT_AVATAR_URL = 'https://assets.quill.org/images/authors/placeholder.png'

  def avatar_url
    self.avatar.blank? ? DEFAULT_AVATAR_URL : self.avatar
  end

  private
  def delete_relevant_caches
    UnitTemplate.all.each { |ut| $redis.del("unit_template_id:#{ut.id}_serialized") }
    $redis.del('production_unit_templates')
    $redis.del('beta_unit_templates')
    $redis.del('alpha_unit_templates')
  end
end
