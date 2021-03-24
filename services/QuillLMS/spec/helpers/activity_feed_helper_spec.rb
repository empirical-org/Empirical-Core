require 'rails_helper'

describe ActivityFeedHelper, type: :helper do
  include_context "Unit Assignments Variables"

  let!(:classroom_unit1) { create(:classroom_unit, classroom_id: classroom.id, assigned_student_ids: [student1.id, student2.id], assign_on_join: false)}
  let!(:activity_session1) {create(:activity_session, classroom_unit_id: classroom_unit1.id, activity_id: activity.id, user_id: student1.id, completed_at: 1.day.ago)}
  let!(:activity_session2) {create(:activity_session, classroom_unit_id: classroom_unit1.id, activity_id: activity.id, user_id: student2.id, completed_at: 2.days.ago)}

  describe '#data_for_activity_feed' do
    it "has all activity sessions completed for that teacher's classroom, in reverse chronological order" do
      activity_session
      classroom_ids = teacher.classrooms_teachers.pluck(:id)
      puts 'classroom_ids', classroom_ids
      puts 'classroom_id', classroom.id
      puts 'classroom_unit_id', classroom_unit.id
      puts 'classroom_unit1', classroom_unit1.id
      classroom_unit_ids = ClassroomUnit.where(classroom_id: classroom_ids).pluck(:id)
      puts 'classroom_unit_ids', classroom_unit_ids
      data = helper.data_for_activity_feed(teacher)
      expect(data.length).to eq(3)
      expect(data[0][:id]).to eq(activity_session.id)
      expect(data[1][:id]).to eq(activity_session1.id)
      expect(data[2][:id]).to eq(activity_session2.id)
    end
  end

  describe '#text_for_score' do
    let(:lesson_activity_session) { create(:lesson_activity_session) }
    let(:diagnostic_activity_session) { create(:diagnostic_activity_session) }
    let(:proficient_activity_session) { create(:connect_activity_session, percentage: 0.90) }
    let(:nearly_proficient_activity_session) { create(:grammar_activity_session, percentage: 0.75) }
    let(:not_yet_proficient_activity_session) { create(:proofreader_activity_session, percentage: 0.40) }

    context 'when the activity session is a lesson activity' do
      it "returns #{ActivitySession::COMPLETED}" do
        expect(helper.text_for_score(lesson_activity_session.classification.key, lesson_activity_session.percentage)).to eq(ActivitySession::COMPLETED)
      end
    end

    context 'when the activity session is a diagnostic activity' do
      it "returns #{ActivitySession::COMPLETED}" do
        expect(helper.text_for_score(diagnostic_activity_session.classification.key, diagnostic_activity_session.percentage)).to eq(ActivitySession::COMPLETED)
      end
    end

    context 'when the activity session percentage is at or above the proficiency cutoff' do
      it "returns #{ActivitySession::PROFICIENT}" do
        expect(helper.text_for_score(proficient_activity_session.classification.key, proficient_activity_session.percentage)).to eq(ActivitySession::PROFICIENT)
      end
    end

    context 'when the activity session percentage is at or above the nearly proficient cutoff' do
      it "returns #{ActivitySession::NEARLY_PROFICIENT}" do
        expect(helper.text_for_score(nearly_proficient_activity_session.classification.key, nearly_proficient_activity_session.percentage)).to eq(ActivitySession::NEARLY_PROFICIENT)
      end
    end

    context 'when the activity session percentage is below the nearly proficient cutoff' do
      it "returns #{ActivitySession::NOT_YET_PROFICIENT}" do
        expect(helper.text_for_score(not_yet_proficient_activity_session.classification.key, not_yet_proficient_activity_session.percentage)).to eq(ActivitySession::NOT_YET_PROFICIENT)
      end
    end

  end

  describe '#text_for_completed' do
    context 'when the timestamp was less than one minute ago' do
      it 'should return "0 mins ago"' do
        expect(helper.text_for_completed(30.seconds.ago)).to eq("0 mins ago")
      end
    end

    context 'when the timestamp was one minute ago' do
      it 'should return "1 min ago"' do
        expect(helper.text_for_completed(1.minute.ago)).to eq("1 min ago")
      end
    end

    context 'when the timestamp was more than one minute but less than one hour ago' do
      it 'should return "47 min ago"' do
        expect(helper.text_for_completed(47.minutes.ago)).to eq("47 mins ago")
      end
    end

    context 'when the timestamp was one hour ago' do
      it 'should return "1 hour ago"' do
        expect(helper.text_for_completed(1.hour.ago)).to eq("1 hour ago")
      end
    end

    context 'when the timestamp was more than one hour but less than a day ago' do
      it 'should return "22 hours ago"' do
        expect(helper.text_for_completed(22.hours.ago)).to eq("22 hours ago")
      end
    end

    context 'when the timestamp was one day ago' do
      it 'should return "1 day ago"' do
        expect(helper.text_for_completed(1.day.ago)).to eq("1 day ago")
      end
    end

    context 'when the timestamp was more than one day but less than one week ago' do
      it 'should return "3 days ago"' do
        expect(helper.text_for_completed(3.days.ago)).to eq("3 days ago")
      end
    end

    context 'when the timestamp was more than one week ago but this calendar year' do
      it 'should return the written out date' do
        date = 8.days.ago
        if date.year == Time.now.year
          expect(helper.text_for_completed(date)).to eq(date.strftime("%b #{date.day.ordinalize}"))
        else
          expect(helper.text_for_completed(date)).to eq(date.strftime("%b #{date.day.ordinalize}, %Y"))
        end
      end
    end

    context 'when the timestamp was a different calendar year' do
      it 'should return the written out date' do
        date = 1.year.ago
        expect(helper.text_for_completed(date)).to eq(date.strftime("%b #{date.day.ordinalize}, %Y"))
      end
    end

  end

end
