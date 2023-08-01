# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Utils::String do
  describe '#last_name_or_name' do
    subject { described_class.last_name_or_name(arg) }

    context 'un-split-able arg' do
      let(:arg) { 1 }

      it { expect { subject }.to raise_error(ArgumentError) }
    end

    context 'first and last name' do
      let(:first) { 'First' }
      let(:last) { 'Last' }
      let(:arg) { "#{first} #{last}" }

      it { expect(subject).to eq(last) }
    end

    context 'first name only' do
      let(:arg) { 'First' }

      it { expect(subject).to eq(arg) }
    end
  end

  describe 'parse_null_to_nil' do
    subject { described_class.parse_null_to_nil(arg) }
    let(:arg) { "foo" }

    it { expect(subject).to eq(arg) }

    context 'arg equals exactly "null"' do
      let(:arg) { "null" }

      it { expect(subject).to eq(nil) }
    end
  end
end
