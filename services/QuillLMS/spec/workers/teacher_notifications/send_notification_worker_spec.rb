# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe SendNotificationWorker, type: :worker do
    subject { described_class.new }

    let(:classroom) { create(:classroom, :with_no_teacher) }
    let(:classroom_unit) { create(:classroom_unit, classroom: classroom) }
    let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit) }

    it 'should return early if the provided ActivitySession does not exist' do
      old_activity_session_id = activity_session.id
      activity_session.destroy


      subject.perform(old_activity_session_id)
    end

    it 'should return early if the provided ActivitySession is not complete' do
      activity_session.update(completed_at: nil, state: 'started')

      expect(subject).not_to receive(:should_send_notification?)

      subject.perform(activity_session.id)
    end

    describe '#send_notification' do
      let!(:teacher1) { create(:teacher) }
      let!(:teacher2) { create(:teacher) }

      before do
        subject.activity_session = activity_session
        activity_session.classroom.classrooms_teachers.create(user: teacher1, role: 'owner')
        activity_session.reload
      end

      it 'should create TeacherNotification records of the appropriate type' do
        expect do
          subject.send(:send_notification, StudentCompletedDiagnostic, {
            student_name: 'Student Name',
            classroom_name: 'First Period',
            diagnostic_name: 'Starter Diagnostic (Pre)'
          })
        end.to change(TeacherNotification, :count).by(1)
      end

      it 'should create a notification for each teacher of the classroom that the activity_session is related to' do
        activity_session.classroom.classrooms_teachers.create!(user: teacher2, role: 'coteacher')
        activity_session.reload

        expect do
          subject.send(:send_notification, StudentCompletedDiagnostic, {
            student_name: 'Student Name',
            classroom_name: 'First Period',
            diagnostic_name: 'Starter Diagnostic (Pre)'
          })
        end.to change(TeacherNotification, :count).by(2)
      end

      it 'should skip sending notification types that the teacher does not have a TeacherNotificationSetting to receive' do
        # Our current code defaults to all TeacherNotificationSettings being turned on for new teachers, so we need to specifically disable one to test for when they're off
        teacher1.teacher_notification_settings.find_by(notification_type: TeacherNotifications::StudentCompletedDiagnostic).destroy

        expect(StudentCompletedDiagnostic).not_to receive(:create!)
        expect(StudentCompletedAllAssignedActivities).to receive(:create!)

        subject.send(:send_notification, StudentCompletedDiagnostic, {
          student_name: 'Student Name',
          classroom_name: 'First Period',
          diagnostic_name: 'Starter Diagnostic (Pre)'
        })
        subject.send(:send_notification, StudentCompletedAllAssignedActivities, {
          student_name: 'Student Name',
          classroom_name: 'First Period'
        })
      end
    end
  end
end
