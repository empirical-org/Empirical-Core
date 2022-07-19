# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_result_prompts
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_concept_result_prompts_on_text  (text) UNIQUE
#
require 'rails_helper'

RSpec.describe ConceptResultPrompt, type: :model do
  before do
    create(:concept_result_prompt)
  end

  context 'associations' do
    it { should have_many(:concept_results) }
  end

  context 'validations' do
    it { should validate_presence_of(:text) }
    it { should validate_uniqueness_of(:text) }
  end
end
