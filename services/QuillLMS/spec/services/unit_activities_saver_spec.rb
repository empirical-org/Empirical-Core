# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UnitActivitiesSaver do
  let(:due_date) { 1.day.from_now }

  let(:activity1) { create(:activity) }
  let(:activity2) { create(:activity) }

  let(:activity_data1) { { "id" => activity1.id.to_s, "due_date" => due_date } }
  let(:activity_data2) { { id: activity2.id, due_date: due_date } }
  let(:activity_data3) { activity_data2 }
  let(:activity_data4) { { id: nil, due_date: due_date }}
  let(:activity_data5) { { due_date: due_date }}

  let(:activities_data) { [activity_data1, activity_data2, activity_data3, activity_data4, activity_data5] }
  let(:unit) { create(:unit) }

  subject { described_class.run(activities_data, unit.id) }

  it { expect { subject }.to change(UnitActivity, :count).from(0).to(2) }
  it { expect { subject }.not_to change { unit.reload.visible }.from(true) }

  context 'unit activity already exists' do
    let!(:unit_activity) { create(:unit_activity, activity: activity1, unit: unit, visible: false) }
    let!(:orig_due_date) { unit_activity.due_date }

    it { expect { subject }.to change(UnitActivity, :count).from(1).to(2) }
    it { expect { subject }.to change { unit_activity.reload.visible }.from(false).to(true) }
    it { expect { subject }.to change { unit_activity.reload.due_date}.from(orig_due_date) }

    context 'no due date is set' do
      let(:due_date) { nil }

      it { expect { subject }.not_to change { unit_activity.reload.due_date }.from(orig_due_date) }
    end
  end
end
