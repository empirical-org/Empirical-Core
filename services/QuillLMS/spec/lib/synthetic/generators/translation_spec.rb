# frozen_string_literal: true

require 'rails_helper'

describe Synthetic::Generators::Translation do
  let(:text1) {'text string'}
  let(:text2) {'other text'}
  let(:mock_translator) { double }


  describe '#run' do
    let(:translation) { Synthetic::Generators::Translation.new([text1, text2], languages: [:es])}

    it 'fetch and store translations' do

      translation.stub(:translator).and_return(mock_translator)
      # translate to spanish mock
      expect(mock_translator).to receive(:translate).with([text1, text2], from: :en, to: :es).and_return([double(text: 'adios'), double(text: 'hola')])
      # translate to english mock
      expect(mock_translator).to receive(:translate).with(['adios', 'hola'], from: :es, to: :en).and_return([double(text: 'goodbye'), double(text: 'hello')])

      result = translation.run

      expect(result.count).to eq 2
      expect(result.class).to eq Hash
      expect(result[text1]['es']).to eq 'goodbye'
      expect(result[text2]['es']).to eq 'hello'
    end
  end
end
