# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(SafeFirstLowercaser, type: :module) do
    let(:passage) { "word1 Word2 word2 Word3" }

    subject { described_class.new(passage) }

    describe "#run" do
      it { expect(subject.run('Word1 in passage')).to eq('word1 in passage') }
      it { expect(subject.run('Word2 in passage, both upper lower')).to eq('word2 in passage, both upper lower') }
      it { expect(subject.run('Word3 in passage, only upper')).to eq('Word3 in passage, only upper') }
      it { expect(subject.run('Uncommon word not in List')).to eq('Uncommon word not in List') }
      it { expect(subject.run('In common word list')).to eq('in common word list') }

      context "no passage" do
        subject { described_class.new }

        it { expect(subject.run('Word1 in custom list')).to eq('Word1 in custom list') }
        it { expect(subject.run('Word2 in custom list')).to eq('Word2 in custom list') }
        it { expect(subject.run('Awordnot in List')).to eq('Awordnot in List') }
        it { expect(subject.run('In common word list')).to eq('in common word list') }
      end
    end
  end
end
