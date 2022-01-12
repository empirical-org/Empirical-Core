# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DuplicateNameResolver do
  let(:name) { 'name' }

  subject { described_class.run(name, existing_names) }

  context "#{name} is not in existing names" do
    let(:existing_names) { [] }

    it { expect(subject).to eq name }
  end

  context "#{name} is in existing names" do
    let(:max) { described_class::MAX_BEFORE_RANDOMIZED }
    let(:existing_names) { [name] }

    it { expect(subject).to eq "#{name}_1"}

    context "duplicates up to penulimate are also in existing names" do
      let(:existing_names) { [name] + 1.upto(max - 1).map { |n| "#{name}_#{n}" } }

      it { expect(subject).to eq "#{name}_#{max}" }
    end

    context "duplicates up to max are also in existing names" do
      let(:existing_names) { [name] + 1.upto(max).map { |n| "#{name}_#{n}" } }

      it { expect(subject).not_to eq nil }
      it { expect(subject).not_to eq "#{name}_#{max}" }
    end
  end
end
