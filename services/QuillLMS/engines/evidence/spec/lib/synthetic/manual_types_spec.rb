# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::ManualTypes do
  let(:label1) { 'label1'}
  let(:label2) { 'label2'}
  let(:enough_labeled_data) do
    7.times.map {|i| ["text string #{i}", label1]} +
      7.times.map {|i| ["other string #{i}", label2]}
  end

  let(:activity) { create(:evidence_activity, :with_prompt_and_passage) }
  let(:prompt)  { activity.prompts.first }

  let(:not_enough_labeled_data) { [['text string', label1], ['other text', label2]] }

  describe '#new' do
    let(:generator) { Evidence::Synthetic::LabeledDataGenerator.new(enough_labeled_data, prompt: prompt, manual_types: true)}

    let(:generator_low_data) { Evidence::Synthetic::LabeledDataGenerator.new(not_enough_labeled_data, prompt: prompt, manual_types: true)}

    before do
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TRAIN_PER_LABEL", 5)
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TEST_PER_LABEL", 1)
      stub_const("Evidence::Synthetic::ManualTypes::EXTRA_TRAIN_COUNT", 1)
    end

    it 'should assign types without and be valid' do
      expect(generator.train_data.count).to eq(10)
      expect(generator.test_data.count).to eq(2)
      expect(generator.validation_data.count).to eq(2)

      expect(generator.valid?).to be true
    end

    it 'should be invalid if not enough data per label' do
      expect(generator_low_data.valid?).to be false

      expect(generator_low_data.errors[:manual_types].first).to eq("There is not enough data for labels: label1,label2")
    end

    context 'lots of extra training data' do
      before do
        stub_const("Evidence::Synthetic::ManualTypes::EXTRA_TRAIN_COUNT", 3)
      end

      it 'should be invalid if percentage of test/validation is too low for automl' do
        expect(generator.valid?).to be false

        expect(generator.errors[:manual_types].first).to eq("AutoML needs 5\% of the data to be TEST and VALIDATION, currently VALIDATION: %4.55, TEST: %4.55")
      end
    end
  end
end
