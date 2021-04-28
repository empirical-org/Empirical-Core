# == Schema Information
#
# Table name: checkboxes
#
#  id           :integer          not null, primary key
#  metadata     :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  objective_id :integer
#  user_id      :integer
#
# Indexes
#
#  index_checkboxes_on_user_id_and_objective_id  (user_id,objective_id) UNIQUE
#
require 'rails_helper'

RSpec.describe Checkbox, type: :model do
  it { should belong_to(:objective) }
  it { should belong_to(:user) }

  describe 'objective id' do
    let(:objective) { create(:objective) }
    let(:user) { create(:user, objectives: [objective]) }
    let(:checkbox) { create(:checkbox, user: user, objective: objective) }
    let(:checkbox1) { create(:checkbox, user: user) }

    it 'should allow creating a checkbox object' do
      checkbox1.objective = objective
      expect(checkbox1.save).to eq false
      expect(checkbox1.errors.messages).to eq({:objective_id=>["should only be checked once per user"]})
    end
  end

  describe 'callbacks' do

    describe '#track_onboarding_checklist_analytics' do
      let(:user) { create(:user) }

      context 'the objective is one of the onboarding objectives and the checkbox is new' do
        let!(:explore_our_library_objective) { create(:explore_our_library) }
        let(:checkbox) { build(:checkbox, objective: explore_our_library_objective, user: user) }

        it 'should run the onboarding checklist analytics worker' do
          expect(OnboardingChecklistAnalyticsWorker).to receive(:perform_async).with(checkbox.user_id)
          checkbox.save
        end

      end

      context 'the objective is one of the onboarding objectives and the checkbox is not new' do
        let!(:explore_our_library_objective) { create(:explore_our_library) }
        let(:checkbox) { create(:checkbox, objective: explore_our_library_objective, user: user) }

        it 'should not run the onboarding checklist analytics worker' do
          expect(OnboardingChecklistAnalyticsWorker).not_to receive(:perform_async).with(checkbox.user_id)
          checkbox.save
        end

      end

      context 'the objective is not one of the onboarding objectives' do
        let!(:add_school) { create(:add_school) }
        let(:checkbox) { build(:checkbox, objective: add_school, user: user) }

        it 'should not run the onboarding checklist analytics worker' do
          expect(OnboardingChecklistAnalyticsWorker).not_to receive(:perform_async).with(checkbox.user_id)
          checkbox.save
        end

      end

    end

  end

end
