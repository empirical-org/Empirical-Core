# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe SendCompleteDiagnosticNotificationWorker, type: :worker do
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

    describe '#send_complete_diagnostic' do
      it 'should return early if the activity associated with the session is not a diagnostic' do
        activity.classification.update(key: ActivityClassification::CONNECT_KEY)

        expect(subject).not_to receive(:send_notification)

        subject.perform(activity_session.id)
      end

      it 'should send a notification with appropriate values' do
        activity.classification.update(key: ActivityClassification::DIAGNOSTIC_KEY)

        expect(subject).to receive(:send_notification)
          .with(TeacherNotifications::StudentCompletedDiagnostic, {
            student_name: student.name,
            classroom_name: classroom.name,
            diagnostic_name: activity.name
          })

        subject.perform(activity_session.id)
      end
    end
  end
end
