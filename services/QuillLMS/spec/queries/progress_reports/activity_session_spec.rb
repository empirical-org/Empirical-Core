# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::ActivitySession do
  include_context 'Standard Progress Report'

  subject { ProgressReports::ActivitySession.new(teacher).results(filters).to_a }

  context 'sorting' do
    before do
      Timecop.freeze
    end

    after do
      Timecop.return
    end

    context 'by default' do
      let(:filters) { {} }

      it 'sorts by last_name descending' do
        expect(subject.first.user.name).to eq(alice.name)
      end
    end

    context 'by activity classification' do
      let(:filters) { {sort: {field: 'activity_classification_name', direction: 'asc'} } }

      it 'retrieves results in the appropriate order' do
        # Primary sort by classification name, secondary by student name
        expect(subject.first.user.name).to eq(alice.name)
      end
    end

    context 'by student name' do
      let(:filters) { {sort: {field: 'student_name', direction: 'desc'} } }

      it 'retrieves results in the appropriate order' do
        expect(subject.first.user.name).to eq(fred.name)
      end
    end

    context 'by completion date' do
      let(:filters) { {sort: {field: 'completed_at', direction: 'desc'} } }

      it 'retrieves results in the appropriate order' do
        expect(subject.first.completed_at).to be_within(1.second).of fred_first_grade_standard_session.completed_at
      end
    end

    context 'by activity name' do
      let(:filters) { {sort: {field: 'activity_name', direction: 'asc'} } }

      it 'retrieves results in the appropriate order' do
        expect(subject.first.activity.name).to eq(activity_for_first_grade_standard.name)
      end
    end

    context 'by score' do
      let(:filters) { {sort: {field: 'percentage', direction: 'desc'} } }

      it 'retrieves results in the appropriate order' do
        expect(subject.first.percentage).to eq(best_score_sessions.first.percentage)
      end
    end

    context 'timespent' do
      let(:filters) { {sort: {field: 'timespent', direction: 'desc'} } }

      it 'retrieves results in the appropriate order' do
        expect(subject.first.timespent).to eq(best_score_sessions.first.timespent)
      end
    end

    context 'by standard' do
      let(:filters) { {sort: {field: 'standard', direction: 'asc'} } }

      it 'retrieves results in the appropriate order' do
        expect(subject.first.activity.standard.name).to eq(first_grade_standard.name)
      end
    end
  end
end
