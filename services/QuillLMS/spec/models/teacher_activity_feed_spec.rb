require 'rails_helper'

describe TeacherActivityFeed, type: :model do
  describe "redis feed model without callback" do

    let(:activity_session) {create(:activity_session, percentage: 0.90, completed_at: 5.minutes.ago)}
    let(:activity_session2) {create(:activity_session, percentage: 0.66, completed_at: 2.minutes.ago)}

    context "Storing and retrieving a session" do
      it 'should add and return activity sessions by order completed DESC' do
        TeacherActivityFeed.new(1).send(:delete_all)
        TeacherActivityFeed.add(1, activity_session.id)
        TeacherActivityFeed.add(1, activity_session2.id)

        feed = TeacherActivityFeed.get(1)

        expect(feed.class).to eq(Array)
        expect(feed.size).to eq(2)

        expect(feed.first[:id]).to eq(activity_session2.id)
        expect(feed.first[:completed]).to eq("2 mins ago")
        expect(feed.first[:score]).to eq("Nearly proficient")

        expect(feed.last[:id]).to eq(activity_session.id)
        expect(feed.last[:completed]).to eq("5 mins ago")
        expect(feed.last[:score]).to eq("Proficient")
      end
    end
  end

  describe "feed integration test" do
    include_context "Unit Assignments Variables"

    let!(:classroom_unit1) { create(:classroom_unit, classroom_id: classroom.id, assigned_student_ids: [student1.id, student2.id], assign_on_join: false)}
    let!(:activity_session1) {create(:activity_session, classroom_unit_id: classroom_unit1.id, activity_id: activity.id, user_id: student1.id, completed_at: 1.day.ago)}
    let!(:activity_session2) {create(:activity_session, classroom_unit_id: classroom_unit1.id, activity_id: activity.id, user_id: student2.id, completed_at: 2.days.ago)}

    describe '#data_for_activity_feed' do
      it "has all activity sessions completed for that teacher's classroom, in reverse chronological order" do
        activity_session
          classroom_ids = teacher.classrooms_teachers.pluck(:id)
          classroom_unit_ids = ClassroomUnit.where(classroom_id: classroom_ids).pluck(:id)
        data = TeacherActivityFeed.get(teacher.id)
        expect(data.length).to eq(3)
        expect(data[0][:id]).to eq(activity_session.id)
        expect(data[1][:id]).to eq(activity_session1.id)
        expect(data[2][:id]).to eq(activity_session2.id)
      end
    end

  end

  describe '#text_for_score' do
    let(:lesson_activity_session) { create(:lesson_activity_session) }
    let(:diagnostic_activity_session) { create(:diagnostic_activity_session) }
    let(:proficient_activity_session) { create(:connect_activity_session, percentage: 0.90) }
    let(:nearly_proficient_activity_session) { create(:grammar_activity_session, percentage: 0.75) }
    let(:not_yet_proficient_activity_session) { create(:proofreader_activity_session, percentage: 0.40) }

    let(:feed) { TeacherActivityFeed.new('fake_id') }

    context 'when the activity session is a lesson activity' do
      it "returns #{ActivitySession::COMPLETED}" do
        text = feed.send(:text_for_score, lesson_activity_session.classification.key, lesson_activity_session.percentage)

        expect(text).to eq(ActivitySession::COMPLETED)
      end
    end

    context 'when the activity session is a diagnostic activity' do
      it "returns #{ActivitySession::COMPLETED}" do
        text = feed.send(:text_for_score, diagnostic_activity_session.classification.key, diagnostic_activity_session.percentage)

        expect(text).to eq(ActivitySession::COMPLETED)
      end
    end

    context 'when the activity session percentage is at or above the proficiency cutoff' do
      it "returns #{ActivitySession::PROFICIENT}" do
        text = feed.send(:text_for_score, proficient_activity_session.classification.key, proficient_activity_session.percentage)

        expect(text).to eq(ActivitySession::PROFICIENT)
      end
    end

    context 'when the activity session percentage is at or above the nearly proficient cutoff' do
      it "returns #{ActivitySession::NEARLY_PROFICIENT}" do
        text = feed.send(:text_for_score, nearly_proficient_activity_session.classification.key, nearly_proficient_activity_session.percentage)

        expect(text).to eq(ActivitySession::NEARLY_PROFICIENT)
      end
    end

    context 'when the activity session percentage is below the nearly proficient cutoff' do
      it "returns #{ActivitySession::NOT_YET_PROFICIENT}" do
        text = feed.send(:text_for_score, not_yet_proficient_activity_session.classification.key, not_yet_proficient_activity_session.percentage)

        expect(text).to eq(ActivitySession::NOT_YET_PROFICIENT)
      end
    end

  end

  describe '#text_for_completed' do
    let(:feed) { TeacherActivityFeed.new('fake_id') }

    context 'when the timestamp was less than one minute ago' do
      it 'should return "0 mins ago"' do
        expect(feed.send(:text_for_completed, 30.seconds.ago)).to eq("0 mins ago")
      end
    end

    context 'when the timestamp was one minute ago' do
      it 'should return "1 min ago"' do
        expect(feed.send(:text_for_completed, 1.minute.ago)).to eq("1 min ago")
      end
    end

    context 'when the timestamp was more than one minute but less than one hour ago' do
      it 'should return "47 min ago"' do
        expect(feed.send(:text_for_completed, 47.minutes.ago)).to eq("47 mins ago")
      end
    end

    context 'when the timestamp was one hour ago' do
      it 'should return "1 hour ago"' do
        expect(feed.send(:text_for_completed, 1.hour.ago)).to eq("1 hour ago")
      end
    end

    context 'when the timestamp was more than one hour but less than a day ago' do
      it 'should return "22 hours ago"' do
        expect(feed.send(:text_for_completed, 22.hours.ago)).to eq("22 hours ago")
      end
    end

    context 'when the timestamp was one day ago' do
      it 'should return "1 day ago"' do
        expect(feed.send(:text_for_completed, 1.day.ago)).to eq("1 day ago")
      end
    end

    context 'when the timestamp was more than one day but less than one week ago' do
      it 'should return "3 days ago"' do
        expect(feed.send(:text_for_completed, 3.days.ago)).to eq("3 days ago")
      end
    end

    context 'when the timestamp was more than one week ago but this calendar year' do
      it 'should return the written out date' do
        date = 8.days.ago
        if date.year == Time.now.year
          expect(feed.send(:text_for_completed, date)).to eq(date.strftime("%b #{date.day.ordinalize}"))
        else
          expect(feed.text_for_completed(date)).to eq(date.strftime("%b #{date.day.ordinalize}, %Y"))
        end
      end
    end

    context 'when the timestamp was a different calendar year' do
      it 'should return the written out date' do
        date = 1.year.ago
        expect(feed.send(:text_for_completed, date)).to eq(date.strftime("%b #{date.day.ordinalize}, %Y"))
      end
    end
  end
end
