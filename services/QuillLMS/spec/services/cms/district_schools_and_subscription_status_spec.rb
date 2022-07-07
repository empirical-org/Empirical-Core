# frozen_string_literal: true

require 'rails_helper'

module Cms
  describe DistrictSchoolsAndSubscriptionStatus do
    subject { described_class.run(district, subscription) }

    let!(:district) { create(:district) }
    let!(:subscription) { create(:subscription) }
    let!(:school1) { create(:school, district: district) }
    let!(:school2) { create(:school, district: district) }

    context 'district is nil' do
      let(:district) { nil }

      it { expect(subject).to match_array [] }
    end

    context 'district has no schools' do
      before { allow(district).to receive(:schools).and_return(School.none) }

      it { expect(subject).to match_array [] }
    end

    context 'subscription is not attached to any schools' do
      it { expect(subject).to match_array [data(school1, false), data(school2, false)] }
    end

    context 'subscription is attached to school1' do
      before { create(:school_subscription, subscription: subscription, school: school1) }

      it { expect(subject).to match_array [data(school1, true), data(school2, false)] }
    end

    context 'subscription is attached to school2' do
      before { create(:school_subscription, subscription: subscription, school: school2) }

      it { expect(subject).to match_array [data(school1, false), data(school2, true)] }
    end

    context 'subscription is attached to a school outside of district' do
      before { create(:school_subscription, subscription: subscription) }

      it { expect(subject).to match_array [data(school1, false), data(school2, false)] }
    end

    context 'subscription is attached to school1 and school2' do
      before do
        create(:school_subscription, subscription: subscription, school: school1)
        create(:school_subscription, subscription: subscription, school: school2)
      end

      it { expect(subject).to match_array [data(school1, true), data(school2, true)] }
    end

    def data(school, has_subscription)
      { id: school.id, name: school.name, checked: has_subscription }
    end
  end
end
