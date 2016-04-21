require 'rails_helper'

describe Units::Updater do

  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }

  let!(:old_kept_activity) { FactoryGirl.create(:activity) }
  let!(:old_kept_activity_old_due_date) { Date.yesterday }

  let!(:old_removed_activity) { FactoryGirl.create(:activity) }
  let!(:new_activity) { FactoryGirl.create(:activity) }

  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }

  let!(:student1) { FactoryGirl.create(:user, role: 'student', classrooms: [classroom]) }
  let!(:student2) { FactoryGirl.create(:user, role: 'student', classrooms: [classroom]) }

  let!(:old_assigned_student_ids) { [student1.id] }

  let!(:unit) { FactoryGirl.create(:unit, name: 'old_name')}
  let!(:id) { unit.id }

  let!(:old_classroom_activity1) { FactoryGirl.create(:classroom_activity,
                                                      activity: old_kept_activity,
                                                      due_date: old_kept_activity_old_due_date,
                                                      assigned_student_ids: old_assigned_student_ids,
                                                      classroom: classroom,
                                                      unit: unit) }

  let!(:old_classroom_activity2) { FactoryGirl.create(:classroom_activity,
                                                      activity: old_removed_activity,
                                                      due_date: Date.yesterday,
                                                      assigned_student_ids: old_assigned_student_ids,
                                                      classroom: classroom,
                                                      unit: unit) }

  let!(:new_name) { 'new_name' }

  let!(:old_kept_activity_new_due_date) { Date.today }
  let!(:new_activity_due_date) { Date.today }

  let!(:new_assigned_student_ids) { [student2.id] }

  let!(:activities_data) do
    [
      {
        id: old_kept_activity.id,
        due_date: old_kept_activity_new_due_date
      },
      {
        id: new_activity.id,
        due_date: new_activity_due_date
      }
    ]
  end

  let!(:classrooms_data) do
    [
      {
        id: classroom.id,
        student_ids: new_assigned_student_ids
      }
    ]
  end


  def subject
    Units::Updater.run(teacher, id, new_name, activities_data, classrooms_data)
  end

  it 'updates the units name' do
    subject
    expect(Unit.find(id).name).to eq(new_name)
  end

  it 'creates classroom_activity for new activity' do
    subject
    x = unit.classroom_activities.find_by(classroom: classroom, activity: new_activity)
    expect(x).to be_present
  end

  it 'updates due date for old kept activity' do
    subject
    expect(old_classroom_activity1.reload.due_date).to eq(old_kept_activity_new_due_date)
  end

  it 'updates assigned_student_ids for old kept activity' do
    subject
    expect(old_classroom_activity1.reload.assigned_student_ids).to eq(new_assigned_student_ids)
  end

  it 'creates a new classroom activity for the new activity' do
    subject
    x = unit.classroom_activities.find_by(classroom: classroom, activity: new_activity)
    expect(x).to be_present
  end

  it 'hides the classroom activity associated with the old removed activity' do
    subject
    x = unit.classroom_activities.find_by(classroom: classroom, activity: old_removed_activity)
    expect(x).to be_nil
    expect(ClassroomActivity.find_by(id: old_classroom_activity2.id)).to be_nil
  end

  it 'hides the activity session associated to the removed activity' do
    subject
    as = ActivitySession.where(classroom_activity: old_classroom_activity2)
    expect(as).to be_empty
  end

  it 'hides the activity session associated to the unassigned student (on the old, kept activity)' do
    subject
    as = old_classroom_activity1.activity_sessions.find_by(user: student1)
    expect(as).to be_nil
  end

  it 'creates the activity session associated to the newly assigned student (on the old, kept activity)' do
    subject
    ca = ClassroomActivity.find_by(activity: old_kept_activity, classroom: classroom)
    as = ca.activity_sessions.find_by(user: student2)
    expect(as).to be_present
  end

  it 'creates the activity session associated to the new activity' do
    subject
    ca = ClassroomActivity.find_by(classroom: classroom, activity: new_activity)
    as = ca.activity_sessions.find_by(user: student2)
    expect(as).to be_present
  end
end