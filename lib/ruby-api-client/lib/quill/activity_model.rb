class Quill::ActivityModel < Quill::BaseModel
  include ActiveModel::Model

  special_attrs :name, :description

  def find
    api.activities.find(id)
  end

  def persist_params params
    if id.present?
      api.activities.update(id, params)
    else
      api.activities.create(params)
    end
  end
end
