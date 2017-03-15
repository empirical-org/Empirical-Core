require 'rails_helper'

describe User, type: :model do
  describe 'teacher concern' do
      let!(:teacher) {FactoryGirl.create(:user, role: 'teacher')}
      let!(:student) {FactoryGirl.create(:user, role: 'student')}
      let!(:classroom) {FactoryGirl.create(:classroom, teacher: teacher, students: [student])}
      let!(:teacher1) {FactoryGirl.create(:user, role: 'teacher')}
      let!(:student1) {FactoryGirl.create(:user, role: 'student')}
      let!(:classroom1) {FactoryGirl.create(:classroom, teacher: teacher, students: [student1])}
    describe '#scorebook_scores' do

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

    it '#classrooms_i_teach_with_students' do
      classroom_hash = classroom.attributes
      classroom_hash[:students] = classroom.students
      classroom1_hash = classroom1.attributes
      classroom1_hash[:students] = classroom1.students
      # This is a hack to get around the fact that time on Travis
      # is being "stored" with a different level of precision.
      # We'll check to make sure that the times are relatively
      # close (a difference of less than a second). If they are,
      # we'll modify the times to be equal such that the test
      # passes as long as nothing else is wrong with it.
      classrooms = teacher.classrooms_i_teach_with_students
      if(classrooms[0]['created_at'] - classroom.created_at < 1 && classrooms[0]['updated_at'] - classroom.updated_at < 1)
        classrooms[0]['created_at'] = classroom.created_at
        classrooms[0]['updated_at'] = classroom.updated_at
      end
      if(classrooms[1]['created_at'] - classroom1.created_at < 1 && classrooms[1]['updated_at'] - classroom1.updated_at < 1)
        classrooms[1]['created_at'] = classroom1.created_at
        classrooms[1]['updated_at'] = classroom1.updated_at
      end
      expect(classrooms).to eq(
        [classroom_hash, classroom1_hash]
      )
    end

    describe '#is_premium?' do
      let!(:teacher_premium_test) {FactoryGirl.create(:user, role: 'teacher')}
      let!(:classroom) {FactoryGirl.create(:classroom, teacher: teacher)}

      context 'user is part of an admin account' do
      let!(:admin_account) {FactoryGirl.create(:admin_account)}
      let!(:school_account) {FactoryGirl.create(:admin_accounts_teacher, admin_account_id: admin_account.id, teacher_id: teacher_premium_test.id)}

        it 'returns true' do
          expect(teacher_premium_test.is_premium?).to be true
        end
      end

      context 'user has no associated subscription' do
        it 'returns false' do
          expect(teacher_premium_test.is_premium?).to be false
        end
      end

      context 'user has an associated subscription' do
        context 'that has expired' do
          # for some reason Rspec was setting expiration as today if I set it at Date.yesterday, so had to minus 1 from yesterday
          let!(:subscription) {FactoryGirl.create(:subscription, user: teacher, account_limit: 1, expiration: Date.yesterday-1, account_type: 'premium')}
          it 'returns false' do
            expect(teacher_premium_test.is_premium?).to be false
          end
        end

        context 'that has not expired' do
          let!(:subscription) {FactoryGirl.create(:subscription, user: teacher_premium_test, account_limit: 1, expiration: Date.tomorrow, account_type: 'trial')}
          let!(:student1) {FactoryGirl.create(:user, role: 'student', classrooms: [classroom])}
          context 'that has passed its account limit' do
            let!(:student2) {FactoryGirl.create(:user, role: 'student', classrooms: [classroom])}
            it 'returns false' do
              expect(teacher.is_premium?).to be false
            end
          end

          context 'that has not passed its account limit' do
            it 'returns true' do
              expect(teacher_premium_test.is_premium?).to be true
            end
          end
        end
      end
    end


    describe '#premium_state' do
      let!(:teacher) {FactoryGirl.create(:user, role: 'teacher')}

      context 'user is part of an admin account' do
        let!(:admin_account) {FactoryGirl.create(:admin_account)}
        let!(:school_account) {FactoryGirl.create(:admin_accounts_teacher, admin_account_id: admin_account.id, teacher_id: teacher.id)}

        it "returns 'school'" do
          expect(teacher.premium_state).to eq('school')
        end
      end

      context 'user is on a valid trial' do
        let!(:trial_teacher) {FactoryGirl.create(:user, role: 'teacher')}
        let!(:subscription) {FactoryGirl.create(:subscription, user: trial_teacher, account_limit: 1, expiration: Date.today + 1, account_type: 'trial')}
        it "returns 'trial'" do
          expect(trial_teacher.premium_state).to eq('trial')
        end
      end

      context 'user is on a paid plan' do
        let!(:paid_teacher) {FactoryGirl.create(:user, role: 'teacher')}
        let!(:subscription) {FactoryGirl.create(:subscription, user: paid_teacher, account_limit: 1, expiration: Date.today + 1, account_type: 'paid')}
        it "returns 'paid'" do
          expect(paid_teacher.premium_state).to eq('paid')
        end
      end

      context 'users trial is expired' do
        let!(:subscription) {FactoryGirl.create(:subscription, user_id: teacher.id, account_limit: 1, expiration: Date.yesterday, account_type: 'paid')}
        it "returns 'locked'" do
          expect(teacher.premium_state).to eq('locked')
        end
      end

      context 'user has never had a subscription' do
        it "returns 'none'" do
          expect(teacher.premium_state).to eq('none')
        end
      end



    end

  end
end
