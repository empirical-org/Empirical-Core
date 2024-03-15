# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Gemini
    RSpec.describe Completion, external_api: true do
      subject { described_class.run(prompt:) }

      let(:prompt) { "Write the next word after this sentence: #{Faker::Quote.mitch_hedberg}" }

      it { is_expected.to be_a String }
    end
  end
end
