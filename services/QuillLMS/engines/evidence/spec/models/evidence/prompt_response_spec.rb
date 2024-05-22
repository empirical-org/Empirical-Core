# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_responses
#
#  id            :bigint           not null, primary key
#  embedding     :vector(1536)     not null
#  response_text :text             not null
#  prompt_id     :integer          not null
#

require 'rails_helper'

module Evidence
  RSpec.describe PromptResponse do
    it { is_expected.to validate_presence_of(:prompt) }
    it { is_expected.to validate_presence_of(:response_text) }
    it { is_expected.to validate_presence_of(:embedding) }

    context 'with stubbed embedding' do
      subject { FactoryBot.build(:evidence_prompt_response, response_text:, embedding: initial_embedding) }

      let(:response_text) { 'sample text' }
      let(:initial_embedding) { nil }
      let(:embedding) { Array.new(Evidence::PromptResponse::DIMENSION) { rand(-1.0..1.0) } }
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
        let(:response_text) { nil }

        it 'does not set the embedding' do
          subject.validate
          expect(subject.embedding).to be_nil
          expect(fetcher_class).not_to receive(:run)
        end
      end
    end

    context '#closest_prompt_response' do
      subject { prompt_response.closest_prompt_response }

      let(:dimension) { Evidence::PromptResponse::DIMENSION }
      let(:embedding) { Array.new(dimension) { rand(-1.0..1.0) } }
      let(:epsilon) { 0.01 }
      let(:embedding_plus_epsilon) { embedding.map { |value| value + epsilon } }
      let(:embedding_plus_two_epsilon) { embedding.map { |value| value + (2 * epsilon) } }

      context 'with no other PromptResponse records' do
        let(:prompt_response) { create(:evidence_prompt_response) }

        it { is_expected.to eq nil }
      end

      context 'with other PromptResponse records but for different prompt' do
        let(:prompt_response) { create(:evidence_prompt_response) }

        before { create(:evidence_prompt_response) }

        it { is_expected.to eq nil }
      end

      context 'with one other PromptResponse' do
        let!(:prompt_response1) { create(:evidence_prompt_response, prompt:, embedding: embedding_plus_epsilon) }

        let(:prompt) { create(:evidence_prompt) }
        let(:prompt_response) { create(:evidence_prompt_response, prompt:, embedding:) }

        it { is_expected.to eq prompt_response1 }
      end

      context 'with multiple other PromptResponse records' do
        let!(:prompt_response1) { create(:evidence_prompt_response, prompt:, embedding: embedding_plus_epsilon) }
        let!(:prompt_response2) { create(:evidence_prompt_response, prompt:, embedding: embedding_plus_two_epsilon) }

        let(:prompt) { create(:evidence_prompt) }
        let(:prompt_response) { create(:evidence_prompt_response, prompt:, embedding:) }

        it { is_expected.to eq prompt_response1 }
      end
    end

    context '#closest_feedback' do
      subject { prompt_response.closest_feedback }

      let(:prompt) { create(:evidence_prompt) }
      let(:prompt_response) { create(:evidence_prompt_response, prompt:) }

      context 'when closest_prompt_response' do
        it { is_expected.to eq(distance: nil, feedback: nil) }
      end

      context 'with other PromptResponse records' do
        let!(:existing_prompt_response) { create(:evidence_prompt_response, prompt:) }

        context 'but no corresponding PromptResponseFeedback' do
          it { expect(subject[:distance]).to be_a(Float) }
          it { expect(subject[:feedback]).to be_nil }
        end

        context 'and corresponding PromptResponseFeedback' do
          let!(:existing_prompt_response_feedback) do
            create(:evidence_prompt_response_feedback, prompt_response: existing_prompt_response)
          end

          it { expect(subject[:distance]).to be_a(Float) }
          it { expect(subject[:feedback]).to eq existing_prompt_response_feedback.feedback }
        end
      end
    end

    context 'benchmarking', :benchmarking do
      let(:num_iterations) { 1000 }
      let(:response_texts) { num_iterations.times.map { Faker::Lorem.sentence } }

      # For comparison, temporarily create a different model with a different dimension and add to klass array
      [Evidence::PromptResponse].each do |klass|
        let!(:prompt_responses) do
          response_texts.map { |response_text| create(klass.table_name.singularize.to_sym, response_text:) }
        end

        it "checks for performance with #{klass::MODEL} with dimension #{klass::DIMENSION}" do
          [].tap do |times|
            prompt_responses.each do |prompt_response|
              times << Benchmark.realtime { prompt_response.nearest_neighbors(:embedding, distance: :cosine).first(5) }
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
end
