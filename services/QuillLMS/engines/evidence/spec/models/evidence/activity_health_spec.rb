# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(ActivityHealth, :type => :model) do

    context 'associations' do

      it { should have_many(:prompt_healths).dependent(:destroy) }

    end

    context 'validations' do

      it { should validate_inclusion_of(:flags).in?(Evidence.flags_class::FLAGS) }

      it { should validate_numericality_of(:version).is_greater_than_or_equal_to(1) }

      it { should validate_numericality_of(:version_plays).is_greater_than_or_equal_to(0) }

      it { should validate_numericality_of(:total_plays).is_greater_than_or_equal_to(0) }

      it { should validate_inclusion_of(:completion_rate).in?(0..100)}

      it { should validate_inclusion_of(:because_final_optimal).in?(0..100)}

      it { should validate_inclusion_of(:but_final_optimal).in?(0..100)}

      it { should validate_inclusion_of(:so_final_optimal).in?(0..100)}
    end

    context 'methods' do
      describe 'poor_health_flag' do
        it 'should return true if one of the final_optimal values is less than 75' do
          activity_health = create(:evidence_activity_health, but_final_optimal: 6)

          expect(activity_health.poor_health_flag).to eq(true)
        end

        it 'should return false if all of the final_optimal values is greater than 75' do
          activity_health = create(:evidence_activity_health, but_final_optimal: 100, because_final_optimal: 100, so_final_optimal: 100)

          expect(activity_health.poor_health_flag).to eq(false)
        end

        it 'should return false if there are nil values in the final_optimal columns' do
          activity_health = create(:evidence_activity_health, but_final_optimal: nil, because_final_optimal: 100, so_final_optimal: 100)

          expect(activity_health.poor_health_flag).to eq(false)
        end
      end
    end
  end
end
