# frozen_string_literal: true

require 'rails_helper'

RSpec.describe BonusDaysCalculator do
  let(:user) { create(:user) }
  let(:school) { create(:school) }

  before { allow(user).to receive(:school).and_return(school) }

  subject { described_class.run(*args) }

  context 'nil user' do
    let(:args) { [user] }

    before { allow(user).to receive(:nil?).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'nil school' do
    let(:args) { [user] }

    before { allow(school).to receive(:nil?).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'school has paid before' do
    let(:args) { [user] }

    before { allow(school).to receive(:ever_paid_for_subscription?).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'school has not paid before' do
    let(:args) { [user, start: start] }

    context 'day is before JULY' do
      let(:start) { Date.current.change(month: described_class::JUNE, day: 1) }

      it { expect(subject).to eq 29 }
    end

    context 'day is after JULY' do
      let(:start) { Date.current.change(month: described_class::DECEMBER, day: 1) }

      it { expect(subject).to eq 30 }
    end
  end
end
