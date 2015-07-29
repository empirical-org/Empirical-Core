require 'rails_helper'
require 'io/console'

describe User, :type => :model do
  describe 'teacher concern' do
    describe '#scorebook_scores' do
      let!(:teacher) {FactoryGirl.create(:user, role: 'teacher')}
      let!(:student) {FactoryGirl.create(:user, role: 'student')}
      let!(:classroom) {FactoryGirl.create(:classroom, teacher: teacher, students: [student])}

      let!(:section) {FactoryGirl.create(:section)}
      let!(:topic_category) {FactoryGirl.create(:topic_category)}
      let!(:topic) {FactoryGirl.create(:topic, topic_category: topic_category, section: section)}
      let!(:activity_classification) {FactoryGirl.create :activity_classification}

      let!(:activity) {FactoryGirl.create(:activity, topic: topic, classification: activity_classification)}

      let!(:unit) {FactoryGirl.create(:unit)}

      let!(:classroom_activity) {FactoryGirl.create(:classroom_activity, activity: activity, classroom: classroom, unit: unit )}

      let!(:activity_session1) {FactoryGirl.create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 1.0, user: student, classroom_activity: classroom_activity, activity: activity)}
      let!(:activity_session2) {FactoryGirl.create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 0.2, user: student, classroom_activity: classroom_activity, activity: activity)}


      it 'does not return a completed activities that is not a final scores' do
        all, is_last_page = teacher.scorebook_scores
        x = all.find{|x| x[:user] == student}
        y = x[:results].find{|y| y[:id] == activity_session2.id}
        expect(y).to be_nil
      end

      it 'does return a completed activity that is a final score' do
        all, is_last_page = teacher.scorebook_scores
        x = all.find{|x| x[:user] == student}
        y = x[:results].find{|y| y[:id] == activity_session1.id}
        expect(y).to be_present
      end


    end

    describe '#is_premium?' do
      let!(:teacher) {FactoryGirl.create(:user, role: 'teacher')}
      let!(:classroom) {FactoryGirl.create(:classroom, teacher: teacher)}

      context 'user has no associated subscription' do
        it 'returns false' do
          expect(teacher.is_premium?).to be false
        end
      end

      context 'user has an associated subscription' do
        context 'that has expired' do
          let!(:subscription) {FactoryGirl.create(:subscription, user: teacher, account_limit: 1, expiration: Date.yesterday)}
          it 'returns false' do
            expect(teacher.is_premium?).to be false
          end
        end

        context 'that has not expired' do
          let!(:subscription) {FactoryGirl.create(:subscription, user: teacher, account_limit: 1, expiration: Date.tomorrow)}
          let!(:student1) {FactoryGirl.create(:user, classcode: classroom.code)}
          context 'that has passed its account limit' do
            let!(:student2) {FactoryGirl.create(:user, classcode: classroom.code)}
            it 'returns false' do
              expect(teacher.is_premium?).to be false
            end
          end

          context 'that has not passed its account limit' do
            it 'returns true' do
              expect(teacher.is_premium?).to be true
            end
          end
        end
      end
    end

    describe '#is_trial_expired_helper' do
      let!(:teacher) {FactoryGirl.create(:user, role: 'teacher')}
      let!(:classroom) {FactoryGirl.create(:classroom, teacher: teacher)}
      let!(:student1) {FactoryGirl.create(:user, classcode: classroom.code)}
      let!(:unit1) {FactoryGirl.create(:unit)}
      let!(:classroom_activity1) {FactoryGirl.create(:classroom_activity)}
      let!(:classroom_activity2) {FactoryGirl.create(:classroom_activity)}
      let!(:activity_session1)   {FactoryGirl.create(:activity_session, user: student1, classroom_activity: classroom_activity1, completed_at: trial_start_date)}
      let!(:activity_session2)   {FactoryGirl.create(:activity_session, user: student1, classroom_activity: classroom_activity2, completed_at: trial_start_date)}
      let!(:trial_start_date) {Date.yesterday}
      let!(:trial_account_limit) {1}

      context 'teacher has not exceeded limit of activity_sessions after start_date of trial' do
        let!(:updated_activity_session1) {activity_session1.update_attributes(completed_at: trial_start_date - 1)}
        it 'returns false' do
          expect(teacher.is_trial_expired_helper(trial_start_date, trial_account_limit)).to be false
        end
      end

      context 'teacher has exceeded limit of activity_sessions' do
        it 'returns true' do
          expect(teacher.is_trial_expired_helper(trial_start_date, trial_account_limit)).to be true
        end
      end
    end
  end
end
