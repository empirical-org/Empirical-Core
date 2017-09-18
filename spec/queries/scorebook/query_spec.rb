require 'rails_helper'

describe 'ScorebookQuery' do

  let!(:teacher) {FactoryGirl.create(:user, role: 'teacher')}
  let!(:student) {FactoryGirl.create(:user, role: 'student')}
  let!(:teacher1) {FactoryGirl.create(:user, role: 'teacher')}
  let!(:student1) {FactoryGirl.create(:user, role: 'student')}
  let!(:classroom1) {FactoryGirl.create(:classroom, teacher: teacher, students: [student1])}

  let!(:classroom) {FactoryGirl.create(:classroom, teacher: teacher, students: [student])}
  let!(:section) {FactoryGirl.create(:section)}
  let!(:topic_category) {FactoryGirl.create(:topic_category)}
  let!(:topic) {FactoryGirl.create(:topic, topic_category: topic_category, section: section)}
  let!(:activity_classification) {FactoryGirl.create :activity_classification}

  let!(:activity) {FactoryGirl.create(:activity, topic: topic, classification: activity_classification)}

  let!(:unit) {FactoryGirl.create(:unit)}

  let!(:classroom_activity) {FactoryGirl.create(:classroom_activity, activity: activity, classroom: classroom, unit: unit )}

  let!(:activity_session1) {FactoryGirl.create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 1.0, user: student, classroom_activity: classroom_activity, activity: activity, is_final_score: true)}
  let!(:activity_session2) {FactoryGirl.create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 0.2, user: student, classroom_activity: classroom_activity, activity: activity, is_final_score: false)}



  it 'returns a completed activity that is a final scores' do
    results = Scorebook::Query.run(classroom.id)
    expect(results.map{|res| res["id"]}).to include(activity_session1.id.to_s)
  end

  describe 'support date constraints' do
    it 'returns activities completed between the specified dates' do
      begin_date = activity_session1.completed_at - 1.days
      end_date = activity_session1.completed_at + 1.days
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date, end_date)
      expect(results.map{|res| res['id']}).to include(activity_session1.id.to_s)
    end

    it 'does not return activities completed after the specified end date' do
      begin_date = activity_session1.completed_at + 1.days
      end_date = activity_session1.completed_at + 2.days
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date, end_date)
      expect(results.map{|res| res['id']}).not_to include(activity_session1.id.to_s)
    end

    it 'does not return activities completed before the specified start date' do
      begin_date = activity_session1.completed_at - 2.days
      end_date = activity_session1.completed_at - 1.days
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date, end_date)
      expect(results.map{|res| res['id']}).not_to include(activity_session1.id.to_s)
    end
  end

end
