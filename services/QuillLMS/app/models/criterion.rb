# frozen_string_literal: true

# == Schema Information
#
# Table name: criteria
#
#  id                :integer          not null, primary key
#  count             :integer          default(0), not null
#  no_incorrect      :boolean          default(FALSE), not null
#  concept_id        :integer          not null
#  recommendation_id :integer          not null
#
# Indexes
#
#  index_criteria_on_concept_id         (concept_id)
#  index_criteria_on_recommendation_id  (recommendation_id)
#
# Foreign Keys
#
#  fk_rails_...  (concept_id => concepts.id)
#  fk_rails_...  (recommendation_id => recommendations.id)
#
class Criterion < ApplicationRecord
  belongs_to :recommendation
  belongs_to :concept
  validates :recommendation, :concept, :count, presence: true
  validates :no_incorrect, inclusion: [true, false]

end
