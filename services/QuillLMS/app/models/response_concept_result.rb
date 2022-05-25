# frozen_string_literal: true

# == Schema Information
#
# Table name: response_concept_results
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  concept_result_id :bigint           not null
#  response_id       :bigint           not null
#
# Indexes
#
#  index_response_concept_results_on_concept_result_id  (concept_result_id)
#  index_response_concept_results_on_response_id        (response_id)
#
# Foreign Keys
#
#  fk_rails_...  (concept_result_id => concept_results.id)
#  fk_rails_...  (response_id => responses.id)
#
class ResponseConceptResult < ApplicationRecord
  belongs_to :response
  belongs_to :concept_result
end
