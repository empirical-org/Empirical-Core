# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::DistrictStandardsReports do
  subject { described_class.new(admin.id).results }

  describe '#results' do
    let!(:school) { create(:school) }
    let!(:teacher) { create(:teacher) }
    let!(:admin) { create(:admin) }
    let!(:classroom) { create(:classroom) }
    let!(:student1) { create(:student) }
    let!(:student2) { create(:student) }
    let!(:student3) { create(:student) }
    let!(:student4) { create(:student) }
    let!(:schools_admins) { create(:schools_admins, school: school, user: admin) }
    let!(:schools_users) { create(:schools_users, school: school, user: teacher) }
    let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher, role: "owner", classroom: classroom) }
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [student1.id, student2.id, student3.id, student4.id]) }

    let!(:standard1) { create(:standard) }
    let!(:standard2) { create(:standard) }
    let!(:standard3) { create(:standard) }

    let!(:activity1) { create(:activity, standard: standard1) }
    let!(:activity2) { create(:activity, standard: standard2) }
    let!(:activity3) { create(:activity, standard: standard1) }
    let!(:activity4) { create(:activity, standard: standard3) }

    let!(:finished_activity_session1) { create(:activity_session, :finished, activity: activity1, percentage: percentage1, timespent: timespent1, classroom_unit: classroom_unit, user: student1) }
    let!(:finished_activity_session2) { create(:activity_session, :finished, activity: activity2, percentage: percentage2, timespent: timespent2, classroom_unit: classroom_unit, user: student1) }
    let!(:finished_activity_session3) { create(:activity_session, :finished, activity: activity1, percentage: percentage3, timespent: timespent3, classroom_unit: classroom_unit, user: student2) }
    let!(:finished_activity_session4) { create(:activity_session, :finished, activity: activity2, percentage: percentage4, timespent: timespent4, classroom_unit: classroom_unit, user: student3) }
    let!(:finished_activity_session5) { create(:activity_session, :finished, activity: activity3, percentage: percentage5, timespent: timespent5, classroom_unit: classroom_unit, user: student3) }

    let(:timespent1) { 10 }
    let(:timespent2) { 20 }
    let(:timespent3) { 30 }
    let(:timespent4) { 40 }
    let(:timespent5) { 50 }

    let(:percentage1) { 80 }
    let(:percentage2) { 70 }
    let(:percentage3) { 85 }
    let(:percentage4) { 50 }
    let(:percentage5) { 90 }

    let!(:unfinished_activity_session1) { create(:activity_session, :started, activity: activity1, classroom_unit: classroom_unit, user: student2) }
    let!(:unfinished_activity_session2) { create(:activity_session, :started, activity: activity3, classroom_unit: classroom_unit, user: student4) }

    let!(:finished_activity_sessions) do
      [
        finished_activity_session1,
        finished_activity_session2,
        finished_activity_session3,
        finished_activity_session4,
        finished_activity_session5
      ]
    end

    let(:finished_standard1_activity_sessions) { finished_activity_sessions.select { |as| as.activity.standard == standard1 } }
    let(:finished_standard2_activity_sessions) { finished_activity_sessions.select { |as| as.activity.standard == standard2 } }

    let!(:finished_standard1_activities) { finished_standard1_activity_sessions.map(&:activity).uniq }
    let!(:finished_standard2_activities) { finished_standard2_activity_sessions.map(&:activity).uniq }

    let!(:finished_standard1_student_ids) { finished_standard1_activity_sessions.pluck(:user_id).uniq }
    let!(:finished_standard2_student_ids) { finished_standard2_activity_sessions.pluck(:user_id).uniq }

    let!(:proficient_count_standard1) { finished_standard1_activity_sessions.select { |as| as.percentage >= 0.80 }.pluck(:user_id).uniq }
    let!(:proficient_count_standard2) { finished_standard2_activity_sessions.select { |as| as.percentage >= 0.80 }.pluck(:user_id).uniq }

    let(:avg_timespent_standard1) { finished_standard1_activity_sessions.pluck(:timespent).sum / finished_standard1_activity_sessions.pluck(:timespent).count }
    let(:avg_timespent_standard2) { finished_standard2_activity_sessions.pluck(:timespent).sum / finished_standard2_activity_sessions.pluck(:timespent).count }

    let!(:timespent_standard1) { avg_timespent_standard1 * finished_standard1_activity_sessions.pluck(:id).uniq.count }
    let!(:timespent_standard2) { avg_timespent_standard2 * finished_standard2_activity_sessions.pluck(:id).uniq.count }

    let(:expected_result1) do
      {
        id: standard1.id,
        name: standard1.name,
        standard_level_name: standard1.standard_level.name,
        total_activity_count: finished_standard1_activities.count,
        total_student_count: finished_standard1_student_ids.count,
        proficient_count: proficient_count_standard1.count,
        timespent: timespent_standard1.to_s
      }
    end

    let(:expected_result2) do
      {
        id: standard2.id,
        name: standard2.name,
        standard_level_name: standard2.standard_level.name,
        total_activity_count: finished_standard2_activities.count,
        total_student_count: finished_standard2_student_ids.count,
        proficient_count: proficient_count_standard2.count,
        timespent: timespent_standard2.to_s
      }
    end

    it 'should return the correct results' do
      expect(subject).to eq [expected_result1, expected_result2].map(&:stringify_keys)
    end
  end
end
