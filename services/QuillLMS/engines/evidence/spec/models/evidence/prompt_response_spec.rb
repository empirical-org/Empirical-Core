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
    it { is_expected.to validate_presence_of(:text) }
    it { is_expected.to validate_presence_of(:embedding) }

    context 'with stubbed embedding' do
      subject { FactoryBot.build(:evidence_prompt_response, text:, embedding: initial_embedding) }

      let(:text) { 'sample text' }
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
        let(:text) { nil }

        it 'does not set the embedding' do
          subject.validate
          expect(subject.embedding).to be_nil
          expect(fetcher_class).not_to receive(:run)
        end
      end
    end

    context 'benchmarking', :benchmarking do
      let(:num_iterations) { 1000 }
      let(:texts) { num_iterations.times.map { Faker::Lorem.sentence } }

      # For comparison, temporarily create a different model with a different dimension and add to klass array
      [Evidence::PromptResponse].each do |klass|
        let!(:prompt_responses) { texts.map { |text| create(klass.table_name.singularize.to_sym, text:) } }

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
