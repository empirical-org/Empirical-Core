# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::ManualTypes do
  let(:label1) { 'label1'}
  let(:label2) { 'label2'}
  let(:enough_labeled_data) do
    7.times.map {|i| ["text string #{i}", label1]} +
      7.times.map {|i| ["other string #{i}", label2]}
  end

  let(:not_enough_labeled_data) { [['text string', label1], ['other text', label2]] }

  describe '#new' do
    let(:synthetics) { Evidence::Synthetic::Data.new(enough_labeled_data, languages: [:es], manual_types: true)}

    let(:invalid_synthetics) { Evidence::Synthetic::Data.new(not_enough_labeled_data, languages: [:es], manual_types: true)}

    it 'should assign types without raising an error' do
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TRAIN_PER_LABEL", 5)
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TEST_PER_LABEL", 1)

      expect {synthetics}.to_not raise_error

      expect(synthetics.train_data.count).to eq(10)
      expect(synthetics.test_data.count).to eq(2)
      expect(synthetics.validation_data.count).to eq(2)
    end

    it 'should raise error if not enough data' do
      expect {invalid_synthetics}.to raise_error(Evidence::Synthetic::ManualTypes::NotEnoughData)
    end
  end
end
