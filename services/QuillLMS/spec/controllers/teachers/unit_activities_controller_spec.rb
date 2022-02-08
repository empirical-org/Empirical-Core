# frozen_string_literal: true

require 'rails_helper'

describe Teachers::UnitActivitiesController, type: :controller do
  let(:classroom) { create(:classroom)}
  let(:teacher) { classroom.owner }
  let(:unit_activity) { create(:unit_activity)}
  let(:unit_activity2) { create(:unit_activity, unit_id: unit_activity.unit.id)}
  let(:unit_activity3) { create(:unit_activity, unit_id: unit_activity.unit.id)}
  let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit_id: unit_activity.unit.id)}

  before { allow(controller).to receive(:current_user) { teacher } }

  it { should use_before_action :authorize! }
  it { should use_before_action :teacher! }

  describe '#hide' do
    let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit) }
    let!(:activity_session1) { create(:activity_session, classroom_unit: classroom_unit) }

    it 'should hide the unit and kick off ResetLessonCacheWorker' do
      expect(ResetLessonCacheWorker).to receive_message_chain(:new, :perform).with(no_args).with(teacher.id)
      put :hide, params: { id: unit_activity.id }
      expect(unit_activity.reload.visible).to eq false
    end
  end

  describe '#update' do
    it 'should be able to update due dates' do
      new_due_date = '01-01-2020'
      put :update, params: { id: unit_activity.id, unit_activity: {due_date: new_due_date} }
      expect(Date.parse(JSON.parse(response.body).first['due_date'])).to eq Date.parse(new_due_date)
    end
  end

  describe '#update_multiple_due_dates' do
    it 'should be able to update due dates for an array of unit_activity ids' do
      new_due_date = '01-01-2020'
      put :update_multiple_due_dates, params: { unit_activity_ids: [unit_activity.id, unit_activity2.id, unit_activity3.id], due_date: new_due_date }
      expect(unit_activity.reload.due_date).to eq new_due_date
      expect(unit_activity2.reload.due_date).to eq new_due_date
      expect(unit_activity3.reload.due_date).to eq new_due_date
    end
  end

end
