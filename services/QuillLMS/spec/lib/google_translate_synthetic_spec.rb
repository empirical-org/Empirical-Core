require 'rails_helper'

describe GoogleTranslateSynthetic do

  describe 'initialization' do
    let(:sample_data) { [['text string', 'label_5'], ['other text', 'label_11']] }

    it 'should setup properly with empty translations' do
      synthetics = GoogleTranslateSynthetic.new(sample_data, languages: [:es])
      first_result = synthetics.results.first

      expect(synthetics.languages.count).to eq 1
      expect(synthetics.results.count).to eq 2

      expect(first_result.original).to eq 'text string'
      expect(first_result.label).to eq 'label_5'
      expect(first_result.translations).to eq({})
    end


    it 'should fetch_results' do
      # stub translator
      stubbed_translator = double()
      stub_const("GoogleTranslateSynthetic::TRANSLATOR", stubbed_translator)

      # translate to spanish mock
      expect(stubbed_translator).to receive(:translate).with(sample_data.map(&:first), from: :en, to: :es).and_return([double(text: 'adios'), double(text: 'hola')])
      # translate to english mock
      expect(stubbed_translator).to receive(:translate).with(['adios', 'hola'], from: :es, to: :en).and_return([double(text: 'goodbye'), double(text: 'hello')])

      synthetics = GoogleTranslateSynthetic.new(sample_data, languages: [:es])

      synthetics.fetch_results

      expect(synthetics.results.count).to eq 2

      first_result = synthetics.results.first

      expect(first_result.original).to eq 'text string'
      expect(first_result.label).to eq 'label_5'
      expect(first_result.translations[:es]).to eq 'goodbye'
    end
  end
end
