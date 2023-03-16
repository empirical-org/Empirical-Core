# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::Generators::Translation do
  let(:text1) {'text string'}
  let(:text2) {'other text'}
  let(:text1_spanish) {'adios'}
  let(:text2_spanish) {'hola'}
  let(:text1_english) {'goodbye'}
  let(:text2_english) {'hello'}

  let(:mock_translator) { double }

  describe '#generate' do
    let(:translation) { described_class.new([text1, text2], languages: [:es])}

    subject { translation.run }

    it 'fetch and store translations' do

      translation.stub(:translator).and_return(mock_translator)
      # translate to spanish mock
      expect(mock_translator).to receive(:translate).with([text1, text2], from: :en, to: :es).and_return([double(text: text1_spanish), double(text: text2_spanish)])
      # translate to english mock
      expect(mock_translator).to receive(:translate).with([text1_spanish, text2_spanish], from: :es, to: :en).and_return([double(text: text1_english), double(text: text2_english)])

      expect(subject.count).to eq 2
      expect(subject.class).to eq Hash

      generator1 = subject[text1].first
      expect(generator1.results).to eq [text1_english]
      expect(generator1.name).to eq 'Translation'
      expect(generator1.language).to eq('es')

      generator2 = subject[text2].first
      expect(generator2.results).to eq [text2_english]
    end

    context 'google translate returns a single item (not an array)' do
      let(:translation) { described_class.new([text1], languages: [:es])}

      it 'fetch and store translations' do
        translation.stub(:translator).and_return(mock_translator)
        # translate to spanish mock
        expect(mock_translator).to receive(:translate).with([text1], from: :en, to: :es).and_return(double(text: text1_spanish))
        # translate to english mock
        expect(mock_translator).to receive(:translate).with([text1_spanish], from: :es, to: :en).and_return(double(text: text1_english))

        expect(subject.count).to eq 1
        expect(subject.class).to eq Hash

        generator1 = subject[text1].first
        expect(generator1.results).to eq [text1_english]
        expect(generator1.name).to eq 'Translation'
        expect(generator1.language).to eq('es')
      end
    end
  end
end
