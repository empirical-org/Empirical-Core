# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::DistrictStandardsReports do
  subject { described_class.new(admin.id).results }

  let!(:school) { create(:school) }
  let!(:teacher) { create(:teacher) }
  let!(:admin) { create(:admin) }
  let!(:classroom) { create(:classroom) }

  let!(:schools_admins) { create(:schools_admins, school: school, user: admin) }
  let!(:schools_users) { create(:schools_users, school: school, user: teacher) }
  let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher, role: "owner", classroom: classroom) }
  let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, assigned_student_ids: assigned_student_ids) }

  let(:proficient_threshold) { described_class::PROFICIENT_THRESHOLD }

  let(:student1) { create(:student) }
  let(:student2) { create(:student) }

  let(:standard1) { create(:standard) }
  let(:standard2) { create(:standard) }

  let(:percentage1) { proficient_threshold + 0.1 }
  let(:percentage2) { proficient_threshold + 0.2 }

  let(:timespent1) { 10 }
  let(:timespent2) { 20 }

  context 'no assigned students' do
    let(:assigned_student_ids) { [] }

    it { expects_results }
    it { expect(subject).to eq [] }
  end

  context 'student1 is assigned to classroom_unit' do
    let(:assigned_student_ids) { [student1.id] }

    it { expects_results }
    it { expect(subject).to eq [] }

    context 'standard1 is assigned to activity1' do
      let!(:activity1) { create(:activity, standard: standard1) }

      it { expects_results }
      it { expect(subject).to eq [] }

      context 'student1 has started activity_session with activity1' do
        before do
          create(
            :activity_session,
            :started,
            activity: activity1,
            classroom_unit: classroom_unit,
            user: student1
          )
        end

        it { expects_results }
        it { expect(subject).to eq [] }

        context 'student1 has finished activity_session with activity1' do
          before do
            create(
              :activity_session,
              :finished,
              activity: activity1,
              percentage: percentage1,
              timespent: timespent1,
              classroom_unit: classroom_unit,
              user: student1
            )
          end

          context 'percentage1 does not meet threshold' do
            let(:percentage1)  { proficient_threshold - 0.1 }

            it { expects_results }
            it { expect(subject[0]["proficient_count"]).to eq 0 }
          end

          context 'percentage1 meets threshold' do
            let(:percentage1) { proficient_threshold }

            it { expects_results }
            it { expect(subject[0]["proficient_count"]).to eq 1 }
          end

          context 'student1 has another finished another activity_session with activity1' do
            before do
              create(
                :activity_session,
                :finished,
                activity: activity1,
                percentage: percentage2,
                timespent: timespent2,
                classroom_unit: classroom_unit,
                user: student1
              )
            end

            it { expects_results }
            it { expect(subject[0]["proficient_count"]).to eq 1 }
          end
        end
      end
    end
  end

  context 'student1, student2 are assigned to classroom_unit' do
    let(:assigned_student_ids) { [student1.id, student2.id] }

    context 'two activities with different standards' do
      let(:activity1) { create(:activity, standard: standard1) }
      let(:activity2) { create(:activity, standard: standard2) }

      it { expects_results }
      it { expect(subject).to eq [] }

      context 'student1 has finished activity_session with activity1' do
        before do
          create(
            :activity_session,
            :finished,
            activity: activity1,
            percentage: percentage1,
            timespent: timespent1,
            classroom_unit: classroom_unit,
            user: student1
          )
        end

        context 'student2 has finished activity_sessions with activity1' do
          before do
            create(
              :activity_session,
              :finished,
              activity: activity1,
              percentage: percentage2,
              timespent: timespent2,
              classroom_unit: classroom_unit,
              user: student2
            )
          end

          it { expects_results }

          it do
            expect(subject.size).to eq 1
            expect(subject[0]["total_student_count"]).to eq 2
            expect(subject[0]["total_activity_count"]).to eq 1
          end

          context 'timespent2 is nil' do
            let(:timespent2) { nil }

            it { expects_results }

            # nil timespent is effectively replaced with average of all non-nil timespent
            it { expect(subject[0]["timespent"]).to eq (timespent1 + timespent1).to_s }
          end
        end

        context 'student2 has finished activity_sessions with activity2' do
          before do
            create(
              :activity_session,
              :finished,
              activity: activity2,
              percentage: percentage2,
              timespent: timespent2,
              classroom_unit: classroom_unit,
              user: student2
            )
          end

          it { expects_results }

          it do
            expect(subject.size).to eq 2
            expect(subject[0]["total_student_count"]).to eq 1
            expect(subject[0]["total_activity_count"]).to eq 1
            expect(subject[1]["total_student_count"]).to eq 1
            expect(subject[1]["total_activity_count"]).to eq 1
          end
        end
      end
    end

    context 'two activities with same standard' do
      let(:activity1) { create(:activity, standard: standard1) }
      let(:activity2) { create(:activity, standard: standard1) }

      it { expects_results }

      context 'student1 has finished activity_session with activity1' do
        before do
          create(
            :activity_session,
            :finished,
            activity: activity1,
            percentage: percentage1,
            timespent: timespent1,
            classroom_unit: classroom_unit,
            user: student1
          )
        end

        context 'student2 has finished activity_sessions with activity1' do
          before do
            create(
              :activity_session,
              :finished,
              activity: activity1,
              percentage: percentage2,
              timespent: timespent2,
              classroom_unit: classroom_unit,
              user: student2
            )
          end

          it { expects_results }

          it do
            expect(subject.size).to eq 1
            expect(subject[0]["total_activity_count"]).to eq 1
            expect(subject[0]["total_student_count"]).to eq 2
          end
        end

        context 'student2 has finished activity_sessions with activity2' do
          before do
            create(
              :activity_session,
              :finished,
              activity: activity2,
              percentage: percentage2,
              timespent: timespent2,
              classroom_unit: classroom_unit,
              user: student2
            )
          end

          it { expects_results }

          it do
            expect(subject.size).to eq 1
            expect(subject[0]["total_activity_count"]).to eq 2
            expect(subject[0]["total_student_count"]).to eq 2
          end
        end
      end
    end
  end

  def finished_activity_sessions
    ActivitySession.where(is_final_score: true).to_a
  end

  def finished_standard_activity_sessions(standard)
    finished_activity_sessions.select { |as| as.activity.standard == standard }
  end

  def finished_standard_activities(standard)
    finished_standard_activity_sessions(standard).map(&:activity).uniq
  end

  def finished_standard_student_ids(standard)
    finished_standard_activity_sessions(standard).pluck(:user_id).uniq
  end

  def proficient_standard_student_ids(standard)
    finished_standard_activity_sessions(standard).select { |as| as.percentage >= 0.80 }.pluck(:user_id).uniq
  end

  def average_timespent(standard)
    timespent_values = finished_standard_activity_sessions(standard).pluck(:timespent).compact
    timespent_values.sum / timespent_values.count
  end

  def total_timespent_standard(standard)
    average_timespent(standard) * finished_standard_activity_sessions(standard).pluck(:id).uniq.count
  end

  def expected_result(standard)
    {
      id: standard.id,
      name: standard.name,
      standard_level_name: standard.standard_level.name,
      total_activity_count: finished_standard_activities(standard).count,
      total_student_count: finished_standard_student_ids(standard).count,
      proficient_count: proficient_standard_student_ids(standard).count,
      timespent: total_timespent_standard(standard).to_s
    }.stringify_keys
  end

  def finished_standards
    finished_activity_sessions
      .map(&:activity)
      .map(&:standard)
      .uniq
  end

  def expects_results
    expect(subject).to eq(finished_standards.map { |standard| expected_result(standard) })
  end
end
