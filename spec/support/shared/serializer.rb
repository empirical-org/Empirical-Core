shared_examples_for 'serializer' do
  # Relies on an 'expected_serialized_keys' value
  # Relies on a 'record_instance' value
  let(:serializer)     { described_class.new(record_instance) }
  let(:json)   { serializer.to_json }
  let(:parsed) { JSON.parse(json) }
  let(:result_key) { record_instance.class.to_s.underscore }
  let(:nested_hash_keys) { [] }

  describe '#to_json output' do
    it "includes a wrapping key" do
      expect(parsed.keys).to include(result_key)
    end

    it 'has the correct sub-keys' do
      expect(parsed[result_key].keys)
        .to match_array expected_serialized_keys
    end

    it 'has nested hashes on the correct keys' do
      nested_hash_keys.each do |nested_hash_key|
        expect(parsed[result_key][nested_hash_key]).to be_a(Hash), "expected '#{nested_hash_key}' to be a Hash"
      end
    end
  end  
end