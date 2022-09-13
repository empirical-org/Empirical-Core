# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UnitActivitiesSaver do
  let(:due_date) { 1.day.from_now }

  let(:activity_id1) { create(:activity).id }
  let(:activity_id2) { create(:activity).id }

  let(:activity_data1) { { id: activity_id1, due_date: due_date } }
  let(:activity_data2) { { "id" => activity_id2, "due_date" => due_date } }
  let(:activity_data3) { activity_data1 }
  let(:activity_data4) { { id: nil, due_date: due_date }}
  let(:activity_data5) { { due_date: due_date }}

  let(:activities_data) { [activity_data1, activity_data2, activity_data3, activity_data4, activity_data5] }
  let(:unit) { create(:unit) }

  subject { described_class.run(activities_data, unit.id) }

  it { expect { subject }.to change(UnitActivity, :count).from(0).to(2) }
  it { expect { subject }.not_to change { unit.reload.visible }.from(true) }

  context 'unit activity already exists' do
    let!(:unit_activity) { create(:unit_activity, unit: unit, visible: false) }
    let!(:orig_due_date) { unit_activity.due_date }
    let(:activity_id1) { unit_activity.activity_id }

    it { expect { subject }.to change(UnitActivity, :count).from(1).to(2) }

    it { expect { subject }.to change { unit_activity.reload.visible }.from(false).to(true) }
    it { expect { subject }.to change { unit_activity.reload.due_date}.from(orig_due_date).to(due_date) }

    context 'due date is set in activities data' do
      let(:due_date) { 1.day.from_now }

      it { expect { subject }.to change { unit_activity.reload.due_date }.from(orig_due_date).to(due_date) }
    end
  end
end
