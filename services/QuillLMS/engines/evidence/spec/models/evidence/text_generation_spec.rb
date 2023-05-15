# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_text_generations
#
#  id         :bigint           not null, primary key
#  type       :string           not null
#  config     :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

module Evidence
  RSpec.describe TextGeneration, type: :model do

    it { should validate_presence_of(:type) }

    it { should have_many(:prompt_texts) }
  end
end
