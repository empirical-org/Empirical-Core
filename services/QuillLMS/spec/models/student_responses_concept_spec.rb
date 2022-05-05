# frozen_string_literal: true

# == Schema Information
#
# Table name: student_responses_concepts
#
#  id                  :bigint           not null, primary key
#  created_at          :datetime         not null
#  concept_id          :bigint           not null
#  student_response_id :bigint           not null
#
# Indexes
#
#  index_student_responses_concepts_on_concept_id           (concept_id)
#  index_student_responses_concepts_on_student_response_id  (student_response_id)
#
# Foreign Keys
#
#  fk_rails_...  (concept_id => concepts.id)
#  fk_rails_...  (student_response_id => student_responses.id)
#
require 'rails_helper'

RSpec.describe StudentResponsesConcept, type: :model do
  context 'associations' do
    it { should belong_to(:concept) }
    it { should belong_to(:student_response) }
  end
end

