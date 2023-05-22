# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe SendCompleteAllDiagnosticRecommendationsNotificationWorker, type: :worker do
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

    describe '#send_complete_all_diagnostic_recommendations' do
      let!(:recommendation) { create(:recommendation, unit_template: unit_template) }
      let(:diagnostic_activity) { create(:diagnostic_activity) }
      let(:diagnostic_unit_template) { create(:unit_template, activities: [diagnostic_activity])}
      let(:diagnostic_unit) { create(:unit, unit_template: diagnostic_unit_template, activities: diagnostic_unit_template.activities) }
      let(:diagnostic_classroom_unit) do
        create(:classroom_unit, unit: diagnostic_unit, classroom: classroom, assigned_student_ids: [student.id])
      end
      let!(:diagnostic_activity_session) { create(:activity_session, :finished, user: student, activity: diagnostic_activity, classroom_unit: diagnostic_classroom_unit) }

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
            student_name: student.name,
            classroom_name: classroom.name
          })

        subject.perform(activity_session.id)
      end
    end
  end
end
