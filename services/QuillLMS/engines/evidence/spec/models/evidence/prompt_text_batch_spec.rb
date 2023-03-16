# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe PromptTextBatch, type: :model do

    it { should validate_presence_of(:type) }
    it { should validate_presence_of(:prompt_id) }
    it { should validate_presence_of(:user_id) }

    it { should have_many(:prompt_texts) }
    it { should have_many(:text_generations) }
  end
end
