# frozen_string_literal: true

require 'rails_helper'

RSpec.describe BonusDaysCalculator do
  let(:user) { create(:user) }
  let(:school) { create(:school) }

  before { allow(user).to receive(:school).and_return(school) }

  subject { described_class.run(user) }

  context 'nil user' do
    before { allow(user).to receive(:nil?).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'nil school' do
    before { allow(school).to receive(:nil?).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'school has paid before' do
    before { allow(Subscription).to receive(:school_or_user_has_ever_paid?).with(school).and_return(true) }

    it { expect(subject).to eq 0 }
  end

  context 'school has not paid before', :travel_back do
    context 'day is before JULY' do
      before { travel_to Date.current.change(month: described_class::JUNE, day: 1) }

      it { expect(subject).to eq 29 }
    end

    context 'day is after JULY' do
      before { travel_to Date.current.change(month: described_class::DECEMBER, day: 1) }

      it { expect(subject).to eq 30 }
    end
  end
end
