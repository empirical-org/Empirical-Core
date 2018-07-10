class Types::ResponseType < Types::BaseObject

  field :id, ID, null: false
  field :question_id, ID, null: false
  field :submissions, Integer, null: false
  field :text, String, null: false

  field :metrics, Types::MetricsType, null: false
  field :latest_metrics, Types::MetricsType, null: false

  def metrics
    object.all_metrics
  end

  def latest_metrics
    object.latest_metrics
  end
end