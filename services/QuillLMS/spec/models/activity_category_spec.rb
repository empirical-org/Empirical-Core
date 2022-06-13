# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_categories
#
#  id           :integer          not null, primary key
#  name         :string
#  order_number :integer
#  created_at   :datetime
#  updated_at   :datetime
#
require 'rails_helper'

RSpec.describe ActivityCategory, type: :model do
  let(:activity_category) {build(:activity_category, order_number: nil)}

  describe('#set_order_number') do
    it('sets the order number to the count of activity categories that already exist if there is no order number') do
      activity_category.set_order_number
      expect(activity_category.order_number).to eq(ActivityCategory.count)
    end

    it('does not change the order number if it is already set') do
      activity_category.order_number = 7
      activity_category.set_order_number
      expect(activity_category.order_number).to eq(7)
    end

    it('gets called before create') do
      expect(activity_category).to receive(:set_order_number)
      activity_category.save
    end

    it('does not get called before update') do
      created_activity_category = ActivityCategory.create(name: 'Another')
      expect(created_activity_category).not_to receive(:set_order_number)
      created_activity_category.update(name: 'Different')
    end

  end

end
