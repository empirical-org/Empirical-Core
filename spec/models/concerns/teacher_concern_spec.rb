require 'rails_helper'

describe User, type: :model do
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
          # for some reason Rspec was setting expiration as today if I set it at Date.yesterday, so had to minus 1 from yesterday
          let!(:subscription) {FactoryGirl.create(:subscription, user: teacher, account_limit: 1, expiration: Date.yesterday-1, account_type: 'premium')}
          it 'returns false' do
            expect(teacher.is_premium?).to be false
          end
        end

        context 'that has not expired' do
          let!(:subscription) {FactoryGirl.create(:subscription, user: teacher, account_limit: 1, expiration: Date.tomorrow, account_type: 'trial')}
          let!(:student1) {FactoryGirl.create(:user, role: 'student', classcode: classroom.code)}
          context 'that has passed its account limit' do
            let!(:student2) {FactoryGirl.create(:user, role: 'student', classcode: classroom.code)}
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


    describe '#premium_state' do
      let!(:teacher) {FactoryGirl.create(:user, role: 'teacher')}

      context 'user has never had a subscription' do
        it "returns 'none'" do
          expect(teacher.premium_state).to eq('none')
        end
      end


      #TODO: figure out why this factory girl isn't working
      context 'user is part of an admin account' do
      #   let!(:school_account) {FactoryGirl.create(:admin_account_teacher, admin_account_id: 1, teacher_id: teacher.id)}
        it "returns 'school'" #do
      #     expect(teacher.premium_state).to eq('school')
      #   end
      end

      context 'user is on a valid trial' do
        let!(:subscription) {FactoryGirl.create(:subscription, user: teacher, account_limit: 1, expiration: Date.today + 1, account_type: 'trial')}
        it "returns 'trial'" do
          expect(teacher.premium_state).to eq('trial')
        end
      end

      context 'user is on a paid plan' do
        let!(:subscription) {FactoryGirl.create(:subscription, user_id: teacher.id, account_limit: 1, expiration: Date.today + 1, account_type: 'paid')}
        it "returns 'paid'" do
          expect(teacher.premium_state).to eq('paid')
        end
      end

      context 'users trial is expired' do
        let!(:subscription) {FactoryGirl.create(:subscription, user_id: teacher.id, account_limit: 1, expiration: Date.yesterday, account_type: 'paid')}
        it "returns 'locked'" do
          expect(teacher.premium_state).to eq('locked')
        end
      end


    end

  end
end
