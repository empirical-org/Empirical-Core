class ClassificationSerializer < ActiveModel::Serializer
  attributes :uid, :name, :key, :form_url, :module_url, :created_at, :updated_at
end
