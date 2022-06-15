# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Utils::Integer do

  describe '#to_human_string' do
    it 'should format million- and billion-order integers correctly' do
      expect(Utils::Integer.to_human_string(1_000_000)).to eq(
        "1 Million"
      )

      expect(Utils::Integer.to_human_string(10_000_000)).to eq(
        "10 Million"
      )

      expect(Utils::Integer.to_human_string(17_700_000)).to eq(
        "18 Million"
      )

      expect(Utils::Integer.to_human_string(17_700_000_000)).to eq(
        "18 Billion"
      )
    end
  end

end