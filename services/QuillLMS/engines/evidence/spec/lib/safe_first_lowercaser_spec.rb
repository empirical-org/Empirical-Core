# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(SafeFirstLowercaser, type: :module) do
    let(:word_list) { ['word2', 'Word1'] }

    subject { described_class.new(word_list) }

    describe "#run" do
      it { expect(subject.run('Word1 in custom list')).to eq('word1 in custom list') }
      it { expect(subject.run('Word2 in custom list')).to eq('word2 in custom list') }
      it { expect(subject.run('Word3 not in Custom List')).to eq('Word3 not in Custom List') }
      it { expect(subject.run('Awordnot in List')).to eq('Awordnot in List') }
      it { expect(subject.run('In common word list')).to eq('in common word list') }
    end
  end
end
