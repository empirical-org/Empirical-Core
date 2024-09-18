# frozen_string_literal: true

require 'rails_helper'

module StudentLearningSequences
  describe FindStartActivity do
    subject { described_class.run(activity_id, classroom_unit_id) }

    let(:activity_id) { activity.id }
    let(:classroom_unit_id) { classroom_unit.id }
    let(:activity) { create(:activity) }
    let(:unit_template) { create(:unit_template, activities: [activity]) }
    let(:unit) { create(:unit, unit_template:, activities: [activity]) }
    let(:classroom_unit) { create(:classroom_unit, unit:) }

    it { expect(subject).to be(nil) }

    context 'passed a nil activity_id' do
      let(:activity_id) { nil }

      it { expect(subject).to be(nil) }
    end

    context 'activity is pre_diagnostic' do
      let(:activity) { create(:pre_diagnostic_activity) }

      it { expect(subject).to eq(activity) }
    end

    context 'activity is post_diagnostic' do
      let(:activity) { create(:diagnostic_activity) }
      let!(:pre_diagnostic) { create(:pre_diagnostic_activity, follow_up_activity_id: activity.id) }

      it { expect(subject).to eq(pre_diagnostic) }
    end

    context 'activity is part of a recommendation' do
      let(:pre_diagnostic) { create(:pre_diagnostic_activity) }
      let!(:recommendation) { create(:recommendation, activity: pre_diagnostic, unit_template:) }

      it { expect(subject).to eq(pre_diagnostic) }

      context 'activity is recommended in two different diagnostics' do
        let(:pre_diagnostic2) { create(:pre_diagnostic_activity) }
        let(:unit_template2) { create(:unit_template, activities: [activity]) }
        let(:unit2) { create(:unit, unit_template: unit_template2, activities: [activity]) }
        let!(:classroom_unit2) { create(:classroom_unit, unit: unit2) }
        let!(:recommendation2) { create(:recommendation, activity: pre_diagnostic2, unit_template: unit_template2) }

        it { expect(subject).to eq(pre_diagnostic) }

        context 'confirm we can get to the other diagnostic' do
          subject { described_class.run(activity_id, classroom_unit2.id) }

          it { expect(subject).to eq(pre_diagnostic2) }
        end
      end
    end
  end
end
