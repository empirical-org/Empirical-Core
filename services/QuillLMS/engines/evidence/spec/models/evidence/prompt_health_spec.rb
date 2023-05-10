# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_healths
#
#  id                                  :bigint           not null, primary key
#  prompt_id                           :integer          not null
#  activity_short_name                 :string           not null
#  text                                :string           not null
#  current_version                     :integer          not null
#  version_responses                   :integer          not null
#  first_attempt_optimal               :integer
#  final_attempt_optimal               :integer
#  avg_attempts                        :float
#  confidence                          :float
#  percent_automl_consecutive_repeated :integer
#  percent_automl                      :integer
#  percent_plagiarism                  :integer
#  percent_opinion                     :integer
#  percent_grammar                     :integer
#  percent_spelling                    :integer
#  avg_time_spent_per_prompt           :integer
#  evidence_activity_health_id         :bigint
#  created_at                          :datetime         not null
#  updated_at                          :datetime         not null
#
require 'rails_helper'

module Evidence
  RSpec.describe(PromptHealth, :type => :model) do

    context 'associations' do

      it { should belong_to(:activity_health) }

    end

    context 'validations' do

      it { should validate_numericality_of(:current_version).is_greater_than_or_equal_to(1) }

      it { should validate_numericality_of(:version_responses).is_greater_than_or_equal_to(0) }

      it { should validate_inclusion_of(:first_attempt_optimal).in?(0..100)}

      it { should validate_inclusion_of(:final_attempt_optimal).in?(0..100)}

      it { should validate_inclusion_of(:avg_attempts).in?(0..5)}

      it { should validate_inclusion_of(:confidence).in?(0..1)}

      it { should validate_inclusion_of(:percent_automl_consecutive_repeated).in?(0..100)}

      it { should validate_inclusion_of(:percent_automl).in?(0..100)}

      it { should validate_inclusion_of(:percent_opinion).in?(0..100)}

      it { should validate_inclusion_of(:percent_grammar).in?(0..100)}

      it { should validate_inclusion_of(:percent_plagiarism).in?(0..100)}

      it { should validate_inclusion_of(:percent_spelling).in?(0..100)}
    end

    context 'methods' do
      describe 'flag' do
        it 'should return the flag of the associated activity' do
          activity = create(:evidence_activity)
          prompt = create(:evidence_prompt, activity: activity)
          prompt_health = create(:evidence_prompt_health, prompt_id: prompt.id)

          expect(prompt_health.flag).to eq(activity.flag)
        end
      end

      describe 'conjunction' do
        it 'should return the conjunction of the associated prompt' do
          prompt = create(:evidence_prompt)
          prompt_health = create(:evidence_prompt_health, prompt_id: prompt.id)

          expect(prompt_health.conjunction).to eq(prompt.conjunction)
        end
      end

      describe 'activity_id' do
        it 'should return the id of the associated activity' do
          activity = create(:evidence_activity)
          prompt = create(:evidence_prompt, activity: activity)
          prompt_health = create(:evidence_prompt_health, prompt_id: prompt.id)

          expect(prompt_health.activity_id).to eq(activity.id)
        end
      end
    end
  end
end
