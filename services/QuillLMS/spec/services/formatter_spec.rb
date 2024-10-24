# frozen_string_literal: true

require 'rails_helper'

describe Formatter do
  subject { described_class.run(selected_format, value) }

  context 'default' do
    let(:selected_format) { described_class::DEFAULT }
    let(:value) { 'Should not be modified' }

    it { is_expected.to eq(value) }
  end

  context 'all_caps' do
    let(:selected_format) { described_class::ALL_CAPS }
    let(:value) { 'lowercase' }

    it { is_expected.to eq(value.upcase) }
  end

  context 'as_list' do
    let(:selected_format) { described_class::AS_LIST }
    let(:value) { [1, 2, 3] }

    it { is_expected.to eq(value.join(', ')) }
  end

  context 'as_minutes_string' do
    let(:selected_format) { described_class::AS_MINUTES_STRING }

    context 'less than one minute' do
      let(:value) { 34 }

      it { is_expected.to eq('0:34') }
    end

    context 'more than one minute' do
      let(:value) { 64 }

      it { is_expected.to eq('1:04') }
    end
  end

  context 'as_ratio' do
    let(:selected_format) { described_class::AS_RATIO }
    let(:value) { [1, 4] }

    it { is_expected.to eq("#{value[0]} of #{value[1]}") }
  end

  context 'as_rounded_integer' do
    let(:selected_format) { described_class::AS_ROUNDED_INTEGER }
    let(:value) { 45.67 }

    it { is_expected.to eq(value.round) }
  end

  context 'blank_as_zero' do
    let(:selected_format) { described_class::BLANK_AS_ZERO }

    context 'nil value' do
      let(:value) { nil }

      it { is_expected.to eq(0) }
    end

    context 'empty string' do
      let(:value) { '' }

      it { is_expected.to eq(0) }
    end

    context 'non-blank value' do
      let(:value) { 'Test' }

      it { is_expected.to eq(value) }
    end
  end

  context 'date' do
    let(:selected_format) { described_class::DATE }
    let(:value) { DateTime.current }

    it { is_expected.to eq("#{value.year}-#{format('%02d', value.month)}-#{format('%02d', value.day)}") }
  end

  context 'percent_as_integer' do
    let(:selected_format) { described_class::PERCENT_AS_INTEGER }
    let(:value) { 0.5672 }

    it { is_expected.to eq((value * 100).round) }
  end

  context 'score_or_completed' do
    let(:selected_format) { described_class::SCORE_OR_COMPLETED }

    context 'nil score' do
      let(:value) { nil }

      it { is_expected.to eq('Completed') }
    end

    context '-1 score' do
      let(:value) { -1 }

      it { is_expected.to eq('Completed') }
    end

    context 'decimal score' do
      let(:value) { 0.555 }

      it { is_expected.to eq("#{(value * 100).round}%") }
    end
  end

  context 'seconds_to_minutes' do
    let(:selected_format) { described_class::SECONDS_TO_MINUTES }

    context 'nil' do
      let(:value) { nil }

      it { is_expected.to eq('') }
    end

    context '< 60' do
      let(:value) { 50 }

      it { is_expected.to eq('< 1') }
    end

    context '>= 60' do
      let(:value) { 75 }

      it { is_expected.to eq(value / 60) }
    end
  end
end
