# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Utils::Numeric do

  describe '#to_human_string' do
    it 'should format million- and billion-order Numerics correctly' do
      expect(Utils::Numeric.to_human_string(1_000_000)).to eq(
        "1 Million"
      )

      expect(Utils::Numeric.to_human_string(10_000_000)).to eq(
        "10 Million"
      )

      expect(Utils::Numeric.to_human_string(17_700_000)).to eq(
        "18 Million"
      )

      expect(Utils::Numeric.to_human_string(17_700_000_000)).to eq(
        "18 Billion"
      )
    end

    it 'should handle string input gracefully' do
      expect(Utils::Numeric.to_human_string("100")).to eq "100.0"
      expect(Utils::Numeric.to_human_string("5700000")).to eq "6 Million"
    end
  end

  describe '#seconds_to_human_readable_time' do
    it 'should format times under one minute correctly' do
      expect(Utils::Numeric.seconds_to_human_readable_time(2)).to eq(
        "00:02"
      )

      expect(Utils::Numeric.seconds_to_human_readable_time(2.5)).to eq(
        "00:02"
      )

      expect(Utils::Numeric.seconds_to_human_readable_time(59)).to eq(
        "00:59"
      )
    end

    it 'should format times over one minute correctly' do
      expect(Utils::Numeric.seconds_to_human_readable_time(300)).to eq(
        "05:00"
      )

      expect(Utils::Numeric.seconds_to_human_readable_time(97)).to eq(
        "01:37"
      )
    end

    it 'should format 0 seconds correctly' do
      expect(Utils::Numeric.seconds_to_human_readable_time(0)).to eq(
        "00:00"
      )
    end
  end

  describe '#human_readable_time_to_seconds' do
    it 'should format times under one minute correctly' do
      expect(Utils::Numeric.human_readable_time_to_seconds("00:02")).to eq(
       2
      )

      expect(Utils::Numeric.human_readable_time_to_seconds("00:59")).to eq(
       59
      )
    end

    it 'should format times over one minute correctly' do
      expect(Utils::Numeric.human_readable_time_to_seconds("05:00")).to eq(
        300
      )

      expect(Utils::Numeric.human_readable_time_to_seconds("01:37")).to eq(
        97
      )
    end

    it 'should format 0 seconds correctly' do
      expect(Utils::Numeric.human_readable_time_to_seconds("00:00")).to eq(
        0
      )
    end
  end

  describe '#safe_division' do
    let(:subject) { Utils::Numeric.safe_division(numerator, denominator) }
    let(:numerator) { 5 }
    let(:denominator) { 2 }

    it { expect(subject).to eq(numerator.to_f / denominator) }

    context '0 denominator' do
      let(:denominator) { 0 }

      it { expect(subject).to eq(0) }
    end
  end
end
