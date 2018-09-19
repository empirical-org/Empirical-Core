require 'rails_helper'

describe OrderRecommendations do
  it 'updates the orders of recommendations' do
    first_recommendation = create(:recommendation, order: 0)
    second_recommendation = create(:recommendation, order: 1)
    ids = [second_recommendation.id, first_recommendation.id]

    OrderRecommendations.new(ids).update_order

    expect(first_recommendation.reload.order).to eq(1)
    expect(second_recommendation.reload.order).to eq(0)
  end

  it 'returns true if orders are updated' do
    first_recommendation = create(:recommendation, order: 0)
    second_recommendation = create(:recommendation, order: 1)
    ids = [second_recommendation.id, first_recommendation.id]

    result = OrderRecommendations.new(ids).update_order

    expect(result).to be true
  end

  it 'returns false if orders fail to update' do
    recommendation = create(:recommendation, order: 0)
    ids = [555, recommendation.id]

    result = OrderRecommendations.new(ids).update_order

    expect(result).to be false
  end
end
