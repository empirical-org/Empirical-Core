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
  it { should belong_to(:user) }
  it { should validate_presence_of(:year)}

  context '#calculate_data' do
    let!(:year) { 2016 }
    let!(:teacher) { create(:user, role: 'teacher') }
    let!(:active_classroom) { create(:classroom, created_at: Date.new(year,10,1), visible: true) }
    let!(:archived_classroom) { create(:classroom, created_at: Date.new(year,10,1), visible: false)}
    let!(:current_classroom) { create(:classroom, created_at: Date.new(2021, 10, 1))}
    let!(:student1) { create(:user, role: 'student')}
    let!(:student2) { create(:user, role: 'student')}
    let!(:student3) { create(:user, role: 'student')}
    let!(:classroom_unit1) { create(:classroom_unit, classroom: active_classroom)}
    let!(:classroom_unit2) { create(:classroom_unit, classroom: archived_classroom)}

    before do
      create(:classrooms_teacher, user: teacher, classroom: active_classroom)
      create(:classrooms_teacher, user: teacher, classroom: archived_classroom)
      create(:classrooms_teacher, user: teacher, classroom: current_classroom)
      create(:students_classrooms, student: student1, classroom: active_classroom)
      create(:students_classrooms, student: student2, classroom: archived_classroom)
      create(:students_classrooms, student: student3, classroom: current_classroom)
      create(:activity_session,
        user: student1,
        classroom_unit: classroom_unit1,
        state: 'finished',
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student1,
        classroom_unit: classroom_unit1,
        state: 'finished',
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student2,
        classroom_unit: classroom_unit2,
        state: 'finished',
        completed_at: Date.new(year, 10, 2)
      )
    end

    it 'should raise error if the year is the current year' do
      expect { PreviousYearTeacherDatum.create(user: teacher, year: Time.now.year) }.to raise_error("Cannot calculate data for a school year that is still ongoing.")
    end

    it 'should calculate total students' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['total_students']).to eq(2)
    end

    it 'should calculate active students' do
      teacher_data = PreviousYearTeacherDatum.create(user: teacher, year: year).data
      expect(teacher_data['active_students']).to eq(2)
    end
  end
end
