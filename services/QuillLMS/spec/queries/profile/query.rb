# frozen_string_literal: true

require 'rails_helper'

describe Profile::Query do
  subject { described_class.new }

  describe '#query' do
    let!(:student) { create(:student) }
    let!(:classroom) { create(:classroom, students: [student]) }
    let!(:unit) { create(:unit) }
    let!(:classroom_activity) { create(:classroom_activity, classroom: classroom, unit: unit, assigned_student_ids: [student.id]) }
    let!(:activity_session) { create(:activity_session, is_retry: false, classroom_activity: classroom_activity, user: student, activity: classroom_activity.activity) }


    it 'should return the right activity sessions' do
      expect(subject.query(student, "", "" , classroom.id).first).to eq(activity_session)
    end
  end
end
