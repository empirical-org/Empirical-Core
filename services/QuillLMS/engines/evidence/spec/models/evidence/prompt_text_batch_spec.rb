# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_text_batches
#
#  id         :bigint           not null, primary key
#  type       :string           not null
#  prompt_id  :integer          not null
#  config     :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

module Evidence
  RSpec.describe PromptTextBatch, type: :model do

    it { should validate_presence_of(:type) }
    it { should validate_presence_of(:prompt_id) }

    it { should have_many(:prompt_texts) }
    it { should have_many(:text_generations) }
  end
end
