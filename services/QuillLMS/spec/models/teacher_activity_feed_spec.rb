# frozen_string_literal: true

require 'rails_helper'

describe TeacherActivityFeed, type: :model do
  describe 'redis feed model without callback' do

    let(:activity_session) { create(:activity_session, percentage: 0.90, completed_at: 5.minutes.ago) }
    let(:activity_session2) { create(:activity_session, percentage: 0.66, completed_at: 2.minutes.ago) }

    context 'Storing and retrieving a session' do
      it 'should add and return activity sessions by order completed DESC' do
        TeacherActivityFeed.new(1).send(:delete_all)
        TeacherActivityFeed.add(1, activity_session.id)
        TeacherActivityFeed.add(1, activity_session2.id)

        feed = TeacherActivityFeed.get(1)

        expect(feed.class).to eq(Array)
        expect(feed.size).to eq(2)

        expect(feed.first[:id]).to eq(activity_session2.id)
        expect(feed.first[:completed]).to eq('2 mins ago')
        expect(feed.first[:score]).to eq(ActivitySession::SOMETIMES_DEMONSTRATED_SKILL)

        expect(feed.last[:id]).to eq(activity_session.id)
        expect(feed.last[:completed]).to eq('5 mins ago')
        expect(feed.last[:score]).to eq(ActivitySession::FREQUENTLY_DEMONSTRATED_SKILL)
      end
    end

    context "activity_session's user gets deleted after storage" do
      it 'should not show the activity session' do
        TeacherActivityFeed.new(1).send(:delete_all)
        TeacherActivityFeed.add(1, activity_session.id)
        TeacherActivityFeed.add(1, activity_session2.id)
        # delete the user after storage
        activity_session2.update(user_id: nil)

        feed = TeacherActivityFeed.get(1)

        expect(feed.class).to eq(Array)
        expect(feed.size).to eq(1)

        expect(feed.first[:id]).to eq(activity_session.id)
        expect(feed.first[:completed]).to eq('5 mins ago')
        expect(feed.first[:score]).to eq(ActivitySession::FREQUENTLY_DEMONSTRATED_SKILL)
      end
    end
  end

  describe 'feed integration test' do
    include_context 'Unit Assignments Variables'

    let!(:classroom_unit1) { create(:classroom_unit, classroom_id: classroom.id, assigned_student_ids: [student1.id, student2.id], assign_on_join: false) }
    let!(:activity_session1) { create(:activity_session, classroom_unit_id: classroom_unit1.id, activity_id: activity.id, user_id: student1.id, completed_at: 1.day.ago) }
    let!(:activity_session2) { create(:activity_session, classroom_unit_id: classroom_unit1.id, activity_id: activity.id, user_id: student2.id, completed_at: 2.days.ago) }

    describe '#data_for_activity_feed' do
      it "has all activity sessions completed for that teacher's classroom, in reverse chronological order" do
        activity_session

        data = TeacherActivityFeed.get(teacher.id)
        expect(data.length).to eq(3)
        expect(data[0][:id]).to eq(activity_session.id)
        expect(data[1][:id]).to eq(activity_session1.id)
        expect(data[2][:id]).to eq(activity_session2.id)
      end

      it 'ignores activity sessions that have no completed_at value' do
        activity_session
        activity_session3 = create(:activity_session, classroom_unit_id: classroom_unit1.id, activity_id: activity.id, user_id: student2.id, completed_at: nil)
        activity_session3.update(state: 'started', completed_at: nil)

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
    let(:evidence_activity_session) { create(:evidence_activity_session) }
    let(:frequently_demonstrated_skill_activity_session) { create(:connect_activity_session, percentage: 0.90) }
    let(:sometimes_demonstrated_skill_activity_session) { create(:grammar_activity_session, percentage: 0.75) }
    let(:rarely_demonstrated_skill_activity_session) { create(:proofreader_activity_session, percentage: 0.30) }

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

    context 'when the activity session is a evidence activity' do
      it "returns #{ActivitySession::COMPLETED}" do
        text = feed.send(:text_for_score, evidence_activity_session.classification.key, evidence_activity_session.percentage)

        expect(text).to eq(ActivitySession::COMPLETED)
      end
    end

    context 'when the activity session percentage is at or above the frequently demonstrated skill cutoff' do
      it "returns #{ActivitySession::FREQUENTLY_DEMONSTRATED_SKILL}" do
        text = feed.send(:text_for_score, frequently_demonstrated_skill_activity_session.classification.key, frequently_demonstrated_skill_activity_session.percentage)

        expect(text).to eq(ActivitySession::FREQUENTLY_DEMONSTRATED_SKILL)
      end
    end

    context 'when the activity session percentage is at or above the sometimes demonstrated skill cutoff' do
      it "returns #{ActivitySession::SOMETIMES_DEMONSTRATED_SKILL}" do
        text = feed.send(:text_for_score, sometimes_demonstrated_skill_activity_session.classification.key, sometimes_demonstrated_skill_activity_session.percentage)

        expect(text).to eq(ActivitySession::SOMETIMES_DEMONSTRATED_SKILL)
      end
    end

    context 'when the activity session percentage is below the sometimes demonstrated skill cutoff' do
      it "returns #{ActivitySession::RARELY_DEMONSTRATED_SKILL}" do
        text = feed.send(:text_for_score, rarely_demonstrated_skill_activity_session.classification.key, rarely_demonstrated_skill_activity_session.percentage)

        expect(text).to eq(ActivitySession::RARELY_DEMONSTRATED_SKILL)
      end
    end

  end

  describe '#text_for_completed' do
    let(:feed) { TeacherActivityFeed.new('fake_id') }

    context 'when the timestamp was less than one minute ago' do
      it 'should return "0 mins ago"' do
        expect(feed.send(:text_for_completed, 30.seconds.ago)).to eq('0 mins ago')
      end
    end

    context 'when the timestamp was one minute ago' do
      it 'should return "1 min ago"' do
        expect(feed.send(:text_for_completed, 1.minute.ago)).to eq('1 min ago')
      end
    end

    context 'when the timestamp was more than one minute but less than one hour ago' do
      it 'should return "47 mins ago"' do
        expect(feed.send(:text_for_completed, 47.minutes.ago)).to eq('47 mins ago')
      end
    end

    context 'when the timestamp was one hour ago' do
      it 'should return "1 hour ago"' do
        expect(feed.send(:text_for_completed, 1.hour.ago)).to eq('1 hour ago')
      end
    end

    context 'when the timestamp was more than one hour but less than a day ago' do
      it 'should return "22 hours ago"' do
        expect(feed.send(:text_for_completed, 22.hours.ago)).to eq('22 hours ago')
      end
    end

    context 'when the timestamp was one day ago' do
      it 'should return "1 day ago"' do
        expect(feed.send(:text_for_completed, 1.day.ago)).to eq('1 day ago')
      end
    end

    context 'when the timestamp was more than one day but less than one week ago' do
      it 'should return "3 days ago"' do
        expect(feed.send(:text_for_completed, 3.days.ago)).to eq('3 days ago')
      end
    end

    context 'when the timestamp was more than one week ago' do
      it 'should return the written out date if this calendar year' do
        completed_at = Time.zone.parse('2021-01-01')
        now = Time.zone.parse('2021-01-08')

        expect(feed.send(:text_for_completed, completed_at, now)).to eq(completed_at.strftime("%b #{completed_at.day.ordinalize}"))
      end

      it 'should return the written out date if with year if not this calendar year' do
        completed_at = Time.zone.parse('2020-12-31')
        now = Time.zone.parse('2021-01-07')

        expect(feed.send(:text_for_completed, completed_at, now)).to eq(completed_at.strftime("%b #{completed_at.day.ordinalize}, %Y"))
      end
    end

    context 'when the timestamp was a different calendar year' do
      it 'should return the written out date' do
        completed_at = Time.zone.parse('2019-12-31')
        expect(feed.send(:text_for_completed, completed_at)).to eq(completed_at.strftime("%b #{completed_at.day.ordinalize}, %Y"))
      end
    end
  end
end
