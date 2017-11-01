require 'rails_helper'

describe 'ScorebookQuery' do

  let!(:teacher) {create(:user, role: 'teacher')}
  let!(:student) {create(:user, role: 'student')}
  let!(:teacher1) {create(:user, role: 'teacher')}
  let!(:student1) {create(:user, role: 'student')}
  let!(:classroom1) {create(:classroom, teacher: teacher, students: [student1])}

  let!(:classroom) {create(:classroom, teacher: teacher, students: [student])}
  let!(:section) {create(:section)}
  let!(:topic_category) {create(:topic_category)}
  let!(:topic) {create(:topic, topic_category: topic_category, section: section)}
  let!(:activity_classification) {create :activity_classification}

  let!(:activity) {create(:activity, topic: topic, classification: activity_classification)}

  let!(:unit) {create(:unit)}

  let!(:classroom_activity) {create(:classroom_activity, activity: activity, classroom: classroom, unit: unit )}
  let!(:classroom_activity) {create(:classroom_activity, activity: activity, classroom: classroom, unit: unit, assigned_student_ids: [student.id] )}

  let!(:activity_session1) {create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 1.0, user: student, classroom_activity: classroom_activity, activity: activity, is_final_score: true)}
  let!(:activity_session2) {create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 0.2, user: student, classroom_activity: classroom_activity, activity: activity, is_final_score: false)}



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
