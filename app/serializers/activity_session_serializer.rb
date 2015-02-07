class ActivitySessionSerializer < ActiveModel::Serializer
  attributes :uid, :percentage, :time_spent, :state, :completed_at, :data, :temporary,
              :activity_uid, :anonymous

  has_many :concept_tag_results
end
