require 'rails_helper'

describe Teachers::ClassroomActivitiesController, type: :controller do
  let(:classroom) { create(:classroom)}
  let(:teacher) { classroom.owner }
  let(:classroom_activity) { create(:classroom_activity, classroom_id: classroom.id)}
  let(:classroom_activity2) { create(:classroom_activity, classroom_id: classroom.id, unit_id: classroom_activity.unit.id)}
  let(:classroom_activity3) { create(:classroom_activity, classroom_id: classroom.id, unit_id: classroom_activity.unit.id)}

  before do
    session[:user_id] = teacher.id
  end

  describe '#update' do
    it 'should be able to update due dates' do
      new_due_date = '01-01-2020'
      put :update, id: classroom_activity.id, classroom_activity: {due_date: new_due_date}
      expect(Date.parse(JSON.parse(response.body).first['due_date'])).to eq Date.parse(new_due_date)
    end
  end

  describe '#update_multiple_due_dates' do
    it 'should be able to update due dates for an array of classroom activity ids' do
      new_due_date = '01-01-2020'
      put :update_multiple_due_dates, {classroom_activity_ids: [classroom_activity.id, classroom_activity2.id, classroom_activity3.id], due_date: new_due_date}
      expect(classroom_activity.reload.due_date).to eq new_due_date
      expect(classroom_activity2.reload.due_date).to eq new_due_date
      expect(classroom_activity3.reload.due_date).to eq new_due_date
    end
  end

end
