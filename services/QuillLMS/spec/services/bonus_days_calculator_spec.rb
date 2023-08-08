# frozen_string_literal: true

require 'rails_helper'

RSpec.describe BonusDaysCalculator do
  let(:user) { create(:user) }
  let(:options) { {} }
  let(:school) { create(:school) }

  before { allow(user).to receive(:school).and_return(school) }

  subject { described_class.run(user, **options) }

  context 'nil user' do
    before { allow(user).to receive(:nil?).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'nil school' do
    before { allow(school).to receive(:nil?).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'school has paid before' do
    before { allow(school).to receive(:ever_paid_for_subscription?).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'school has not paid before' do
    let(:options) { { start: start } }

    context 'day is before JULY' do
      let(:start) { Date.current.change(month: 6, day: 1) }

      it { expect(subject).to eq 60 }
    end

    context 'day is after JULY' do
      let(:start) { Date.current.change(month: 12, day: 1) }

      it { expect(subject).to eq 30 }
    end
  end
end
