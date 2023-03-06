# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe PromptTextGeneration, type: :model do

    it { should validate_presence_of(:generator) }

    it { should have_many(:prompt_texts) }
  end
end
