# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe TextGeneration, type: :model do

    it { should validate_presence_of(:name) }

    it { should have_many(:prompt_texts) }
  end
end
