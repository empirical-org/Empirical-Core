# frozen_string_literal: true

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
