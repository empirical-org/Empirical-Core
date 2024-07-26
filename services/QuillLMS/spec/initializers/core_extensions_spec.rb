# frozen_string_literal: true

require 'rails_helper'

RSpec.describe String do
  describe '#strip_zero_width' do
    it 'removes zero-width space characters from the string' do
      expect("hello\u200Bworld".strip_zero_width).to eq('helloworld')
    end

    it 'removes zero-width non-joiner characters from the string' do
      expect("hello\u200Cworld".strip_zero_width).to eq('helloworld')
    end

    it 'removes zero-width joiner characters from the string' do
      expect("hello\u200Dworld".strip_zero_width).to eq('helloworld')
    end

    it 'removes zero-width no-break space characters from the string' do
      expect("hello\uFEFFworld".strip_zero_width).to eq('helloworld')
    end

    it 'does not affect strings without zero-width characters' do
      expect('hello world'.strip_zero_width).to eq('hello world')
    end

    it 'handles strings composed entirely of zero-width characters' do
      expect("\u200B\u200C\u200D\uFEFF".strip_zero_width).to eq('')
    end
  end

  describe '#strip_whitespace' do
    it 'removes all whitespace from the string' do
      expect('hello world'.strip_whitespace).to eq('helloworld')
    end

    it 'removes tabs, spaces, and newlines' do
      expect("hello \t\n world \r\n".strip_whitespace).to eq('helloworld')
    end

    it 'works with strings that have no whitespace' do
      expect('helloworld'.strip_whitespace).to eq('helloworld')
    end

    it 'returns an empty string if the original string was only whitespace' do
      expect(" \t\n\r\n".strip_whitespace).to eq('')
    end
  end
end
