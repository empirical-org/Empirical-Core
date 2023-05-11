# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe SendCompleteAllAssignedActivitiesNotificationWorker, type: :worker do
    subject { described_class.new }

    let(:classroom) { create(:classroom, :with_no_teacher)}
    let(:student) { create(:student, classrooms: [classroom])}
    let(:activity) { create(:activity) }
    let(:unit_template) { create(:unit_template, activities: [activity])}
    let(:unit) { create(:unit, unit_template: unit_template, activities: unit_template.activities) }
    let(:classroom_unit) do
      create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student.id])
    end
    let!(:activity_session) { create(:activity_session, user: student, activity: activity, classroom_unit: classroom_unit) }

    describe '#send_complete_all_assigned_activities' do

      it 'should return early if the student still has any incomplete activities assigned to them' do
        incomplete_activity = create(:activity)
        unit_template.activities_unit_templates.create!(activity: incomplete_activity)
        unit.unit_activities.create!(activity: incomplete_activity)

        expect(subject).not_to receive(:send_notification)

        subject.perform(activity_session.id)
      end

      it 'should send a notification if the student has incomplete activities only assigned in other classes' do
        unassigned_activity = create(:activity)
        unit_template.activities_unit_templates.create(activity: unassigned_activity)
        unit.unit_activities.create(activity: unassigned_activity, visible: true)
        create(:activity_session, user: student, activity: unassigned_activity, classroom_unit: classroom_unit, completed_at: nil, state: 'started')

        expect(subject).not_to receive(:send_notification)

        subject.perform(activity_session.id)
      end

      it 'should send a notification with appropriate values' do
        expect(subject).to receive(:send_notification)
          .with(TeacherNotifications::StudentCompletedAllAssignedActivities, {
            student_name: student.name,
            classroom_name: classroom.name
          })

        subject.perform(activity_session.id)
      end
    end

    describe '#send_notification' do
      let(:teacher1) { create(:teacher) }
      let(:teacher2) { create(:teacher) }

      before do
        classroom.classrooms_teachers.create(user: teacher1, role: 'owner')
      end

      it 'should create TeacherNotification records of the appropriate type' do
        expect do
          subject.perform(activity_session.id)
        end.to change(TeacherNotification, :count).by(1)
      end

      it 'should create a notification for each teacher of the classroom that the activity_session is related to' do
        classroom.classrooms_teachers.create(user: teacher2, role: 'coteacher')

        expect do
          subject.perform(activity_session.id)
        end.to change(TeacherNotification, :count).by(2)
      end

      it 'should skip sending notification types that the teacher does not have a TeacherNotificationSetting to receive' do
        # This should set us up to qualify for two events: completed diagnostic and completed all activities
        activity.classification.update(key: ActivityClassification::CONNECT_KEY)

        # Our current code defaults to all TeacherNotificationSettings being turned on for new teachers, so we need to specifically disable one to test for when they're off
        teacher1.teacher_notification_settings.find_by(notification_type: TeacherNotifications::StudentCompletedDiagnostic).destroy

        expect(TeacherNotifications::StudentCompletedDiagnostic).not_to receive(:create!)
        expect(TeacherNotifications::StudentCompletedAllAssignedActivities).to receive(:create!)

        subject.perform(activity_session.id)
      end
    end

    describe 'transaction' do
      # Redefined :classroom as a standard Classroom factory instance which has a teacher attached to it
      let(:classroom) { create(:classroom) }

      before do
        # This makes our one activity a Diagnostic so that its completion triggers both "StudentCompletedDiagnostic" and "StudentCompletedAllAssignedActivities"
        activity.classification.update(key: ActivityClassification::DIAGNOSTIC_KEY)
      end
    end
  end
end
