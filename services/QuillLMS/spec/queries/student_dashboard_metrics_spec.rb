# frozen_string_literal: true

require 'rails_helper'

describe StudentDashboardMetrics do
  before do
    wednesday_noon = Time.current.beginning_of_week(:wednesday).noon
    travel_to wednesday_noon
  end

  after do
    travel_back
  end

  let(:today) { Date.current }
  let(:july_second_of_this_year) { Date.parse("02-07-#{today.year}") }
  let(:last_july_second) { today.month > 7 ? july_second_of_this_year : july_second_of_this_year - 1.year }

  let(:today_timespent) { 30 }
  let(:yesterday_timespent) { 45 }
  let(:first_of_month_timespent) { 60 }
  let(:july_second_timespent) { 90}

  let!(:student) { create(:student) }
  let!(:classroom) { create(:classroom) }
  let!(:classroom_unit) { create(:classroom_unit, classroom: classroom) }
  let!(:activity_sessions) do
    [
      create(:activity_session, user: student, classroom_unit: classroom_unit, completed_at: Date.current, timespent: today_timespent),
      create(:activity_session, user: student, classroom_unit: classroom_unit, completed_at: Date.yesterday, timespent: yesterday_timespent),
      create(:activity_session, user: student, classroom_unit: classroom_unit, completed_at: Date.current.beginning_of_month + 1.hour, timespent: first_of_month_timespent),
      create(:activity_session, user: student, classroom_unit: classroom_unit, completed_at: last_july_second, timespent: july_second_timespent)
    ]
  end

  describe '#run' do
    it 'returns metrics for day, week, month, and year' do
      metrics = StudentDashboardMetrics.new(student, classroom.id).run

      expect(metrics[:day][:activities_completed]).to eq(1)
      expect(metrics[:day][:timespent]).to eq(today_timespent)

      expect(metrics[:week][:activities_completed]).to eq(2)
      expect(metrics[:week][:timespent]).to eq(today_timespent + yesterday_timespent)

      expect(metrics[:month][:activities_completed]).to eq(3)
      expect(metrics[:month][:timespent]).to eq(today_timespent + yesterday_timespent + first_of_month_timespent)

      expect(metrics[:year][:activities_completed]).to eq(4)
      expect(metrics[:year][:timespent]).to eq(today_timespent + yesterday_timespent + first_of_month_timespent + july_second_timespent)
    end
  end

  describe 'metrics_from_start_date' do
    it 'calculates metrics correctly from a given start date' do
      start_date = 2.days.ago
      metrics = StudentDashboardMetrics.new(student, classroom.id).metrics_from_start_date(start_date)

      expect(metrics[:activities_completed]).to eq(2)
      expect(metrics[:timespent]).to eq(today_timespent + yesterday_timespent)
    end
  end

  describe 'completed_sessions' do
    it 'only includes sessions with completed_at not nil' do
      create(:activity_session, :started, user: student, classroom_unit: classroom_unit)
      metrics_instance = StudentDashboardMetrics.new(student, classroom.id)

      expect(metrics_instance.completed_sessions.count).to eq(activity_sessions.count)
    end
  end
end
