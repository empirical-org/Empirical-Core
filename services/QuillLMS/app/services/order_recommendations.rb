class OrderRecommendations

  def initialize(recommendation_ids)
    @recommendation_ids = recommendation_ids
  end

  def update_order
    ActiveRecord::Base.transaction do
      begin
        @recommendation_ids.each_with_index do |id, i|
          Recommendation.find(id).update!(order: i)
        end

        true
      rescue
        false
      end
    end
  end
end
