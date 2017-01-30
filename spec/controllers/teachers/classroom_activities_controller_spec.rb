require 'spec_helper'
require 'rails_helper'

describe Teachers::ClassroomActivitiesController, type: :controller do
  let(:teacher) { FactoryGirl.create(:teacher) }

  before do
    session[:user_id] = teacher.id
  end

  describe '#update' do
    let(:classroom) { FactoryGirl.create(:classroom, teacher_id: teacher.id)}
    let(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom_id: classroom.id)}

    it 'should be able to update due dates' do
      new_due_date = '01-01-2020'
      put :update, id: classroom_activity.id, classroom_activity: {due_date: new_due_date}
      expect(Date.parse(JSON.parse(response.body).first['due_date'])).to eq Date.parse(new_due_date)
    end
  end

end
