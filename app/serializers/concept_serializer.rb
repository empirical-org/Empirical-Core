class ConceptSerializer < ActiveModel::Serializer
  attributes :id, :name, :uid, :parent_id, :level
  delegate :cache_key, :to => :object

  def to_json(*args)
    Rails.cache.fetch expand_cache_key(self.class.to_s.underscore, cache_key, 'to-json') do
      super
    end
  end

  def level
    object.try(:level)
  end

  private

  def expand_cache_key(*args)
    ActiveSupport::Cache.expand_cache_key args
  end
end
