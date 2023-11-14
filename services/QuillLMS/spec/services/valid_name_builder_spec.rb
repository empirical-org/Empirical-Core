# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ValidNameBuilder do
  subject { described_class.run(name, existing_names) }

  let(:name) { 'name' }

  context "#{name} is not in existing names" do
    let(:existing_names) { [] }

    it { is_expected.to eq name }
  end

  context "#{name} is in existing names" do
    let(:max) { described_class::MAX_BEFORE_RANDOMIZED }
    let(:existing_names) { [name] }

    it { is_expected.to eq "#{name}_1" }

    context "duplicates up to penulimate are also in existing names" do
      let(:existing_names) { [name] + 1.upto(max - 1).map { |n| "#{name}_#{n}" } }

      it { is_expected.to eq "#{name}_#{max}" }
    end

    context "duplicates up to max are also in existing names" do
      let(:existing_names) { [name] + 1.upto(max).map { |n| "#{name}_#{n}" } }

      it { is_expected.not_to eq nil }
      it { is_expected.not_to eq "#{name}_#{max}" }
    end
  end

  context "name is longer than MAX_LENGTH" do
    let(:name) { 'a' * (described_class::MAX_LENGTH + 1)  }
    let(:existing_names) { [] }
    let(:truncated_name) { name.truncate(described_class::MAX_LENGTH - described_class::RANDOM_STRING_SUFFIX_LENGTH) }

    it { is_expected.to eq truncated_name }

    context "truncated name is in existing names" do
      let(:existing_names) { [truncated_name] }

      it { is_expected.to eq "#{truncated_name}_1" }
    end
  end
end
