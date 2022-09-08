# frozen_string_literal: true

require 'rails_helper'

describe User, type: :model do
  describe 'teacher concern' do
    let!(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
    let!(:classroom) { teacher.classrooms_i_teach.first }
    let!(:classroom1) { teacher.classrooms_i_teach.second }
    let!(:student) { classroom.students.first }
    let!(:student1) { classroom1.students.first }

    describe '#classrooms_i_teach_with_students' do
      it 'should return an array of classroom hashes with array of students on each' do
        classroom_hash = classroom.attributes
        classroom_hash[:students] = classroom.students
        classroom1_hash = classroom1.attributes
        classroom1_hash[:students] = classroom1.students
        classrooms = teacher.classrooms_i_teach_with_students
        expect(classrooms).to eq([classroom_hash, classroom1_hash])
      end
    end

    describe '#classrooms_i_own_with_students' do
      it 'should return an array of classroom hashes with array of students on each' do
        classroom_hash = classroom.attributes
        classroom_hash[:students] = classroom.students
        classroom1_hash = classroom1.attributes
        classroom1_hash[:students] = classroom1.students
        classrooms = teacher.classrooms_i_own_with_students
        [classroom_hash, classroom1_hash].each do |classroom_h|
          expect(classrooms).to include(classroom_h)
        end
      end

      it "should return an empty array if the teacher does not own any classrooms" do
        ClassroomsTeacher.where(user_id: teacher.id).update_all(role: 'coteacher')
        expect(teacher.classrooms_i_own_with_students).to eq([])
      end
    end

    describe '#classrooms_i_own_that_a_specific_user_coteaches_with_me' do
      it 'returns an empty array if a user owns no classrooms that the specific coteacher_id coteaches' do
        ct = create(:classrooms_teacher, role: 'coteacher')
        coteacher = ct.user
        expect(teacher.classrooms_i_own_that_a_specific_user_coteaches_with_me(coteacher.id)).to eq([])
      end

      it 'returns the classroom the user owns if they coteach that classroom with the coteacher_id' do
        ct = create(:classrooms_teacher, classroom: classroom, role: 'coteacher')
        coteacher = ct.user
        expect(teacher.classrooms_i_own_that_a_specific_user_coteaches_with_me(coteacher.id)).to eq([classroom])
      end

    end

    describe '#classrooms_i_own_that_have_coteachers' do

      it 'returns an empty array if a user owns no classrooms with coteachers' do
        expect(teacher.classrooms_i_own_that_have_coteachers).to eq([])
      end

      it 'returns an array with classrooms, email addresses, and names if a user owns classrooms teachers' do
        ct = create(:classrooms_teacher, classroom: classroom, role: 'coteacher')
        coteacher = ct.user

        expect(teacher.classrooms_i_own_that_have_coteachers)
          .to eq [
            "name" => ct.classroom.name,
            "coteacher_name" => coteacher.name,
            "coteacher_email" => coteacher.email,
            "coteacher_id" => coteacher.id
          ]
      end
    end

    describe '#classrooms_i_own_that_have_pending_coteacher_invitations' do

      it 'returns an empty array if a user owns no classrooms with pending coteacher invitation' do
        expect(teacher.classrooms_i_own_that_have_pending_coteacher_invitations).to eq([])
      end

      it 'returns an array with classrooms, email addresses, and names if a user owns classrooms with pending coteacher invitation' do
        coteacher_classroom_invitation = create(:coteacher_classroom_invitation)
        teacher = coteacher_classroom_invitation.invitation.inviter
        expect(teacher.classrooms_i_own_that_have_pending_coteacher_invitations).to eq(["name"=> coteacher_classroom_invitation.classroom.name, "coteacher_email"=>coteacher_classroom_invitation.invitation.invitee_email])
      end
    end

    describe '#classroom_ids_i_have_invited_a_specific_teacher_to_coteach' do
      it "returns an empty array if the user does not have any open invitations with the specified coteacher" do
        coteacher_classroom_invitation = create(:coteacher_classroom_invitation)
        teacher = coteacher_classroom_invitation.invitation.inviter
        invitee = User.find_by_email(coteacher_classroom_invitation.invitation.invitee_email)
        expect(teacher.classroom_ids_i_have_invited_a_specific_teacher_to_coteach(invitee.id + 1)).to be_empty
      end

      it "returns the id of classrooms the user has invited a specific user to coteach" do
        coteacher_classroom_invitation = create(:coteacher_classroom_invitation)
        teacher = coteacher_classroom_invitation.invitation.inviter
        invitee = User.find_by_email(coteacher_classroom_invitation.invitation.invitee_email)
        expect(teacher.classroom_ids_i_have_invited_a_specific_teacher_to_coteach(invitee.id)).to eq([coteacher_classroom_invitation.classroom.id])
      end
    end

    describe '#has_outstanding_coteacher_invitation?' do
      it "returns true if an outstanding invitation exists for the current user" do
        pending_coteacher_invitation =  create(:pending_coteacher_invitation, invitee_email: teacher.email)
        create(:coteacher_classroom_invitation, invitation: pending_coteacher_invitation)
        expect(teacher.has_outstanding_coteacher_invitation?).to eq(true)
      end

      it "returns false if an outstanding invtation does not exist for the current user" do
        expect(teacher.has_outstanding_coteacher_invitation?).to eq(false)
      end
    end

    describe '#classrooms_i_own' do
      it 'should return all visible classrooms associated with the teacher through classrooms teacher and role owner' do
        expect(teacher.classrooms_i_own).to match_array([classroom, classroom1])
        classroom.update(visible: false)
        expect(teacher.classrooms_i_own).to match_array([classroom1])
      end
    end

    describe '#classrooms_i_coteach' do
      let!(:co_taught_classroom) {create(:classroom, :with_no_teacher)}
      let!(:co_taught_classrooms_teacher) {create(:classrooms_teacher, classroom: co_taught_classroom, user: teacher, role: 'coteacher')}

      it 'should return all visible classrooms associated with the teacher through classrooms teacher and role coteacher' do
        expect(teacher.classrooms_i_coteach).to match_array([co_taught_classroom])
        co_taught_classroom.update(visible: false)
        expect(teacher.classrooms_i_coteach).to match_array([])
      end
    end

    describe '#classroom_ids_i_coteach_or_have_a_pending_invitation_to_coteach' do
      let!(:co_taught_classroom) {create(:classroom, :with_no_teacher)}
      let!(:co_taught_classrooms_teacher) {create(:classrooms_teacher, classroom: co_taught_classroom, user: teacher, role: 'coteacher')}

      let!(:pending_coteacher_invitation) {create(:pending_coteacher_invitation, inviter_id: teacher.id, invitee_email: co_taught_classrooms_teacher.user.email)}
      let!(:coteacher_classroom_invitation) {create(:coteacher_classroom_invitation, invitation_id: pending_coteacher_invitation.id)}

      it "returns all the cotaught classrooms" do
        cotaught_classroom_ids = Set.new(teacher.classrooms_i_coteach.map{|c| c.id })
        expect(teacher.classroom_ids_i_coteach_or_have_a_pending_invitation_to_coteach.superset?(cotaught_classroom_ids)).to be
      end

      it "returns all pending invitation to coteach classrooms" do
        expect(teacher.classroom_ids_i_coteach_or_have_a_pending_invitation_to_coteach.member?(coteacher_classroom_invitation.classroom_id)).to be
      end
    end

    describe '#ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of' do
      let!(:co_taught_classroom) {create(:classroom, :with_no_teacher)}
      let!(:co_taught_classrooms_teacher) {create(:classrooms_teacher, classroom: co_taught_classroom, user: teacher, role: 'coteacher')}
      let!(:co_taught_classrooms_teacher2) {create(:classrooms_teacher, user: teacher, role: 'coteacher')}

      let!(:pending_coteacher_invitation) {create(:pending_coteacher_invitation, inviter_id: teacher.id, invitee_email: co_taught_classrooms_teacher.user.email)}
      let!(:pending_coteacher_invitation2) {create(:pending_coteacher_invitation, invitee_email: co_taught_classrooms_teacher.user.email)}
      let!(:coteacher_classroom_invitation) {create(:coteacher_classroom_invitation, invitation_id: pending_coteacher_invitation.id)}
      let!(:coteacher_classroom_invitation2) {create(:coteacher_classroom_invitation, invitation_id: pending_coteacher_invitation2.id)}

      context 'with no passed classroom ids' do
        it "returns all the cotaught classrooms" do
          expect(teacher.ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of[:classrooms_teachers_ids]).to include(co_taught_classrooms_teacher.id)
        end

        it "returns all pending invitation to coteach classrooms" do
          expect(teacher.ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of[:coteacher_classroom_invitations_ids]).to include(coteacher_classroom_invitation.id)
        end
      end

      context 'with passed classroom ids' do
        it "returns cotaught classrooms if their classroom id is in the list" do
          results = teacher.ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of([co_taught_classrooms_teacher2.classroom_id])
          expect(results[:classrooms_teachers_ids]).to include(co_taught_classrooms_teacher2.id)
        end

        it "does not return cotaught classrooms if their classroom id is in the list" do
          results = teacher.ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of([co_taught_classrooms_teacher2.classroom_id])
          expect(results[:classrooms_teachers_ids]).to_not include(co_taught_classrooms_teacher.id)
        end

        it "returns coteacher classroom invitations if their classroom id is in the list" do
          results = teacher.ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of([coteacher_classroom_invitation2.classroom_id])
          expect(results[:coteacher_classroom_invitations_ids]).to include(coteacher_classroom_invitation2.id)
        end

        it "does not return cotaught classroom invitations if their classroom id is in the list" do
          results = teacher.ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of([coteacher_classroom_invitation.classroom_id])
          expect(results[:coteacher_classroom_invitations_ids]).to_not include(coteacher_classroom_invitation2.id)
        end
      end
    end

    describe '#handle_negative_classrooms_from_update_coteachers and #handle_positive_classrooms_from_update_coteachers' do
      let!(:co_taught_classroom) {create(:classroom, :with_no_teacher)}
      let!(:co_taught_classrooms_teacher) {create(:classrooms_teacher, classroom: co_taught_classroom, user: teacher, role: 'coteacher')}
      let!(:co_taught_classrooms_teacher2) {create(:classrooms_teacher, user: teacher, role: 'coteacher')}

      let!(:pending_coteacher_invitation) {create(:pending_coteacher_invitation, inviter_id: teacher.id, invitee_email: co_taught_classrooms_teacher.user.email)}
      let!(:pending_coteacher_invitation2) {create(:pending_coteacher_invitation, invitee_email: co_taught_classrooms_teacher.user.email)}
      let!(:coteacher_classroom_invitation) {create(:coteacher_classroom_invitation, invitation_id: pending_coteacher_invitation.id)}
      let!(:coteacher_classroom_invitation2) {create(:coteacher_classroom_invitation, invitation_id: pending_coteacher_invitation2.id)}

      context '#handle_negative_classrooms_from_update_coteachers' do
        it "deletes only the passed classrooms from invitations, leaving other ones unaffected" do
          expect(CoteacherClassroomInvitation.exists?(id: coteacher_classroom_invitation.id)).to be
          expect(CoteacherClassroomInvitation.exists?(id: coteacher_classroom_invitation2.id)).to be
          teacher.handle_negative_classrooms_from_update_coteachers([coteacher_classroom_invitation.classroom_id])
          expect(CoteacherClassroomInvitation.exists?(id: coteacher_classroom_invitation.id)).to_not be
          expect(CoteacherClassroomInvitation.exists?(id: coteacher_classroom_invitation2.id)).to be
        end

        it "deletes only the passed classroom from coteacher relations, leaving other ones unaffected" do
          expect(ClassroomsTeacher.exists?(id: co_taught_classrooms_teacher.id)).to be
          expect(ClassroomsTeacher.exists?(id: co_taught_classrooms_teacher2.id)).to be
          teacher.handle_negative_classrooms_from_update_coteachers([co_taught_classrooms_teacher.classroom_id])
          expect(ClassroomsTeacher.exists?(id: co_taught_classrooms_teacher.id)).to_not be
          expect(ClassroomsTeacher.exists?(id: co_taught_classrooms_teacher2.id)).to be
        end
      end

      context '#handle_positive_classrooms_from_update_coteachers' do

        it "adds new invitations to classrooms the teacher has not been invited to" do
          new_classroom = create(:classroom)

          expect { teacher.handle_positive_classrooms_from_update_coteachers([new_classroom.id], new_classroom.owner.id) }
            .to change(CoteacherClassroomInvitation, :count).by(1)
        end

        it "does not create additional invitations to classrooms the teacher has been invited to" do
          expect { teacher.handle_positive_classrooms_from_update_coteachers([co_taught_classroom.id], student.id) }
            .not_to change(CoteacherClassroomInvitation, :count)
        end
      end



    end

    describe '#archived_classrooms' do
      it 'returns an array of teachers archived classes if existing' do
        classroom.update(visible: false)
        expect(teacher.archived_classrooms).to eq([classroom])
      end

      it 'returns an empty ActiveRecord association if the teacher has no archived classes' do
        expect(teacher.archived_classrooms.empty?).to be true
      end
    end

    describe '#is_premium?' do
      context 'user has no associated subscription' do
        it 'returns false' do
          expect(teacher.is_premium?).to be false
        end
      end

      context 'user has an associated subscription' do
        context 'that has expired' do
          # for some reason Rspec was setting expiration as today if I set it at Date.yesterday, so had to minus 1 from yesterday
          let!(:subscription) { create(:subscription, expiration: Date.yesterday - 1, account_type: 'Teacher Paid') }
          let!(:user_subscription) { create(:user_subscription, user_id: teacher.id, subscription: subscription) }

          it 'returns false' do
            expect(teacher.reload.is_premium?).to be false
          end
        end

        context 'that has not expired' do
          let!(:subscription) { create(:subscription, expiration: Date.tomorrow, account_type: 'Teacher Trial') }
          let!(:user_subscription) { create(:user_subscription, user_id: teacher.id, subscription: subscription) }
          let!(:student1) { create(:user, role: 'student', classrooms: [classroom]) }

          it 'returns true' do
            expect(teacher.is_premium?).to be true
          end
        end
      end
    end

    describe '#unlink' do
      let!(:bronx_teacher) { create(:teacher_with_school) }

      context 'when the teacher is linked to a school' do
        it 'unlinks the teacher' do
          expect(bronx_teacher.reload.school).to be
          bronx_teacher.unlink
          expect(bronx_teacher.reload.school).not_to be
        end

        it 'unlinks the teacher from school subscriptions' do
          subscription = create(:subscription)
          school = bronx_teacher.reload.school
          create(:school_subscription, subscription_id: subscription.id, school_id: school.id)
          bronx_teacher.updated_school(school)
          expect(bronx_teacher.reload.subscriptions).not_to be_empty
          bronx_teacher.unlink
          expect(bronx_teacher.reload.subscriptions).to be_empty
        end
      end
    end

    describe '#updated_school' do
      let!(:queens_teacher2) { create(:teacher) }
      let!(:queens_subscription) { create(:subscription) }
      let!(:queens_school) { create :school, name: 'Queens Charter School', zipcode: '11385' }
      let!(:queens_school_sub) { create(:school_subscription, subscription_id: queens_subscription.id, school_id: queens_school.id) }
      let!(:brooklyn_school) { create :school, name: 'Brooklyn Charter School', zipcode: '11237' }
      let!(:school_with_no_subscription) { create :school, name: 'Staten Island School', zipcode: '10000' }
      let!(:queens_teacher) { create(:teacher) }
      let!(:teacher_subscription) { create(:subscription) }
      let!(:user_subscription) { create(:user_subscription, user_id: queens_teacher.id, subscription_id: teacher_subscription.id) }
      let!(:subscription) { create(:subscription) }
      let!(:brooklyn_subscription) { create(:subscription) }
      let!(:brooklyn_school_sub) { create(:school_subscription, subscription_id: brooklyn_subscription.id, school_id: brooklyn_school.id) }
      let!(:queens_teacher2_user_sub) { create(:user_subscription, user_id: queens_teacher2.id, subscription_id: queens_subscription.id) }

      context 'when the school has no subscription' do
        it 'does nothing to the teachers personal subscription' do
          expect(queens_teacher.subscription).to eq(teacher_subscription)
          queens_school_sub.destroy
          queens_teacher.updated_school(queens_school.id)
          expect(queens_teacher.subscription).to eq(teacher_subscription)
        end
      end

      context 'when the school is empty' do
        it 'does nothing to the teachers personal subscription' do
          expect(queens_teacher.subscription).to eq(teacher_subscription)
          queens_teacher.updated_school(nil)
          expect(queens_teacher.subscription).to eq(teacher_subscription)
        end
      end

      context 'when the school has a subscription' do
        describe 'and the teacher has a subscription' do

          let!(:user_sub) {create(:user_subscription, subscription: create(:subscription), user: teacher)}

          it "deletes the teacher's user_sub when the teachers changes school" do
            expect(queens_teacher2_user_sub).to be
            queens_teacher2.updated_school(brooklyn_school.id)
            expect(UserSubscription.find_by(id: queens_teacher2_user_sub.id)).not_to be
          end

          it "updates the teacher's subscription when the teacher changes school" do
            expect(queens_teacher2.subscription).to eq(queens_subscription)
            queens_teacher2.updated_school(brooklyn_school.id)
            expect(queens_teacher2.reload.subscription).to eq(brooklyn_subscription)
          end

          it "the school subscription becomes the teacher's subscription if they had teacher premium" do
            expect(teacher.subscription).to eq(user_sub.subscription)
            teacher.updated_school(brooklyn_school.id)
            expect(teacher.reload.subscription).to eq(brooklyn_subscription)
          end
        end

        describe 'and the teacher already has that school subscription' do
          it 'the user does not get a new subscription' do
            prev_subscription = queens_teacher2.subscription
            queens_teacher2.updated_school(queens_school.id)
            expect(queens_teacher2.reload.subscription).to eq(prev_subscription)
          end
        end

        describe 'and the user does not have a subscription' do
          it 'the user gets the school subscription' do
            queens_teacher2.user_subscriptions.destroy
            queens_teacher2.updated_school(brooklyn_school.id)
            expect(queens_teacher2.reload.subscription).to eq(brooklyn_school.subscription)
          end
        end
      end
    end

    describe '#premium_state' do
      context 'user has or had a subscription' do
        let!(:subscription) { create(:subscription, expiration: 1.day.from_now.to_date, account_type: 'Teacher Trial') }
        let!(:user_subscription) { create(:user_subscription, user_id: teacher.id, subscription: subscription) }

        context 'user is on a valid trial' do
          it "returns 'trial'" do
            subscription.update(account_type: 'Teacher Trial')
            expect(teacher.premium_state).to eq('trial')
          end
        end

        context 'user is on a paid plan' do
          it "returns 'paid'" do
            subscription.update(account_type: 'Teacher Paid')
            expect(teacher.premium_state).to eq('paid')
          end
        end

        context 'users trial is expired' do
          it "returns 'locked'" do
            subscription.update(expiration: Date.yesterday)
            expect(teacher.premium_state).to eq('locked')
          end
        end
      end


      context 'user has never had a subscription' do
        it "returns 'none'" do
          expect(teacher.premium_state).to eq('none')
        end
      end
    end

    describe '#google_classrooms' do
      let!(:google_classroom) { create(:classroom, :from_google) }
      let!(:archived_google_classroom) { create(:classroom, :from_google, :with_no_teacher, :archived) }
      let(:google_classroom_teacher) { google_classroom.owner }

      before { create(:classrooms_teacher, user: google_classroom_teacher, classroom: archived_google_classroom) }

      it "should return all the teacher's visible google classrooms" do
        expect(google_classroom_teacher.google_classrooms).to match_array [google_classroom]
      end

      it 'should return empty if there are no google classrooms' do
        expect(teacher.google_classrooms).to eq []
      end
    end

    describe '#clever_classrooms' do
      let(:clever_classroom) { create(:classroom, :from_clever) }
      let(:clever_classroom_teacher) { clever_classroom.owner }

      it "should return all the teacher's clever classrooms" do
        expect(clever_classroom_teacher.clever_classrooms).to eq [clever_classroom]
      end

      it 'should return empty if there are no clever classrooms' do
        expect(teacher.clever_classrooms).to eq []
      end
    end

    describe '#classroom_minis_info' do
      it 'returns an array of visible classrooms and their visible data' do
        # Make a teacher and a couple classrooms, some of which are visible and some of which aren't
        teacher = create(:teacher_with_a_couple_active_and_archived_classrooms)
        first_classroom = teacher.classrooms_i_teach.first
        second_classroom = teacher.classrooms_i_teach.second

        # Make some classroom_units for these classrooms
        first_classroom_cas = create_list(:classroom_unit_with_activity_sessions, 3, classroom: first_classroom)
        second_classroom_cas = create_list(:classroom_unit_with_activity_sessions, 2, classroom: second_classroom)

        # Make some stuff not visible to ensure we're not returning it in the query.
        first_classroom.activity_sessions.sample.update(visible: false)
        second_classroom.activity_sessions.sample.update(visible: false)

        # Update an activity session to make it not the final score.
        first_classroom.activity_sessions.sample.update(is_final_score: false)

        expected_response = teacher.classrooms_i_teach.map do |classroom|
          {
            name: classroom.name,
            id: classroom.id,
            code: classroom.code,
            google_classroom_id: classroom.google_classroom_id,
            clever_id: classroom.clever_id,
            student_count: classroom.students.length,
            activity_count: classroom.activity_sessions.where(is_final_score: true).length,
            has_coteacher: classroom.coteachers.any?,
            teacher_role: ClassroomsTeacher.find_by(user_id: teacher.id, classroom_id: classroom.id).role,
            created_at: classroom.created_at,
            grade: classroom.grade
          }.stringify_keys
        end

        expect(teacher.classroom_minis_info).to match_array(expected_response)
      end
    end

    describe '#classrooms_i_am_the_coteacher_for_with_a_specific_teacher_with_students' do
      it 'should return classrooms and students if the teacher is a coteacher' do
        coteacher = create(:classrooms_teacher, classroom: classroom, role: 'coteacher').user
        response = coteacher.classrooms_i_am_the_coteacher_for_with_a_specific_teacher_with_students(teacher.id)
        expect(response).to include(classroom.reload.attributes.merge(students: classroom.students))
      end

      it 'should return an empty array if user does not coteach with the teacher' do
        other_teacher = create(:teacher)
        response = other_teacher.classrooms_i_am_the_coteacher_for_with_a_specific_teacher_with_students(teacher.id)
        expect(response).to eq([])
      end
    end

    describe '#affiliated_with_unit?' do
      let!(:unit) { create(:unit, user: teacher) }
      let!(:ca) { create(:classroom_unit, unit: unit, classroom: classroom) }

      it 'should return true if the teacher owns the unit' do
        expect(teacher.affiliated_with_unit?(unit.id)).to be
      end

      it 'should return true if the teacher is a coteacher of the classroom with the unit' do
        coteacher = create(:classrooms_teacher, classroom: classroom, role: 'coteacher').teacher
        expect(coteacher.affiliated_with_unit?(unit.id)).to be
      end

      it 'should return false if the teacher is not affiliated with the unit' do
        random_teacher = create(:teacher)
        expect(random_teacher.affiliated_with_unit?(unit.id)).to_not be
      end
    end

    describe '#referral_code' do
      let!(:referral_code) { teacher.referrer_user.referral_code }

      it 'returns the appropriate referral code' do
        expect(teacher.referral_code).to be(referral_code)
      end
    end

    describe '#referrals' do
      it 'returns a count of referrals' do
        expect(teacher.referrals).to be(0)
        create(:referrals_user, user_id: teacher.id)
        expect(teacher.referrals).to be(1)
        create(:referrals_user, user_id: teacher.id)
        expect(teacher.referrals).to be(2)
      end
    end
  end

  describe '#teaches_student?' do
    let(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
    let(:student_id) { teacher.classrooms_i_own.first.students.first.id }
    let(:coteacher) { create(:coteacher_classrooms_teacher, classroom: teacher.classrooms_i_own.first).teacher }
    let(:other_teacher) { create(:teacher) }

    it 'should return true if the user teaches this student' do
      expect(teacher.teaches_student?(student_id)).to be(true)
    end

    it 'should return true if the user coteaches this student' do
      expect(coteacher.teaches_student?(student_id)).to be(true)
    end

    it 'should return false if the user does not teach this student' do
      expect(other_teacher.teaches_student?(student_id)).to be(false)
    end
  end

  context 'callbacks' do
    describe '#ortto_newsletter_callback' do
      let!(:teacher) { create(:teacher, send_newsletter: false) }
      it 'should call NewsletterWorker when User.send_newsletter is changed' do
        expect(OrttoIntegration::NewsletterWorker).to receive(:perform_async).once
        teacher.update!(send_newsletter: true)
      end

      it 'should not call NewsletterWorker called when User.send_newsletter is unchanged' do
        expect(OrttoIntegration::NewsletterWorker).not_to receive(:perform_async)
        teacher.update!(role: 'staff')
      end
    end
  end

  describe '#assigned_students_per_activity_assigned' do
    context 'assigned students' do
      let!(:teacher) { create(:teacher, :with_classrooms_students_and_activities) }
      let!(:assigned_units) { teacher.assigned_students_per_activity_assigned }

      it 'should return only the correct students assigned' do
        student_ids = assigned_units.pluck(:assigned_student_ids).flatten

        other_teacher = create(:teacher, :with_classrooms_students_and_activities)
        other_assigned_activities_ids = other_teacher.assigned_students_per_activity_assigned.pluck(:id)
        other_student_ids = other_teacher.assigned_students_per_activity_assigned
          .pluck(:assigned_student_ids)
          .flatten

        expect(other_assigned_activities_ids & assigned_units.pluck(:id)).to be_empty
        expect(other_student_ids & student_ids).to be_empty

        teacher.classroom_units.each do |cu|
          cu.unit.unit_activities.each do |ua|
            matching_element = assigned_units.detect {|u| u.id == ua.activity_id && u.assigned_student_ids == cu.assigned_student_ids}
            expect(matching_element.assigned_student_ids).to eq(cu.assigned_student_ids)
          end
        end
      end
    end

    context 'no assigned students' do
      it 'should return empty array if no students are assigned' do
        teacher = create(:teacher)
        expect(teacher.assigned_students_per_activity_assigned).to be_empty
      end
    end
  end
end
