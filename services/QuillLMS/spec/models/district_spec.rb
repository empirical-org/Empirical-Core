# frozen_string_literal: true

# == Schema Information
#
# Table name: districts
#
#  id             :integer          not null, primary key
#  city           :string
#  grade_range    :string
#  name           :string           not null
#  phone          :string
#  state          :string
#  token          :string
#  total_schools  :integer
#  total_students :integer
#  zipcode        :string
#  created_at     :datetime
#  updated_at     :datetime
#  clever_id      :string
#  nces_id        :integer
#
# Indexes
#
#  index_districts_on_nces_id  (nces_id) UNIQUE
#
require 'rails_helper'

describe District, type: :model do
  it { should have_many(:schools) }
  it { should have_many(:district_admins) }
  it { should have_many(:admins).through(:district_admins) }

  it_behaves_like 'a subscriber'

  context '#total_invoice' do
    let!(:district) { create(:district)}
    let!(:school) { create(:school)}
    let!(:another_school) { create(:school)}
    let!(:subscription) { create(:subscription, payment_amount: 500)}
    let!(:another_subscription) { create(:subscription, payment_amount: 100)}

    it 'should return 0 if there are no schools in the district' do
      expect(district.total_invoice).to eq(0)
    end

    it 'should return the total invoice amount for that districts schools divided by 100' do
      school.update(district: district)
      another_school.update(district: district)
      create(:school_subscription, school: school, subscription: subscription)
      create(:school_subscription, school: another_school, subscription: another_subscription)

      expect(district.total_invoice).to eq((subscription.payment_amount + another_subscription.payment_amount) / 100)
    end
  end

  context '#schools_and_subscription_status' do
    let!(:district) { create(:district) }
    let!(:school1) { create(:school, district: district) }
    let!(:school2) { create(:school, district: district) }

    subject { district.schools_and_subscription_status }

    context 'no schools' do
      before { allow(district).to receive(:schools).and_return([]) }

      it { expect(subject).to match_array [] }
    end

    context 'no district subscription' do
      it { expect(subject).to match_array [data(school1, false), data(school2, false)] }
    end

    context 'district subscription present' do
      let!(:subscription) { create(:district_subscription, district: district).subscription }

      context 'no school subscriptions present' do
        it { expect(subject).to match_array [data(school1, false), data(school2, false)] }
      end

      context 'school subscriptions present' do
        before { create(:school_subscription, subscription: subscription, school: school2) }

        it { expect(subject).to match_array [data(school1, false), data(school2, true)] }
      end
    end

    def data(school, has_subscription)
      { id: school.id, name: school.name, checked: has_subscription }
    end
  end
end
