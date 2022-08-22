# frozen_string_literal: true

require 'rails_helper'

describe SplitName do
  subject { described_class.run(name) }

  context 'fullnames' do
    let(:name) { 'John Smith' }

    it { expect(subject).to eq ['John', 'Smith'] }
  end

  context 'mononymous names' do
    let(:name) { 'John' }

    it { expect(subject).to eq ['John', nil] }
  end

  context 'mononymous names with leading spaces' do
    let(:name) { '  John' }

    it { expect(subject).to eq ['John', nil] }
  end

  context 'mononymous names with trailing spaces' do
    let(:name) { 'John  ' }

    it { expect(subject).to eq ['John', nil] }
  end

  context 'empty names' do
    let(:name) { '  ' }

    it { expect(subject).to eq [nil, nil] }
  end

  context 'nil names' do
    let(:name) { nil }

    it { expect(subject).to eq [nil, nil] }
  end
end
