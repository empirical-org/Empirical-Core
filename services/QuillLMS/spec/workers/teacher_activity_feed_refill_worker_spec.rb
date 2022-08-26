# frozen_string_literal: true

require 'rails_helper'

describe TeacherActivityFeedRefillWorker, type: :worker do
  let(:worker) { described_class.new }

  context 'non-teacher' do
    let(:student) { create(:student) }

    it 'should not reset and refill activity feed' do
      expect(TeacherActivityFeed).to_not receive(:reset!)
      expect(TeacherActivityFeed).to_not receive(:add)

      worker.perform(student.id)
    end
  end

  context 'teacher without any classrooms' do
    let(:teacher) { create(:teacher) }

    it 'should not reset and refill activity feed' do
      expect(TeacherActivityFeed).to receive(:reset!)
      expect(TeacherActivityFeed).to_not receive(:add)

      worker.perform(teacher.id)
    end
  end

  context 'teacher with classrooms, but no activities' do
    let(:classroom) { create(:classroom)  }
    let(:teacher) { classroom.owner}

    it 'should not reset and refill activity feed' do
      expect(TeacherActivityFeed).to receive(:reset!)
      expect(TeacherActivityFeed).to_not receive(:add)

      worker.perform(teacher.id)
    end
  end

  context 'teacher with classrooms and activities' do
    let(:classroom) { create(:classroom)  }
    let(:teacher) { classroom.owner}
    let!(:student1) {create(:student)}
    let!(:student2) {create(:student)}
    let!(:classroom_unit) { create(:classroom_unit, classroom_id: classroom.id, assigned_student_ids: [student1.id, student2.id], assign_on_join: false)}
    let!(:activity_session1) {create(:activity_session, classroom_unit_id: classroom_unit.id, user_id: student1.id, completed_at: 2.days.ago)}
    let!(:activity_session2) {create(:activity_session, classroom_unit_id: classroom_unit.id, user_id: student2.id, completed_at: 1.day.ago )}

    it 'should reset and refill activity feed with latest activities first' do
      expect(TeacherActivityFeed).to receive(:reset!).with(teacher.id).once
      expect(TeacherActivityFeed).to receive(:add).with(teacher.id, [activity_session2.id, activity_session1.id])

      worker.perform(teacher.id)
    end

    it 'should exclude activities from archived classes' do
      classroom2 = create(:classroom, visible: false)
      create(:classrooms_teacher, classroom: classroom2, user: teacher)
      classroom_unit2 = create(:classroom_unit, classroom_id: classroom2.id, assigned_student_ids: [student1.id, student2.id], assign_on_join: false)
      activity_session3 = create(:activity_session, classroom_unit_id: classroom_unit2.id, user_id: student1.id, completed_at: 2.days.ago)

      expect(TeacherActivityFeed).to receive(:reset!).with(teacher.id).once
      expect(TeacherActivityFeed).to receive(:add).with(teacher.id, [activity_session2.id, activity_session1.id])

      worker.perform(teacher.id)
    end
  end
end
