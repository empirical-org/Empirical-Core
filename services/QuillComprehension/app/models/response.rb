class Response < ApplicationRecord
  belongs_to :question

  def metric(response_label_name)
    response_label = ResponseLabel.find_by_name!(response_label_name)
    ResponseLabelTag.where(response: self, response_label: response_label).sum(:score)
  end

  def metrics
    scores = ResponseLabelTag.where(response: self).group("response_label_id").sum(:score)
    mapped = scores.map do |k, v|
      [ResponseLabel.find(k).name.to_sym, v]
    end
    mapped.to_h
  end

  def all_metrics
    labels = ResponseLabel.all
    mapped = labels.map do |v|
      [v.name.to_sym, 0]
    end
    mapped.to_h.merge(self.metrics)
  end

  def latest_metrics
    latests = ActiveRecord::Base.connection.execute("""
      SELECT response_labels.name, recent_tag.score FROM response_labels
      join lateral (
          select * from response_label_tags rlt
          where rlt.response_label_id = response_labels.id and rlt.response_id = #{self.id}
          order by rlt.created_at DESC
          limit 1
      ) recent_tag on true
    """).to_a
    mapped = latests.map do |v|
      [v["name"].to_sym, v["score"]]
    end
    mapped.to_h
  end

  def reset_metric(response_label_name)
    label_id = ResponseLabel.find_by_name!(response_label_name).id
    tags = ResponseLabelTag.where(response: self).where(response_label_id: label_id)
    tags.destroy_all
  end

end
