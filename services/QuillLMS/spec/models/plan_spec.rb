# frozen_string_literal: true

# == Schema Information
#
# Table name: plans
#
#  id              :bigint           not null, primary key
#  audience        :string           not null
#  display_name    :string           not null
#  interval        :string
#  interval_count  :integer
#  name            :string           not null
#  price           :integer          default(0)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  stripe_price_id :string
#
# Indexes
#
#  index_plans_on_name  (name) UNIQUE
#
require 'rails_helper'

RSpec.describe Plan, type: :model do
  context 'validations' do
    let(:plan) { build(:plan) }

    it { expect(plan).to be_valid }

    it 'expects name to be unique' do
      existing_plan = create(:plan, name: plan.name)
      expect(plan).not_to be_valid
    end

    it 'expects a nonnegative price' do
      plan.price = '-10'
      expect(plan).not_to be_valid
    end

    it 'expects audience to be one of AUDIENCE_TYPES' do
      plan.audience = 'student'
      expect(plan).not_to be_valid
    end

    it 'expects interval to be in INTERVAL_TYPES' do
      plan.interval = 'biweekly'
      expect(plan).not_to be_valid
    end

    it 'expects a nonnegative interval count' do
      plan.interval_count = '-5'
      expect(plan).not_to be_valid
    end

    it 'expects stripe_price_id to be of a given format' do
      plan.stripe_price_id = 'not_the_price_format'
      expect(plan).not_to be_valid
    end
  end

  context 'readonly protection' do
    let(:plan) { create(:plan) }

    it { expect { plan.destroy }.to raise_error ActiveRecord::ReadOnlyRecord }
    it { expect { plan.update(price: 10) }.to raise_error ActiveRecord::ReadOnlyRecord }
    it { expect { plan.update(name: plan.name) }.to raise_error ActiveRecord::ReadOnlyRecord }
  end
end
