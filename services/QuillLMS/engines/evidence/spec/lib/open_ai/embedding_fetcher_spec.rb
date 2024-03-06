# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module OpenAI
    RSpec.describe EmbeddingFetcher do
      subject { described_class.run(dimension:, input:, model:)}

      let(:class_with_embedding) { Evidence::PromptResponse }
      let(:dimension) { class_with_embedding::DIMENSION }
      let(:model) { class_with_embedding::MODEL}
      let(:input) { 'Test input' }
      let(:stubbed_embedding) { Array.new(3) { rand(-1.0..1.0) } }
      let(:endpoint) { "#{described_class::BASE_URI}#{described_class::ENDPOINT}" }

      let(:embedding_response_body) do
        {
          data: [
            object: 'embedding',
            index: 0,
            embedding: stubbed_embedding
          ],
          model: model,
          object: 'list',
          usage: {
            prompt_tokens: input.split.size,
            total_tokens: input.split.size
          }
        }.deep_stringify_keys
      end

      let(:embedding_response) do
        {
          body: embedding_response_body.to_json,
          headers: { 'Content-Type' => 'application/json' }
        }
      end

      context 'cleaned_results' do
        it 'correctly parses the embedding from the response' do
          stub_request(:post, endpoint).to_return(embedding_response)
          expect(subject).to eq stubbed_embedding
        end
      end

      context 'error handling' do
        it 'returns an empty array when encountering a timeout' do
          stub_request(:post, endpoint).to_timeout
          expect(subject).to eq([])
        end
      end

      context 'with a real response', external_api: true do
        it { expect(subject.size).to eq(dimension) }
      end

      context 'benchmarking', :benchmarking, external_api: true do
        let(:num_iterations) { 1000 }
        let(:texts) { num_iterations.times.map { Faker::Lorem.sentence } }

        {'text-embedding-3-small' => 1536, 'text-embedding-3-large' => 3072 }.each_pair do |model, dimension|
          it "checks for performance with #{model} with dimension #{dimension}" do
            [].tap do |times|
              texts.each { |text| times << Benchmark.realtime { described_class.run(dimension:, input: text, model:) } }

              mean_time = times.reduce(:+) / times.size
              stddev = Math.sqrt(times.map { |time| (time - mean_time)**2 }.reduce(:+) / times.size)

              puts "Benchmarking for Third-Party API: OpenAI GPT-3 Embedding Fetcher"
              puts "\nModel: #{model}, Dimension: #{dimension}, num_iterations: #{num_iterations}"
              puts "Average response time: #{mean_time} seconds"
              puts "Standard deviation: #{stddev} seconds"
            end
          end
        end
      end
    end
  end
end
