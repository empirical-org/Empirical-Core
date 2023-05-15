# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_texts
#
#  id                   :bigint           not null, primary key
#  prompt_text_batch_id :integer          not null
#  text_generation_id   :integer          not null
#  text                 :string           not null
#  label                :string
#  ml_type              :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
require 'rails_helper'

module Evidence
  RSpec.describe PromptText, type: :model do

    it { should validate_presence_of(:prompt_text_batch_id) }
    it { should validate_presence_of(:text_generation_id) }
    it { should validate_presence_of(:text) }

    it { should belong_to(:prompt_text_batch) }
    it { should belong_to(:text_generation) }
  end
end
