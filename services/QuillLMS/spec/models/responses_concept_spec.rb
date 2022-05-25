# frozen_string_literal: true

# == Schema Information
#
# Table name: responses_concepts
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  concept_id  :bigint           not null
#  response_id :bigint           not null
#
# Indexes
#
#  index_responses_concepts_on_concept_id   (concept_id)
#  index_responses_concepts_on_response_id  (response_id)
#
# Foreign Keys
#
#  fk_rails_...  (concept_id => concepts.id)
#  fk_rails_...  (response_id => responses.id)
#
require 'rails_helper'

RSpec.describe ResponsesConcept, type: :model do
  context 'associations' do
    it { should belong_to(:concept) }
    it { should belong_to(:response) }
  end
end

