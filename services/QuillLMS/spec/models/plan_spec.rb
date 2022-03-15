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
#  paid            :boolean          not null
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

    it 'expects audience to be one of AUDIENCE_TYPES' do
      plan.audience = 'student'
      expect(plan).not_to be_valid
    end

    it 'expects interval to be in INTERVAL_TYPES' do
      plan.interval = 'biweekly'
      expect(plan).not_to be_valid
    end

    it 'expects interval_count to be nonnegative' do
      plan.interval_count = '-10'
      expect(plan).not_to be_valid
    end

    it 'expects stripe_price_id to be of a given format' do
      plan.stripe_price_id = 'not_the_price_format'
      expect(plan).not_to be_valid
    end
  end
end
