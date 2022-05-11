# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StudentResponseConceptResult, type: :model do
  context 'associations' do
    it { should belong_to(:concept_result) }
    it { should belong_to(:student_response) }
  end
end

