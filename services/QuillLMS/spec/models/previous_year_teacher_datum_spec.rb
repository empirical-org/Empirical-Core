# == Schema Information
#
# Table name: previous_year_teacher_data
#
#  id         :bigint           not null, primary key
#  data       :jsonb
#  year       :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_previous_year_teacher_data_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe PreviousYearTeacherDatum, type: :model do
  # it { should belong_to(:user) }
  # it { should validate_presence_of(:year)}

  context '#calculate_data' do
    #TODO: description of what I'm trying to create in this spec.
    let!(:year) { 2016 }
    let!(:teacher) { create(:user, role: 'teacher') }
    let!(:active_classroom) { create(:classroom, created_at: Date.new(year,10,1), visible: true) }
    let!(:archived_classroom) { create(:classroom, created_at: Date.new(year,10,1), visible: false)}
    let!(:current_classroom) { create(:classroom, created_at: Date.new(2021, 10, 1))}
    let!(:student1) { create(:user, role: 'student')}
    let!(:student2) { create(:user, role: 'student')}
    let!(:student3) { create(:user, role: 'student')}
    let!(:student4) { create(:user, role: 'student')}
    let!(:unit) { create(:unit, user_id: teacher.id) }
    let!(:unit3) { create(:unit, user_id: teacher.id)}
    let!(:unit2) { create(:unit, user_id: teacher.id) }
    let!(:classroom_unit1) { create(:classroom_unit, classroom: active_classroom, unit: unit, created_at: Date.new(year, 10, 1), assigned_student_ids: [student1.id, student2.id])}
    let!(:classroom_unit2) { create(:classroom_unit, classroom: archived_classroom, unit: unit3, created_at: Date.new(year, 10, 1), assigned_student_ids: [student4.id])}
    let!(:classroom_unit3) { create(:classroom_unit, classroom: current_classroom, unit: unit2, created_at: Date.new(2021, 10, 1), assigned_student_ids: [student3.id])}
    let!(:diagnostic) { create(:diagnostic_activity)}
    let!(:connect) { create(:connect_activity)}
    let!(:unit_activity) { create(:unit_activity, unit: unit, activity: diagnostic, created_at: Date.new(year, 10, 1)) }
    let!(:unit_activity3) { create(:unit_activity, unit: unit3, activity: connect, created_at: Date.new(year, 10, 1)) }
    let!(:unit_activity2) { create(:unit_activity, unit: unit2, activity: diagnostic, created_at: Date.new(2021, 10, 1)) }

    before do
      create(:classrooms_teacher, user: teacher, classroom: active_classroom)
      create(:classrooms_teacher, user: teacher, classroom: archived_classroom)
      create(:classrooms_teacher, user: teacher, classroom: current_classroom)
      create(:students_classrooms, student: student3, classroom: current_classroom)
      create(:students_classrooms, student: student4, classroom: archived_classroom)
      create(:activity_session,
        user: student1,
        classroom_unit: classroom_unit1,
        activity: diagnostic,
        state: 'finished',
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student1,
        classroom_unit: classroom_unit1,
        state: 'finished',
        activity: diagnostic,
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student2,
        classroom_unit: classroom_unit1,
        state: 'started',
        activity: diagnostic,
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student4,
        classroom_unit: classroom_unit2,
        state: 'finished',
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student3,
        classroom_unit: classroom_unit3,
        state: 'finished',
        completed_at: Date.new(2021, 10, 2)
      )
    end

    it 'should raise error if the year is the current year' do
      expect { PreviousYearTeacherDatum.create(user: teacher, year: Time.now.year) }.to raise_error("Cannot calculate data for a school year that is still ongoing.")
    end

    it 'should calculate total students' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['total_students']).to eq(3)
    end

    it 'should calculate active students' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['active_students']).to eq(2)
    end

    it 'should calculate activities assigned' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['activities_assigned']).to eq(3)
    end

    it 'should calculate activities finished' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['completed_activities']).to eq(3)
    end

    it 'should calculate activities finished per student' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['completed_activities_per_student']).to eq(1.5)
    end

    it 'should calculate percent_completed_activities' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['percent_completed_activities']).to eq(1)
    end

    it 'should calculate diagnostics_assigned' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['diagnostics_assigned']).to eq(2)
    end

    it 'should calculate diagnostics_finished' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['diagnostics_finished']).to eq(2)
    end

    it 'should calculate percent_completed_diagnostics' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['percent_completed_diagnostics']).to eq(1)
    end
  end
end
