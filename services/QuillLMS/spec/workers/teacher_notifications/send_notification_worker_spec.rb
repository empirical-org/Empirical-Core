# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe SendNotificationWorker, type: :worker do
    let(:subject) { described_class.new }

    let(:classroom) { create(:classroom, :with_no_teacher)}
    let(:student) { create(:student, classrooms: [classroom])}
    let(:activity) { create(:activity) }
    let(:unit_template) { create(:unit_template, activities: [activity])}
    let(:unit) { create(:unit, unit_template: unit_template, activities: unit_template.activities) }
    let(:classroom_unit) do
      create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student.id])
    end
    let!(:activity_session) { create(:activity_session, user: student, activity: activity, classroom_unit: classroom_unit) }

    it 'should return early if the provided ActivitySession does not exist' do
      old_activity_session_id = activity_session.id
      activity_session.destroy

      expect(subject).not_to receive(:send_complete_diagnostic)
      expect(subject).not_to receive(:send_complete_all_diagnostic_recommendations)
      expect(subject).not_to receive(:send_complete_all_assigned_activities)

      subject.perform(old_activity_session_id)
    end

    it 'should return early if the provided ActivitySession is not complete' do
      activity_session.update(completed_at: nil, state: 'started')

      expect(subject).not_to receive(:send_complete_diagnostic)
      expect(subject).not_to receive(:send_complete_all_diagnostic_recommendations)
      expect(subject).not_to receive(:send_complete_all_assigned_activities)

      subject.perform(activity_session.id)
    end

    describe '#send_complete_diagnostic' do
      before do
        # Kill execution of non diagnostic notification logic for these specs
        allow(subject).to receive(:send_complete_all_diagnostic_recommendations).and_return(nil)
        allow(subject).to receive(:send_complete_all_assigned_activities).and_return(nil)
      end

      it 'should return early if the activity associated with the session is not a diagnostic' do
        activity_session.activity.classification.update(key: ActivityClassification::CONNECT_KEY)

        expect(subject).not_to receive(:send_notification)

        subject.perform(activity_session.id)
      end

      it 'should send a notification with appropriate values' do
        activity_session.activity.classification.update(key: ActivityClassification::DIAGNOSTIC_KEY)

        expect(subject).to receive(:send_notification)
          .with(TeacherNotifications::StudentCompletedDiagnostic, {
            student_name: activity_session.user.name,
            classroom_name: activity_session.classroom.name,
            diagnostic_name: activity_session.activity.name
          })

        subject.perform(activity_session.id)
      end
    end

    describe '#send_complete_all_diagnostic_recommendations' do
      let!(:recommendation) { create(:recommendation, unit_template: unit_template) }
      let(:diagnostic_activity) { create(:diagnostic_activity) }
      let(:diagnostic_unit_template) { create(:unit_template, activities: [diagnostic_activity])}
      let(:diagnostic_unit) { create(:unit, unit_template: diagnostic_unit_template, activities: diagnostic_unit_template.activities) }
      let(:diagnostic_classroom_unit) do
        create(:classroom_unit, unit: diagnostic_unit, classroom: classroom, assigned_student_ids: [student.id])
      end
      let!(:diagnostic_activity_session) { create(:activity_session, :finished, user: student, activity: diagnostic_activity, classroom_unit: diagnostic_classroom_unit) }

      before do
        # Kill execution of non diagnostic recommendation notification logic for these specs
        allow(subject).to receive(:send_complete_diagnostic).and_return(nil)
        allow(subject).to receive(:send_complete_all_assigned_activities).and_return(nil)
      end

      it 'should return early if the completed activity is not part of a recommendation activity pack' do
        recommendation.destroy

        expect(subject).not_to receive(:send_notification)

        subject.perform(activity_session.id)
      end

      it 'should return early if the student still has any incomplete activities in recommendation activity packs' do
        incomplete_activity = create(:activity)
        unit_template.activities_unit_templates.create!(activity: incomplete_activity)
        unit.unit_activities.create!(activity: incomplete_activity)

        recommendation.destroy

        expect(subject).not_to receive(:send_notification)

        subject.perform(activity_session.id)
      end

      it 'should return early if the student has never completed any diagnostic activities' do
        diagnostic_activity_session.destroy

        expect(subject).not_to receive(:send_notification)

        subject.perform(activity_session.id)
      end

      it 'should send a notification if the student only has incomplete recommendations in other classes' do
        new_classroom = create(:classroom, students: [student])
        create(:classroom_unit, unit: unit, classroom: new_classroom, assigned_student_ids: [student.id])

        expect(subject).to receive(:send_notification)

        subject.perform(activity_session.id)
      end

      it 'should send a notification with appropriate values' do
        expect(subject).to receive(:send_notification)
          .with(TeacherNotifications::StudentCompletedAllDiagnosticRecommendations, {
            student_name: activity_session.user.name,
            classroom_name: activity_session.classroom.name
          })

        subject.perform(activity_session.id)
      end
    end

    describe '#send_complete_all_assigned_activities' do
      before do
        # Kill execution of non diagnostic recommendation notification logic for these specs
        allow(subject).to receive(:send_complete_diagnostic).and_return(nil)
        allow(subject).to receive(:send_complete_all_diagnostic_recommendations).and_return(nil)
      end

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
            student_name: activity_session.user.name,
            classroom_name: activity_session.classroom.name
          })

        subject.perform(activity_session.id)
      end
    end

    describe '#send_notification' do
      let(:teacher1) { create(:teacher) }
      let(:teacher2) { create(:teacher) }

      it 'should create TeacherNotification records of the appropriate type' do
        classroom.classrooms_teachers.create(user: teacher1, role: 'owner')

        expect do
          subject.perform(activity_session.id)
        end.to change(TeacherNotification, :count).by(1)
      end

      it 'should create a notification for each teacher of the classroom that the activity_session is related to' do
        classroom.classrooms_teachers.create(user: teacher1, role: 'owner')
        classroom.classrooms_teachers.create(user: teacher2, role: 'coteacher')

        expect do
          subject.perform(activity_session.id)
        end.to change(TeacherNotification, :count).by(2)
      end
    end

    describe 'transaction' do
      # Redefined :classroom as a standard Classroom factory instance which has a teacher attached to it
      let(:classroom) { create(:classroom) }

      before do
        # This makes our one activity a Diagnostic so that its completion triggers both "StudentCompletedDiagnostic" and "StudentCompletedAllAssignedActivities"
        activity_session.activity.classification.update(key: ActivityClassification::DIAGNOSTIC_KEY)
      end

      it 'should write no records if there are any errors so that the job can safely re-run' do
        expect(subject).to receive(:send_complete_all_assigned_activities).and_raise(RuntimeError)

        expect do
          subject.perform(activity_session.id)
        end.to raise_error(RuntimeError)
          .and not_change(TeacherNotification, :count)
      end
    end
  end
end
