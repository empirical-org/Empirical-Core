# frozen_string_literal: true

require 'rails_helper'

describe Synthetic::ManualTypes do
  let(:label_1) { 'label_1'}
  let(:label_2) { 'label_2'}
  let(:enough_labeled_data) do
    70.times.map {|i| ["text string #{i}", label_1]} +
      70.times.map {|i| ["other string #{i}", label_2]}
  end

  let(:not_enough_labeled_data) { [['text string', label_1], ['other text', label_2]] }

  describe '#new' do
    let(:synthetics) { Synthetic::Data.new(enough_labeled_data, languages: [:es], manual_types: true)}

    let(:invalid_synthetics) { Synthetic::Data.new(not_enough_labeled_data, languages: [:es], manual_types: true)}

    it 'should assign types without raising an error' do
      expect {synthetics}.to_not raise_error

      expect(synthetics.train_data.count).to eq(100)
      expect(synthetics.test_data.count).to eq(20)
      expect(synthetics.validation_data.count).to eq(20)
    end

    it 'should raise error if not enough data' do
      expect {invalid_synthetics}.to raise_error(Synthetic::ManualTypes::NotEnoughData)
    end
  end
end
