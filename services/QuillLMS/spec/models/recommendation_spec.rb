# frozen_string_literal: true

# == Schema Information
#
# Table name: recommendations
#
#  id               :integer          not null, primary key
#  category         :integer          not null
#  name             :string           not null
#  order            :integer          default(0), not null
#  activity_id      :integer          not null
#  unit_template_id :integer          not null
#
# Indexes
#
#  index_recommendations_on_activity_id       (activity_id)
#  index_recommendations_on_unit_template_id  (unit_template_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (unit_template_id => unit_templates.id)
#
require 'rails_helper'

RSpec.describe Recommendation, type: :model do

  describe 'associations' do
    it { should belong_to(:activity) }
    it { should belong_to(:unit_template) }
    it { should have_many(:criteria).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_length_of(:name).is_at_most(150) }
    it { should validate_length_of(:name).is_at_least(2) }
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:activity) }
    it { should validate_presence_of(:category) }
    it { should validate_presence_of(:unit_template) }
  end

  describe 'enum' do
    it do
      expect(subject).to define_enum_for(:category).with_values([
        :independent_practice,
        :group_lesson
      ])
    end
  end
end
