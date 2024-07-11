# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::GenAI::OptimalBoundaryDataFetcher, type: :service do
  let(:default_file) { 'gen_ai_optimal_because_50.csv' }
  let(:custom_file) { 'custom_file.csv' }
  let(:file_path) { "#{Evidence::Engine.root}/app/services/evidence/gen_ai/optimal_boundary_data/#{default_file}" }
  let(:custom_file_path) { "#{Evidence::Engine.root}/app/services/evidence/gen_ai/optimal_boundary_data/#{custom_file}" }
  let(:csv_data) do
    [
      { 'prompt_id' => '1', 'optimal1' => 'optimal_value_1', 'optimal2' => nil, 'suboptimal1' => 'suboptimal_value_1', 'suboptimal2' => nil },
      { 'prompt_id' => '2', 'optimal1' => 'optimal_value_2', 'optimal2' => 'optimal_value_3', 'suboptimal1' => 'suboptimal_value_2', 'suboptimal2' => 'suboptimal_value_3' }
    ]
  end

  before do
    allow(CSV).to receive(:read).with(file_path, headers: true).and_return(csv_data)
    allow(CSV).to receive(:read).with(custom_file_path, headers: true).and_return(csv_data)
  end

  subject { described_class.new }

  describe '#initialize' do
    context 'when file is not provided' do
      it 'sets the default file' do
        expect(subject.file).to eq(default_file)
      end
    end

    context 'when file is provided' do
      subject { described_class.new(custom_file) }

      it 'sets the custom file' do
        expect(subject.file).to eq(custom_file)
      end
    end
  end

  describe '#run' do
    context 'with default file' do
      subject { described_class.run }

      it 'returns the correct dataset' do
        expect(subject).to be_a(Hash)
        expect(subject.keys).to contain_exactly(1, 2)
        expect(subject[1].optimals).to contain_exactly('optimal_value_1')
        expect(subject[1].suboptimals).to contain_exactly('suboptimal_value_1')
        expect(subject[2].optimals).to contain_exactly('optimal_value_2', 'optimal_value_3')
        expect(subject[2].suboptimals).to contain_exactly('suboptimal_value_2', 'suboptimal_value_3')
      end
    end

    context 'with custom file' do
      subject { described_class.run(custom_file) }

      it 'returns the correct dataset' do
        expect(subject).to be_a(Hash)
        expect(subject.keys).to contain_exactly(1, 2)
        expect(subject[1].optimals).to contain_exactly('optimal_value_1')
        expect(subject[1].suboptimals).to contain_exactly('suboptimal_value_1')
        expect(subject[2].optimals).to contain_exactly('optimal_value_2', 'optimal_value_3')
        expect(subject[2].suboptimals).to contain_exactly('suboptimal_value_2', 'suboptimal_value_3')
      end
    end
  end

  describe 'private methods' do
    describe '#csv_data' do
      it 'reads the CSV file' do
        expect(subject.send(:csv_data)).to eq(csv_data)
      end
    end

    describe '#file_path' do
      it 'returns the correct file path' do
        expect(subject.send(:file_path)).to eq(file_path)
      end
    end

    describe '#dataset_from_row' do
      it 'creates a DataSet struct from a row' do
        row = csv_data.first
        dataset = subject.send(:dataset_from_row, row)

        expect(dataset).to be_a(Evidence::GenAI::OptimalBoundaryDataFetcher::DataSet)
        expect(dataset.optimals).to contain_exactly('optimal_value_1')
        expect(dataset.suboptimals).to contain_exactly('suboptimal_value_1')
      end
    end
  end
end
