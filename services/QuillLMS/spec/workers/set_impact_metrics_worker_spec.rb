# frozen_string_literal: true

require 'rails_helper'

describe SetImpactMetricsWorker do
  subject { described_class.new }

  context '#perform', :big_query_snapshot do
    include_context 'QuillBigQuery TestRunner Setup'

    let!(:school) { create(:school) }
    let!(:low_income_school) { create(:school, free_lunches: 40) }
    let!(:first_classroom) { create(:classroom_with_students_and_activities) }
    let!(:second_classroom) { create(:classroom_with_students_and_activities) }
    let!(:first_schools_user) { create(:schools_users, school: school, user: first_classroom.owner)}
    let!(:second_schools_user) { create(:schools_users, school: low_income_school, user: second_classroom.owner)}
    let!(:archived_activity_session) { create(:activity_session, user: User.where(role: 'student').first, visible: false )}

    let(:runner_context) do
      [
        school,
        low_income_school,
        first_classroom,
        second_classroom,
        first_schools_user,
        second_schools_user,
        archived_activity_session
      ]
    end

    before(:all) do
      @number_of_sentences = ActivitySession.unscoped.where(state: 'finished').count.floor(-5) * 10
      @number_of_students = ActivitySession.unscoped.where(state: 'finished').count('DISTINCT(user_id)')
      teachers_query = User.select(:id)
        .joins(:units, classroom_units: :activity_sessions)
        .where("activity_sessions.state = 'finished'")
        .group('users.id')
        .having('count(activity_sessions) > ?', SetImpactMetricsWorker::ACTIVITY_SESSION_MINIMUM)
      teacher_ids = teachers_query.to_a.map(&:id)
      @number_of_teachers = teachers_query.to_a.count.floor(-2)
      schools_query = School.joins(:schools_users).where(schools_users: {user_id: teacher_ids}).distinct
      @number_of_schools = schools_query.to_a.count
      low_income_schools_query = schools_query.where("free_lunches > ?", SetImpactMetricsWorker::FREE_LUNCH_MINIMUM)
      @number_of_low_income_schools = low_income_schools_query.to_a.count
    end

    let(:query_args) { }
    let(:cte_records) { [runner_context] }

    let(:runner) { QuillBigQuery::TestRunner.new(cte_records) }

    before do
      allow(QuillBigQuery::Runner).to receive(:new).and_return(runner)
    end

    it 'should set the NUMBER_OF_SENTENCES redis value' do
      subject.perform
      expect($redis.get(PagesController::NUMBER_OF_SENTENCES)).to eq(@number_of_sentences.to_s)
    end

    # it 'should set the NUMBER_OF_STUDENTS redis value' do
    #   subject.perform
    #   expect($redis.get(PagesController::NUMBER_OF_STUDENTS)).to eq(@number_of_students.to_s)
    # end

    # it 'should set the NUMBER_OF_TEACHERS redis value' do
    #   subject.perform
    #   expect($redis.get(PagesController::NUMBER_OF_TEACHERS)).to eq(@number_of_teachers.to_s)
    # end

    # it 'should set the NUMBER_OF_SCHOOLS redis value' do
    #   subject.perform
    #   expect($redis.get(PagesController::NUMBER_OF_SCHOOLS)).to eq(@number_of_schools.to_s)
    # end

    # it 'should set the NUMBER_OF_LOW_INCOME_SCHOOLS redis value' do
    #   subject.perform
    #   expect($redis.get(PagesController::NUMBER_OF_LOW_INCOME_SCHOOLS)).to eq(@number_of_low_income_schools.to_s)
    # end
  end
end
