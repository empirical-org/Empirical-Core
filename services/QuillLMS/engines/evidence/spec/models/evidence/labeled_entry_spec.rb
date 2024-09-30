# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_labeled_entries
#
#  id                :bigint           not null, primary key
#  approved          :boolean
#  embedding         :vector(1536)     not null
#  entry             :text             not null
#  label             :text             not null
#  label_transformed :text             not null
#  metadata          :jsonb
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  prompt_id         :integer          not null
#
# Indexes
#
#  index_evidence_labeled_entries_on_prompt_id            (prompt_id)
#  index_evidence_labeled_entries_on_prompt_id_and_entry  (prompt_id,entry) UNIQUE
#

require 'rails_helper'

module Evidence
  RSpec.describe LabeledEntry do
    let(:factory) { described_class.model_name.singular.to_sym }
    let(:dimension) { described_class::DIMENSION }
    let(:embedding) { Array.new(dimension) { rand(-1.0..1.0) } }

    it { is_expected.to validate_presence_of(:prompt) }
    it { is_expected.to validate_presence_of(:entry) }
    it { is_expected.to validate_presence_of(:embedding) }
    it { is_expected.to validate_presence_of(:label) }
    it { is_expected.to validate_presence_of(:label_transformed) }

    context 'validations' do
      context 'label_transformed' do
        subject { create(factory, label:).label_transformed }

        context 'when label matches "Optimal_1' do
          let(:label) { 'Optimal_1' }

          it { is_expected.to eq described_class::COLLAPSED_OPTIMAL_LABEL }
        end

        context 'when label matches "Optimal_10"' do
          let(:label) { 'Optimal_10' }

          it { is_expected.to eq described_class::COLLAPSED_OPTIMAL_LABEL }
        end

        context 'when label does not match "Optimal_n"' do
          let(:label) { 'Label_5' }

          it { is_expected.to eq label }
        end

        context 'when label is nil' do
          let(:label) { nil }

          it { expect { subject }.to raise_error(ActiveRecord::RecordInvalid) }
        end
      end

      context 'entry' do
        subject { labeled_entry.entry }

        let(:entry) { ' some spaces before and after ' }
        let(:labeled_entry) { create(factory, entry:) }

        it { is_expected.to eq entry.strip }
      end
    end

    context 'with stubbed embedding' do
      subject { build(factory, entry:, embedding: initial_embedding) }

      let(:entry) { 'sample text' }
      let(:initial_embedding) { nil }
      let(:fetcher_class) { Evidence::OpenAI::EmbeddingFetcher }

      before { allow(fetcher_class).to receive(:run).and_return(embedding) }

      context 'when text is present and embedding is nil' do
        it 'sets the embedding' do
          subject.validate
          expect(subject.embedding).to eq embedding
        end
      end

      context 'when text is present and embedding is already set' do
        let(:initial_embedding) { embedding }

        it 'does not change the existing embedding' do
          subject.validate
          expect(subject.embedding).to eq initial_embedding
          expect(fetcher_class).not_to receive(:run)
        end
      end

      context 'when text is nil' do
        let(:entry) { nil }

        it 'does not set the embedding' do
          subject.validate
          expect(subject.embedding).to be_nil
          expect(fetcher_class).not_to receive(:run)
        end
      end
    end

    context '#nearest_neighbor' do
      subject { labeled_entry.nearest_neighbor }

      let(:epsilon) { 0.01 }
      let(:embedding_plus_epsilon) { embedding.map { |value| value + epsilon } }
      let(:embedding_plus_two_epsilon) { embedding.map { |value| value + (2 * epsilon) } }

      context 'with no other LabeledEntry records' do
        let(:labeled_entry) { create(factory) }

        it { is_expected.to eq nil }
      end

      context 'with other LabeledEntry records but for different prompt' do
        let(:labeled_entry) { create(factory) }

        before { create(factory) }

        it { is_expected.to eq nil }
      end

      context 'with one other LabeledEntry' do
        let!(:labeled_entry1) { create(factory, prompt:, embedding: embedding_plus_epsilon) }

        let(:prompt) { create(:evidence_prompt) }
        let(:labeled_entry) { create(factory, prompt:, embedding:) }

        it { is_expected.to eq labeled_entry1 }
      end

      context 'with multiple other LabeledEntry records' do
        let!(:labeled_entry1) { create(factory, prompt:, embedding: embedding_plus_epsilon) }
        let!(:labeled_entry2) { create(factory, prompt:, embedding: embedding_plus_two_epsilon) }

        let(:prompt) { create(:evidence_prompt) }
        let(:labeled_entry) { create(factory, prompt:, embedding:) }

        it { is_expected.to eq labeled_entry1 }
      end
    end

    context '#nearest_label' do
      subject { labeled_entry.nearest_label }

      let(:prompt) { create(:evidence_prompt) }
      let(:labeled_entry) { create(factory, prompt:) }

      context 'when no neighbors' do
        it { is_expected.to eq(distance: nil, label: nil) }
      end

      context 'with other LabeledEntry records' do
        let!(:existing_prompt_response_label) { create(factory, prompt:) }

        it { expect(subject[:distance]).to be_a(Float) }
        it { expect(subject[:label]).to eq existing_prompt_response_label.label }
      end
    end

    context 'benchmarking', :benchmarking do
      let(:num_iterations) { 1000 }
      let(:labeled_entries) { create_list(factory, num_iterations) }

      it 'checks for performance' do
        [].tap do |times|
          labeled_entries.each do |labeled_entry|
            times << Benchmark.realtime { labeled_entry.nearest_neighbors(:embedding, distance: :cosine).first(5) }
          end

          mean_time = times.reduce(:+) / times.size
          stddev = Math.sqrt(times.map { |time| (time - mean_time)**2 }.reduce(:+) / times.size)

          puts "\nBenchmarking for nearest neighbor cosine similarity"
          puts "Model: #{klass::MODEL}, Dimension: #{klass::DIMENSION}, num_iterations: #{num_iterations}"
          puts "Average response time: #{mean_time} seconds"
          puts "Standard deviation: #{stddev} seconds"
        end
      end
    end
  end
end
