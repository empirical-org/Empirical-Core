class ActivitySessionSerializer < ActiveModel::Serializer
  attributes :uid, :percentage, :state, :completed_at, :data, :temporary,
              :activity_uid, :anonymous
end
