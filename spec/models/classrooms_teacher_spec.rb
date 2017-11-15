require 'rails_helper'

RSpec.describe ClassroomsTeacher, type: :model, redis: :true do
  let(:classrooms_teacher_with_arbitrary_role) { build(:classrooms_teacher, role: 'hippopotamus') }
  let(:classrooms_teacher_with_null_user_id) { build(:classrooms_teacher, user_id: nil) }
  let(:classrooms_teacher_with_null_classroom_id) { build(:classrooms_teacher, classroom_id: nil) }
  let(:classrooms_teacher) { build(:classrooms_teacher) }

  describe 'validations' do

    it 'should prevent saving arbitrary role' do
      expect{classrooms_teacher_with_arbitrary_role.save}.to raise_error ActiveRecord::StatementInvalid
    end

    it 'should require a user_id that is not null' do
      expect{classrooms_teacher_with_null_user_id.save}.to raise_error ActiveRecord::StatementInvalid
    end

    it 'should require a classroom_id that is not null' do
      expect{classrooms_teacher_with_null_classroom_id.save}.to raise_error ActiveRecord::StatementInvalid
    end
  end

  # describe 'callbacks' do
  #   let(:classroom) { create(:classroom, :with_no_teacher) }
  #   let(:teacher) { create(:teacher) }
  #   let(:classrooms_teacher) { build(:classrooms_teacher,
  #     classroom_id: classroom.id,
  #     user_id: teacher.id
  #   )}
  #   # it 'should trigger_analytics_events_for_classroom_creation on create commit' do
  #   #   current_jobs = ClassroomCreationWorker.jobs.size
  #   #   classrooms_teacher.save!
  #   #   expect(ClassroomCreationWorker.jobs.size).to eq(current_jobs + 1)
  #   # end
  #
  #   it 'should delete_classroom_minis_cache on create' do
  #     $redis.set("user_id:#{teacher.id}_classroom_minis", {something: 'something'})
  #     classrooms_teacher.save
  #     expect($redis.get("user_id:#{teacher.id}_classroom_minis")).to eq nil
  #   end
  # end

  describe 'associations' do
    let(:classroom) { create(:classroom, :with_no_teacher) }
    let(:teacher) { create(:teacher) }
    let(:classrooms_teacher) { create(:classrooms_teacher,
      classroom_id: classroom.id,
      user_id: teacher.id
    )}

    it 'should get the right teacher' do
      expect(classrooms_teacher.owner).to eq(teacher)
    end

    it 'should get the right classroom' do
      expect(classrooms_teacher.classroom).to eq(classroom)
    end
  end
end
