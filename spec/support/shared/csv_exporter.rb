shared_examples_for "CSV Exporter" do
  let(:csv_exporter) { described_class.new }

  describe '#header_row' do
    it 'returns an array of headers' do
      expect(csv_exporter.header_row).to eq(expected_header_row)
    end
  end

  describe '#data_row' do
    it 'returns an array of row data' do
      expect(csv_exporter.data_row(model_instance, filters)).to eq(expected_data_row)
    end
  end

  describe '#model_data' do
    subject { csv_exporter.model_data(teacher, filters).to_a }

    it 'retrieves filtered activity sessions' do
      expect(subject.size).to eq(expected_model_data_size)
    end
  end
end