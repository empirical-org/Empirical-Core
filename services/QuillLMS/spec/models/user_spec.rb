# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                    :integer          not null, primary key
#  account_type          :string           default("unknown")
#  active                :boolean          default(FALSE)
#  classcode             :string
#  email                 :string
#  flags                 :string           default([]), not null, is an Array
#  flagset               :string           default("production"), not null
#  ip_address            :inet
#  last_active           :datetime
#  last_sign_in          :datetime
#  name                  :string
#  password_digest       :string
#  role                  :string           default("user")
#  send_newsletter       :boolean          default(FALSE)
#  signed_up_with_google :boolean          default(FALSE)
#  time_zone             :string
#  title                 :string
#  token                 :string
#  username              :string
#  created_at            :datetime
#  updated_at            :datetime
#  clever_id             :string
#  google_id             :string
#  stripe_customer_id    :string
#
# Indexes
#
#  email_idx                          (email) USING gin
#  index_users_on_active              (active)
#  index_users_on_classcode           (classcode)
#  index_users_on_clever_id           (clever_id)
#  index_users_on_email               (email)
#  index_users_on_google_id           (google_id)
#  index_users_on_role                (role)
#  index_users_on_stripe_customer_id  (stripe_customer_id)
#  index_users_on_time_zone           (time_zone)
#  index_users_on_token               (token)
#  index_users_on_username            (username)
#  name_idx                           (name) USING gin
#  unique_index_users_on_clever_id    (clever_id) UNIQUE WHERE ((clever_id IS NOT NULL) AND ((clever_id)::text <> ''::text) AND ((id > 5593155) OR ((role)::text = 'student'::text)))
#  unique_index_users_on_email        (email) UNIQUE WHERE ((id > 1641954) AND (email IS NOT NULL) AND ((email)::text <> ''::text))
#  unique_index_users_on_google_id    (google_id) UNIQUE WHERE ((id > 1641954) AND (google_id IS NOT NULL) AND ((google_id)::text <> ''::text))
#  unique_index_users_on_username     (username) UNIQUE WHERE ((id > 1641954) AND (username IS NOT NULL) AND ((username)::text <> ''::text))
#  username_idx                       (username) USING gin
#  users_to_tsvector_idx              (to_tsvector('english'::regconfig, (name)::text)) USING gin
#  users_to_tsvector_idx1             (to_tsvector('english'::regconfig, (email)::text)) USING gin
#  users_to_tsvector_idx2             (to_tsvector('english'::regconfig, (role)::text)) USING gin
#  users_to_tsvector_idx3             (to_tsvector('english'::regconfig, (classcode)::text)) USING gin
#  users_to_tsvector_idx4             (to_tsvector('english'::regconfig, (username)::text)) USING gin
#  users_to_tsvector_idx5             (to_tsvector('english'::regconfig, split_part((ip_address)::text, '/'::text, 1))) USING gin
#
require 'rails_helper'

describe User, type: :model do

  it { is_expected.to callback(:capitalize_name).before(:save) }
  it { is_expected.to callback(:generate_student_username_if_absent).before(:validation) }
  it { is_expected.to callback(:prep_authentication_terms).before(:validation) }
  it { is_expected.to callback(:check_for_school).after(:save) }

  it { should have_many(:checkboxes) }
  it { should have_many(:invitations).with_foreign_key('inviter_id') }
  it { should have_many(:objectives).through(:checkboxes) }
  it { should have_one(:schools_users) }
  it { should have_one(:school).through(:schools_users) }
  it { should have_many(:schools_admins).class_name('SchoolsAdmins') }
  it { should have_many(:district_admins).class_name('DistrictAdmin') }
  it { should have_many(:administered_schools).through(:schools_admins).source(:school).with_foreign_key('user_id') }
  it { should have_many(:classrooms_teachers) }
  it { should have_many(:teacher_saved_activities).with_foreign_key('teacher_id') }
  it { should have_many(:activities).through(:teacher_saved_activities)}
  it { should have_many(:classrooms_i_teach).through(:classrooms_teachers).source(:classroom) }
  it { should have_and_belong_to_many(:districts) }
  it { should have_one(:ip_location) }
  it { should have_many(:user_activity_classifications).dependent(:destroy) }
  it { should have_many(:user_milestones) }
  it { should have_many(:milestones).through(:user_milestones) }

  it { should delegate_method(:name).to(:school).with_prefix(:school) }
  it { should delegate_method(:mail_city).to(:school).with_prefix(:school) }
  it { should delegate_method(:mail_state).to(:school).with_prefix(:school) }

  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:password) }

  it { should validate_presence_of(:username).on(:create) }
  it { should validate_length_of(:username).is_at_most(User::CHAR_FIELD_MAX_LENGTH) }
  it { should validate_length_of(:name).is_at_most(User::CHAR_FIELD_MAX_LENGTH) }
  it { should validate_length_of(:email).is_at_most(User::CHAR_FIELD_MAX_LENGTH) }
  it { should validate_length_of(:password).is_at_most(User::CHAR_FIELD_MAX_LENGTH) }

  it { should have_secure_password }

  it_behaves_like 'a subscriber'

  let(:user) { build(:user) }
  let!(:user_with_original_email) { build(:user, email: 'fake@example.com') }

  describe 'flags' do

    describe 'validations' do
      it 'does not raise an error when the flags are in the VALID_FLAGS array' do
        User::VALID_FLAGS.each do |flag|
          expect{ user.update(flags: user.flags.push(flag))}.not_to raise_error
        end
      end

      it 'raises an error if the flag is not in the array' do
        expect {
          user.update!(flags: user.flags.push('wrong'))
        }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    describe '#testing_flag' do
      it "returns nil if the user does not have a flag from the User::TESTING_FLAGS array" do
        user.update(flags: [User::PERMISSIONS_FLAGS.first])
        expect(user.testing_flag).to eq(nil)
      end

      it "returns nil if the user does any flags" do
        expect(user.testing_flag).to eq(nil)
      end

      it "returns a flag from the User::TESTING_FLAGS array if the user does have one" do
        sample_testing_flag = User::TESTING_FLAGS.first
        user.update(flags: [sample_testing_flag])
        expect(user.testing_flag).to eq(sample_testing_flag)
      end
    end

    describe '#auditor?' do
      it 'returns true when the user has an auditor flag' do
        user.update(flags: ['auditor'])
        expect(user.auditor?).to eq(true)
      end

      it 'returns false when the user does not have an auditor flag' do
        expect(user.auditor?).to eq(false)
      end
    end
  end

  describe '#last_four' do
    it 'returns nil if a user does not have a stripe_customer_id' do
      expect(user.last_four).to eq(nil)
    end

    context 'user has a stripe customer_id' do
      let(:user) { create(:user, stripe_customer_id: stripe_customer_id)}
      let(:stripe_customer_id) { 'cus_abcdefg' }
      let(:last4) { 1000 }
      let(:customer) { double('customer') }
      let(:customer_with_sources) { double('customer', sources: double(data: double(first: double(last4: last4)))) }
      let(:retrieve_sources_args) { { id: stripe_customer_id, expand: ['sources'] } }

      before do
        allow(Stripe::Customer).to receive(:retrieve).with(stripe_customer_id).and_return(customer)
        allow(Stripe::Customer).to receive(:retrieve).with(retrieve_sources_args).and_return(customer_with_sources)
      end

      it "calls Stripe::Customer.retrieve with the current user's stripe_customer_id" do
        expect(user.last_four).to eq last4
      end
    end
  end

  describe '#stripe_customer?' do
    let(:user) { create(:teacher, :has_a_stripe_customer_id) }
    let(:stripe_customer_id) { user.stripe_customer_id }
    let(:retrieve_stripe_customer) { allow(Stripe::Customer).to receive(:retrieve).with(stripe_customer_id) }

    context 'user with no stripe_customer_id' do
      it { expect(create(:teacher).stripe_customer?).to eq false }
    end

    context 'customer does not exist on stripe' do
      let(:error_msg) { "No such customer: '#{stripe_customer_id}'" }

      before { retrieve_stripe_customer.and_raise(Stripe::InvalidRequestError.new(error_msg, :id)) }

      it { expect(user.stripe_customer?).to eq false }
    end

    context 'customer exists on stripe' do
      let(:stripe_customer) { double(:stripe_customer, customer_attrs) }
      let(:customer_attrs) { { id: stripe_customer_id, object: "customer" } }

      before { retrieve_stripe_customer.and_return(stripe_customer) }

      it { expect(user.stripe_customer?).to be true }
    end

    context 'customer exists on stripe but is deleted' do
      let(:stripe_customer) { double(:stripe_customer, customer_attrs) }
      let(:customer_attrs) { { id: stripe_customer_id, object: "customer", deleted: true } }

      before { retrieve_stripe_customer.and_return(stripe_customer) }

      it { expect(user.stripe_customer?).to be false }
    end
  end

  describe '#utc_offset' do
    it "returns 0 if the user does not have a timezone" do
      expect(user.utc_offset).to eq(0)
    end

    it "returns a negative number if the user has a timezone that is behind utc" do
      user.update(time_zone: 'America/New_York')
      expect(user.utc_offset).to be < 0
    end

    it "returns a postive number if the user has a timezone that is ahead of utc" do
      user.update(time_zone: 'Australia/Perth')
      expect(user.utc_offset).to be > 0
    end
  end

  describe 'subscription methods' do

    context 'subscription methods' do
      let(:user) { create(:user) }
      let!(:subscription) { create(:subscription, expiration: Date.tomorrow) }
      let!(:user_subscription) { create(:user_subscription, user: user, subscription: subscription) }

      describe '#subscription_authority_level' do
        let!(:school) {create(:school)}
        let!(:school_subscription) {create(:school_subscription, school: school, subscription: subscription)}

        it "returns 'purchaser' if the user is the purchaser" do
          subscription.update(purchaser_id: user.id)
          expect(user.subscription_authority_level(subscription.id)).to eq('purchaser')
        end

        it "returns 'authorizer' if the user is the authorizer" do
          school.update(authorizer: user)
          SchoolsUsers.create(user: user, school: school)
          user.reload
          expect(user.subscription_authority_level(subscription.id)).to eq('authorizer')
        end

        it "returns 'coordinator' if the user is the coordinator" do
          school.update(coordinator: user)
          SchoolsUsers.create(user: user, school: school)
          user.reload
          expect(user.subscription_authority_level(subscription.id)).to eq('coordinator')
        end

        it "returns nil if the user has no authority" do
          expect(user.subscription_authority_level(subscription.id)).to eq(nil)
        end
      end

      describe '#last_expired_subscription' do
        let!(:subscription2) { create(:subscription, expiration: Date.yesterday) }
        let!(:user_subscription2) { create(:user_subscription, user: user, subscription: subscription2) }

        it "returns the user's most recently expired subscription" do
          subscription.update(expiration: 10.days.ago.to_date)
          expect(user.reload.last_expired_subscription).to eq(subscription2)
        end

        it "returns nil if the user does not have a recently expired subscription" do
          user.subscriptions.destroy_all
          expect(user.subscription).not_to be
        end
      end

      describe '#eligible_for_new_subscription?' do
        it "returns true if the user does not have a subscription" do
          user.reload.subscription.destroy
          expect(user.eligible_for_new_subscription?).to be
        end

        it "returns true if the user has a subscription with a trial account type" do
          Subscription::TRIAL_TYPES.each do |type|
            subscription.update(account_type: type)
            expect(user.reload.eligible_for_new_subscription?).to be true
          end
        end

        it "returns false if the user has a subscription that does not have a trial account type" do
          (Subscription::OFFICIAL_PAID_TYPES).each do |type|
            subscription.update(account_type: type)
            expect(user.reload.eligible_for_new_subscription?).to be false
          end
        end
      end

      describe '#subscription' do
        it 'returns a subscription if a valid one exists' do
          expect(user.reload.subscription).to eq(subscription)
        end

        it 'returns the subscription with the latest expiration date multiple valid ones exists' do
          later_subscription = create(:subscription, expiration: 365.days.from_now.to_date)
          create(:user_subscription, user: user, subscription: later_subscription)
          expect(user.reload.subscription).to eq(later_subscription)
        end

        it 'returns nil if a valid subscription does not exist' do
          subscription.update(expiration: Date.yesterday)
          expect(user.reload.subscription).to eq(nil)
        end
      end

      describe '#present_and_future_subscriptions' do
        it 'returns an empty array if there are no subscriptions with expirations in the future' do
          subscription.update(expiration: Date.yesterday)
          expect(user.present_and_future_subscriptions).to be_empty
        end

        it 'returns an array including user.subscription if user has a valid subscription' do
          expect(user.reload.present_and_future_subscriptions).to include(user.subscription)
        end

        it 'returns an array including subscriptions that have not started yet, as long as their expiration is in the future and they have not been de-activated' do
          later_subscription = create(:subscription, start_date: 300.days.from_now.to_date, expiration: 365.days.from_now.to_date)
          create(:user_subscription, user: user, subscription: later_subscription)
          expect(user.present_and_future_subscriptions).to include(later_subscription)
        end

        it 'does not return subscriptions that have been deactivated, even if their expiration date is in the future' do
          de_activated_subscription = create(:subscription, start_date: 300.days.from_now.to_date, expiration: 365.days.from_now.to_date, de_activated_date: Date.yesterday)
          create(:user_subscription, user: user, subscription: de_activated_subscription)
          expect(user.present_and_future_subscriptions).not_to include(de_activated_subscription)
        end
      end
    end
  end

  describe 'constants' do
    it "should give the correct value for all the constants" do
      expect(User::ROLES).to eq(%w(teacher student staff sales-contact))
      expect(User::SAFE_ROLES).to eq(%w(student teacher sales-contact))
      expect(User::VALID_EMAIL_REGEX).to eq(/\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i)
    end
  end

  describe '#capitalize_name' do
    let(:user) { create(:user) }

    it 'should set the name as a capitalized name if name is single' do
      user.name = "test"
      expect(user.capitalize_name).to eq("Test")
      expect(user.name).to eq("Test")
    end

    it 'should capitalize both first name and last name if exists' do
      user.name = "test test"
      expect(user.capitalize_name).to eq("Test Test")
      expect(user.name).to eq("Test Test")
    end
  end

  describe '#admin?' do
    let!(:user) { create(:user) }

    context 'when admin exists' do
      let!(:schools_admins) { create(:schools_admins, user: user) }

      it 'should return true' do
        expect(user.admin?).to eq true
      end
    end

    context 'when admin does not exist' do
      it 'should return false' do
        expect(user.admin?).to eq false
      end
    end
  end

  describe 'serialized' do
    let(:user) { create(:user) }

    it 'should return the right seralizer object' do
      expect(user.serialized).to be_a("#{user.role.capitalize}Serializer".constantize)
    end
  end

  describe '#newsletter?' do
    context 'user.send_newsletter = false' do
      let(:teacher) { create(:user, send_newsletter: false) }

      it 'returns false' do
        expect(teacher.newsletter?).to eq(false)
      end
    end

    context 'user.send_newsletter = true' do
      let(:teacher) { create(:user, send_newsletter: true) }

      it 'returns true' do
        expect(teacher.newsletter?).to eq(true)
      end
    end
  end

  describe '#send_account_created_email' do
    let(:user) { create(:user) }

    before do
      allow(UserMailer).to receive(:account_created_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(UserMailer).to receive(:account_created_email).with(user, "pass", "name")
      user.send_account_created_email("pass", "name")
    end
  end

  describe '#send_invitation_to_non_existing_user' do
    let(:user) { create(:user) }

    before do
      allow(UserMailer).to receive(:invitation_to_non_existing_user).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the invitation received email' do
      expect(UserMailer).to receive(:invitation_to_non_existing_user).with({test: "test"})
      user.send_invitation_to_non_existing_user({test: "test"})
    end
  end

  describe "#send_invitation_to_existing_user" do
    let(:user) { create(:user) }

    before do
      allow(UserMailer).to receive(:invitation_to_existing_user).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the invitation to existing user' do
      expect(UserMailer).to receive(:invitation_to_existing_user).with({test: "test"})
      user.send_invitation_to_existing_user({test: "test"})
    end
  end

  describe '#send_join_school_email' do
    let(:user) { create(:user) }
    let(:school) { double(:school) }

    before do
      allow(UserMailer).to receive(:join_school_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the join school email' do
      expect(UserMailer).to receive(:join_school_email).with(user, school)
      user.send_join_school_email(school)
    end
  end

  describe '#send_lesson_plan_email' do
    let(:user) { create(:user) }
    let(:lessons) { double(:lessons) }
    let(:unit) { double(:unit) }

    before do
      allow(UserMailer).to receive(:lesson_plan_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the lesson plan email' do
      expect(UserMailer).to receive(:lesson_plan_email).with(user, lessons, unit)
      user.send_lesson_plan_email(lessons, unit)
    end
  end

  describe '#send_new_admin_email' do
    let(:user) { create(:user) }
    let(:school) { double(:school) }

    before do
      allow(UserMailer).to receive(:new_admin_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the new admin email' do
      expect(UserMailer).to receive(:new_admin_email).with(user, school)
      user.send_new_admin_email(school)
    end
  end

  describe '#delete_classroom_minis_cache' do
    let(:user) { create(:user) }

    it 'should clear the class_room_minis cache' do
      $redis.set("user_id:#{user.id}_classroom_minis", "anything")
      user.delete_classroom_minis_cache
      expect($redis.get("user_id:#{user.id}_classroom_minis")).to eq(nil)
    end
  end

  describe '#delete_struggling_students_cache' do
    let(:user) { create(:user) }

    it 'should clear the class_room_minis cache' do
      $redis.set("user_id:#{user.id}_struggling_students", "anything")
      user.delete_struggling_students_cache
      expect($redis.get("user_id:#{user.id}_struggling_students")).to eq(nil)
    end
  end

  describe '#delete_dashboard_caches' do
    let(:user) { create(:user) }

    it 'should delete all the three caches' do
      expect(user).to receive(:delete_classroom_minis_cache)
      expect(user).to receive(:delete_struggling_students_cache)
      expect(user).to receive(:delete_difficult_concepts_cache)
      user.delete_dashboard_caches
    end
  end

  describe '#coteacher_invitations' do
    let(:user) { create(:user) }
    let(:invitation) { create(:invitation, archived: false, invitation_type: 'coteacher', invitee_email: user.email) }

    it 'should return the invitation' do
      expect(user.coteacher_invitations).to include(invitation)
    end
  end

  describe '#generate_teacher_account_info' do
    let(:user) { create(:user) }
    let(:premium_state) { double(:premium_state) }

    before do
      allow(user).to receive(:subscription).and_return(nil)
      allow(user).to receive(:premium_state).and_return(premium_state)
    end

    it 'should give the correct hash' do
      school = create(:school)
      SchoolsUsers.create(school: school, user: user)
      user.reload
      hash = user.attributes.merge!({
        subscription: {'subscriptionType' => premium_state},
        school: school,
        school_type: School::US_K12_SCHOOL_DISPLAY_NAME
      })
      expect(user.generate_teacher_account_info).to eq(hash)
    end

    it 'should have the no school selected school if the user has no school' do
      school = create(:school, name: School::NO_SCHOOL_SELECTED_SCHOOL_NAME)
      hash = user.attributes.merge!({
        subscription: {'subscriptionType' => premium_state},
        school: school,
        school_type: School::US_K12_SCHOOL_DISPLAY_NAME
      })
      expect(user.generate_teacher_account_info).to eq(hash)
    end
  end

  describe '#delete_difficult_concepts_cache' do
    let(:user) { create(:user) }

    it 'should clear the class_room_minis cache' do
      $redis.set("user_id:#{user.id}_difficult_concepts", "anything")
      user.delete_difficult_concepts_cache
      expect($redis.get("user_id:#{user.id}_difficult_concepts")).to eq(nil)
    end
  end

  describe "default scope" do
    let(:user1) { create(:user) }
    let(:user2) { create(:user, role: 'temporary') }

    it 'must list all users but the ones with temporary role' do
      User.all.each do |u|
        expect(u.role).to_not eq 'temporary'
      end
    end
  end

  describe 'User scope' do
    describe '::ROLES' do
      it 'must contain all roles' do
        %w(student teacher staff).each do |role|
          expect(User::ROLES).to include role
        end
      end
    end

    describe '::SAFE_ROLES' do
      it 'must contain safe roles' do
        %w(student teacher).each do |role|
          expect(User::SAFE_ROLES).to include role
        end
      end
    end
  end

  # TODO: email is taken as username and email
  describe '.authenticate' do
    let(:username)          { 'Test' }
    let(:username_password) { '123456' }

    let(:email)          { 'Test@example.com' }
    let(:email_password) { '654321' }

    before do
      create(:user, username: username, password: username_password)
      create(:user, email: email, password: email_password)
    end

    subject(:authentication_result) do
      user = User.find_by_username_or_email login_name
      user.authenticate(password)
    end

    %i(email username).each do |cred_base|
      context "with #{cred_base}" do
        let(:password_val) { send(:"#{cred_base}_password") }

        %i(original swapped).each do |name_case|
          case_mod = if name_case == :swapped
                       :swapcase # e.g., "a B c" => "A b C"
                     else
                       :to_s
                     end

          context "#{name_case} case" do
            # e.g., send(:username).send(:to_s),
            #       send(:email   ).send(:swapcase),
            #       etc.
            let(:login_name) { send(cred_base).send(case_mod) }

            context 'with incorrect password' do
              let(:password) { "wrong #{password_val} wrong" }

              it 'fails' do
                expect(authentication_result).to be_falsy
              end
            end

            context 'with correct password' do
              let(:password) { password_val }

              it 'succeeds' do
                expect(authentication_result).to be_truthy
              end
            end
          end
        end
      end
    end
  end

  describe '#redeem_credit' do
    let!(:postive_credit_transaction) { create(:credit_transaction, user: user, amount: 50) }
    let!(:negative_credit_transaction) { create(:credit_transaction, user: user, amount: -5) }

    context 'when the user has a positive balance' do

      context 'and no existing subscription' do

        it "creates a credit transaction that clears the user's credit" do
          user.redeem_credit
          expect(CreditTransaction.last.amount).to eq(-45)
        end

        describe 'the new subscription given to the user' do
          it 'exists' do
            original_subscription_count = user.subscriptions.count
            user.redeem_credit
            expect(user.subscriptions.count).to be > original_subscription_count
          end

          it 'starts immediately' do
            subscription = user.redeem_credit
            expect(subscription.start_date).to eq(Date.current)
          end

          it "with the user as the contact" do
            subscription = user.redeem_credit
            expect(subscription.purchaser).to eq(user)
          end
        end
      end

      context 'and an existing subscription' do
        it "creates a new subscription" do
          subscription = create(:subscription, expiration: 3.days.from_now.to_date)
          create(:user_subscription, user: user, subscription: subscription)

          expect{ user.redeem_credit }.to change(Subscription, :count).by(1)
        end

        it "creates a new subscription with the start date equal to last subscription expiration" do
          subscription = create(:subscription, expiration: 3.days.from_now.to_date)
          create(:user_subscription, user: user, subscription: subscription)

          previous_subscription = user.subscriptions.last
          last_subscription = user.redeem_credit

          expect(last_subscription.start_date).to eq(previous_subscription.expiration)
        end
      end
    end

    context 'when the user does not have a positive balance' do
      it 'does not create an additional credit transaction' do
        negative_credit_transaction.update(amount: postive_credit_transaction.amount * -1)
        # negative credit transaction is the negative value of the positive one here
        old_transaction_count = CreditTransaction.all.count
        user.redeem_credit
        expect(CreditTransaction.all.count).to eq(old_transaction_count)
      end

      it 'does not create a new subscription' do
        negative_credit_transaction.update(amount: postive_credit_transaction.amount * -1)
        original_subscription_count = user.subscriptions.count
        user.redeem_credit
        expect(user.subscriptions.count).to eq(original_subscription_count)
      end
    end
  end

  describe '#role=' do
    it 'return role name' do
      user = build(:user)
      expect(user.role = 'newrole').to eq 'newrole'
    end
  end

  describe '#role' do
    let(:user) { build(:user) }

    it 'returns role as instance of ActiveSupport::StringInquirer' do
      user.role = 'newrole'
      expect(user.role).to be_a ActiveSupport::StringInquirer
    end

    it 'returns true for correct role' do
      user.role = 'newrole'
      expect(user.role.newrole?).to be true
    end

    it 'returns false for incorrect role' do
      user.role = 'newrole'
      expect(user.role.invalidrole?).to be false
    end
  end

  describe '#clear_data' do
    let(:user) { create(:user) }

    it 'calls the ClearUserDataWorker with the user id' do
      expect(ClearUserDataWorker).to receive(:perform_async).with(user.id)
      user.clear_data
    end
  end

  describe '#safe_role_assignment' do

    it "must assign 'user' role by default" do
      expect(user.safe_role_assignment('nil')).to eq('user')
    end

    it "must assign 'teacher' role even with spaces" do
      expect(user.safe_role_assignment(' teacher ')).to eq('teacher')
    end

    it "must assign 'teacher' role when it's chosen" do
      expect(user.safe_role_assignment('teacher')).to eq('teacher')
    end

    it "must assign 'student' role when it's chosen" do
      expect(user.safe_role_assignment('student')).to eq('student')
    end

    it "must change the role to 'student' inside the instance" do
      user.safe_role_assignment 'student'
      expect(user.role).to be_student
    end
  end

  describe '#permanent?' do
    let(:user) { build(:user) }

    it 'must be true for user' do
      user.safe_role_assignment 'user'
      expect(user).to be_permanent
    end

    it 'must be true for teacher' do
      user.safe_role_assignment 'teacher'
      expect(user).to be_permanent
    end

    it 'must be true for student' do
      user.safe_role_assignment 'student'
      expect(user).to be_permanent
    end
  end

  describe '#requires_password?' do
    let(:user) { build(:user) }

    it 'returns true for all roles but temporary' do
      user.safe_role_assignment 'user'
      expect(user.send(:requires_password?)).to eq(true)
    end
  end

  describe '#generate_password' do
    let(:user1) { build(:user, password: 'currentpassword', last_name: 'Last Name') }
    let(:user2) { build(:user, password: 'currentpassword', last_name: 'lastName') }

    it 'sets password to the value of the last name with any spaces replaced with hyphens' do
      user1.generate_password
      expect(user1.password).to eq('Last-Name')
    end

    it 'sets password to value of last name with a capitalized first letter' do
      user2.generate_password
      expect(user2.password).to eq('LastName')
    end
  end

  describe '#generate_username' do
    let!(:classroom) { create(:classroom, code: 'cc') }
    let!(:user) { build(:user, first_name: 'first', last_name: 'last', classrooms: [classroom]) }

    it 'generates last name, first name, and class code' do
      expect(user.send(:generate_username, classroom.id)).to eq('first.last@cc')
    end

    it 'handles students with identical names and classrooms' do
      user1 = build(:user, first_name: 'first', last_name: 'last', classrooms: [classroom])
      user1.generate_student(classroom.id)
      user1.save
      user2 = build(:user, first_name: 'first', last_name: 'last', classrooms: [classroom])
      expect(user2.send(:generate_username, classroom.id)).to eq('first.last1@cc')
    end
  end

  describe '#email_required?' do
    let(:user) { build(:user) }

    it 'returns true for teacher' do
      user.safe_role_assignment 'teacher'
      expect(user.send(:email_required?)).to eq(true)
    end

    it 'returns false for temporary role' do
      user.safe_role_assignment 'temporary'
      expect(user.send(:email_required?)).to eq(false)
    end
  end

  describe '#refresh_token!' do
    let(:user) { build(:user) }

    it 'must change the token value' do
      expect(user.token).to be_nil
      expect(user.refresh_token!).to eq(true)
      expect(user.token).to_not be_nil
    end
  end

  context 'when it runs validations' do
    let(:user) { build(:user) }

    it 'is valid with valid attributes' do
      expect(user).to be_valid
    end

    describe 'password attibute' do
      context 'when role requires password' do
        it 'is invalid without password' do
          user = build(:user,  password: nil)
          user.safe_role_assignment 'student'
          expect(user).to_not be_valid
        end

        it 'is valid with password' do
          user = build(:user, password: 'somepassword')
          user.safe_role_assignment 'student'
          expect(user).to be_valid
        end
      end
    end

    describe 'email attribute' do
      it 'is invalid when email is not unique' do
        create(:user, email: 'test@test.lan')
        user = build(:user,  email: 'test@test.lan')
        expect(user).to_not be_valid
      end

      it 'is does not save records with non unique emails' do
        create(:user, email: 'test@test.lan')
        user = build(:user,  email: 'test@test.lan')
        expect { user.save!(validate: false) }.to raise_error ActiveRecord::RecordNotSaved
      end

      it 'is does save for records below the uniqueness constraint minimum' do
        create(:user, id: described_class::EMAIL_UNIQUENESS_CONSTRAINT_MINIMUM_ID - 1, email: 'test@test.lan')
        user = build(:user,  email: 'test@test.lan')
        expect { user.save!(validate: false) }.to change(User, :count).from(1).to(2)
      end

      it 'is valid when email is unique' do
        user = build(:user, email: 'unique@test.lan')
        expect(user).to be_valid
      end

      it 'is invalid when there is a space in it' do
        user = build(:user,  email: 'test@test.lan ')
        user.save
        expect(user.errors[:email]).to include("That email is not valid because it has a space. Try another.")
      end

      context 'when role requires email' do
        it 'is invalid without email' do
          user.safe_role_assignment 'teacher'
          user.email = nil
          expect(user).to_not be_valid
        end

        it 'is valid with email' do
          user.safe_role_assignment 'student'
          user.email = 'email@test.lan'
          expect(user).to be_valid
        end
      end

      context 'when role does not require email' do
        it 'is valid without email' do
          user.safe_role_assignment 'temporary'
          user.email = nil
          expect(user).to be_valid
        end
      end

      context 'when there is an existing user' do
        it 'can update other parts of its record even if it is does not have a unique email' do
          user = User.new(email: user_with_original_email.email)
          expect(user.save(validate: false)).to be
        end

        it 'cannot update its email to an existing one' do
          user = User.create(email: 'whatever@example.com', name: 'whatever whatever')
          user.save(validate: false)
          expect(user.update(email: user_with_original_email.email)).to_not be(false)
        end
      end
    end

    describe 'username attribute' do
      it 'is invalid when not unique' do
        create(:user, username: 'testtest.lan')
        user = build(:user, username: 'testtest.lan')
        expect(user).to_not be_valid
      end

      it 'is does not save records with non unique usernames' do
        user1 = create(:user)
        user2 = build(:user, username: user1.username)
        expect { user2.save!(validate: false) }.to raise_error ActiveRecord::RecordNotSaved
      end

      it 'is does save for records below the uniqueness constraint minimum' do
        user1 = create(:user, id: described_class::USERNAME_UNIQUENESS_CONSTRAINT_MINIMUM_ID - 1)
        user2 = build(:user, username: user1.username)
        expect { user2.save!(validate: false) }.to change(User, :count).from(1).to(2)
      end

      it 'uniqueness is enforced on existing users changing to an existing username' do
        user1 = create(:user)
        user2 = create(:user)
        expect(user2.update(username: user1.username)).to be(false)
      end

      it 'uniqueness is not enforced on non-unique usernames changing other fields' do
        user1 = create(:user, username: 'testtest.lan')
        user2 = build(:user, username: 'testtest.lan')
        user2.save(validate: false)
        expect(user2.username).to eq(user1.username)
      end

      it 'is invalid when it is formatted like an email' do
        user = build(:user, username: 'testing@example.com')
        expect(user).to_not be_valid
      end

      it 'email formatting is not enforced on usernames when other fields are changed' do
        user = build(:user, username: 'testing@example.com')
        user.save(validate: false)
        expect(user.update(password: 'password')).to be
      end

      context 'role is permanent' do
        it 'is valid with username' do
          user.safe_role_assignment 'student'
          user.email = nil
          user.username = 'testusername'
          expect(user).to be_valid
        end
      end

      context 'not permanent role' do
        it 'is valid without username and email' do
          user.safe_role_assignment 'temporary'
          user.email = nil
          expect(user).to be_valid
        end
      end
    end
  end

  describe '#name' do
    context 'with valid inputs' do
      it 'has a first_name only' do
        user.last_name = nil
        expect(user.name).to eq(user.first_name)
      end

      it 'has a last name only' do
        user.first_name = nil
        expect(user.name).to eq(user.last_name)
      end

      it 'has multiple last names' do
        user.first_name = 'Has'
        user.last_name = 'Multiple Last Names'
        user.save
        expect(user.name).to eq("#{user.first_name} #{user.last_name}")
      end
    end
  end

  describe '#student?' do
    let(:user) { build(:user) }

    it "must be true for 'student' roles" do
      user.safe_role_assignment 'student'
      expect(user).to be_student
    end

    it 'must be false for other roles' do
      user.safe_role_assignment 'other'
      expect(user).to_not be_student
    end
  end

  describe '#teacher?' do
    let(:user) { build(:user) }

    it "must be true for 'teacher' roles" do
      user.safe_role_assignment 'teacher'
      expect(user).to be_teacher
    end

    it 'must be false for other roles' do
      user.safe_role_assignment 'other'
      expect(user).to_not be_teacher
    end
  end

  describe '#staff?' do
    let(:user)  { build(:user, role: 'user') }
    let(:staff) { build(:staff) }

    it 'must be true for staff role' do
      expect(staff).to be_staff
    end

    it 'must be false for another roles' do
      expect(user).to_not be_staff
    end
  end

  describe '#generate_student' do
    let(:classroom) { create(:classroom, code: '101') }

    subject do
      student = classroom.students.build(first_name: 'John', last_name: 'Doe')
      student.generate_student(classroom.id)
      student
    end

    describe '#username' do
      subject { super().username }

      it { is_expected.to eq('john.doe@101') }
    end

    describe '#role' do
      subject { super().role }

      it { is_expected.to eq('student') }
    end

    it 'should authenticate with last name' do
      expect(subject.authenticate('Doe')).to be_truthy
    end
  end

  describe '#sorting_name' do
    subject(:sort_name) { user.sorting_name }

    context 'given distinct first and last names' do
      let(:first_name) { 'John' }
      let(:last_name)  { 'Doe' }
      let(:user) do
        build(:user, first_name: first_name,
                     last_name: last_name)
      end

      it 'returns "last, first"' do
        expect(sort_name).to eq "#{last_name}, #{first_name}"
      end
    end

    context 'given distinct only a single :name' do
      let(:name) { 'SingleName' }
      let(:user) { User.new(name: name) }

      before { user.name = name }

      it 'returns "name, name"' do
        expect(sort_name).to eq "#{name}, #{name}"
      end
    end
  end

  describe 'can behave as either a student or teacher' do
    context 'when behaves like student' do
      it_behaves_like 'student'
    end

    context 'when behaves like teacher' do
      it_behaves_like 'teacher'
    end
  end

  describe '#update_invitee_email_address' do
    let!(:invite_one) { create(:invitation) }
    let!(:old_email) { invite_one.invitee_email }
    let!(:invite_two) { create(:invitation, invitee_email: old_email) }

    it 'should update invitee email address in invitations table if email changed' do
      new_email = "new-email@fake-email.com"
      User.find_by_email(old_email).update(email: new_email)
      expect(Invitation.where(invitee_email: old_email).count).to be(0)
      expect(Invitation.where(invitee_email: new_email).count).to be(2)
    end
  end

  describe '#generate_referrer_id' do
    it 'creates ReferrerUser with the correct referrer code when a teacher is created' do
      referrer_users = ReferrerUser.count
      teacher = create(:teacher)
      expect(ReferrerUser.count).to be(referrer_users + 1)
      expect(teacher.referral_code).to eq("#{teacher.name.downcase.gsub(/[^a-z ]/, '').gsub(' ', '-')}-#{teacher.id}")
    end

    it 'does not create a new ReferrerUser when a student is created' do
      referrer_users = ReferrerUser.count
      create(:student)
      expect(ReferrerUser.count).to be(referrer_users)
    end
  end

  describe 'satismeter' do
    it 'should have basic working gate logic' do
      teacher = create(:teacher)
      expect(teacher.show_satismeter?).to be false
      expect(teacher.satismeter_feature_enabled?).to be true
      expect(teacher.satismeter_threshold_met?).to be false
    end
  end

  describe 'clever_id validation' do
    it 'should pass the validation if the user is new and the clever id is not currently in use' do
      user = build(:student, clever_id: 'new_and_different')
      expect(user.valid?).to be
    end

    it 'should not pass the validation if the user is new and the clever id is already in use' do
      create(:student, clever_id: 'already_used')
      new_user = build(:student, clever_id: 'already_used')
      expect(new_user.valid?).not_to be
    end

    it 'should pass the validation if the user already exists and is and has not changed their clever id, even if another user already has it' do
      create(:teacher, id: described_class::CLEVER_ID_UNIQUENESS_CONSTRAINT_MINIMUM_ID - 1, clever_id: 'already_used')
      second_user = build(:teacher, clever_id: 'already_used')
      second_user.save!(validate: false)
      second_user.name = 'Clever User'
      expect(second_user).to be_valid
    end

    it 'should not pass the validation if the user already exists and a duplicate clever_id is attempted to be saved' do
      create(:teacher, clever_id: 'already_used')
      second_user = build(:teacher, clever_id: 'already_used')
      expect { second_user.save!(validate: false) }.to raise_error ActiveRecord::RecordNotSaved
    end

    it 'should not pass the validation if the user already exists and is changing their clever id to a non-unique one' do
      create(:student, clever_id: 'already_used')
      second_user = create(:student, clever_id: 'different_clever_id')
      second_user.clever_id = 'already_used'
      expect(second_user.valid?).not_to be
    end

    it 'should pass the validation if the user already exists and changes their clever id to a unique one' do
      user = create(:student)
      user.clever_id = 'something'
      expect(user.valid?).to be
    end
  end

  describe 'google_id validation' do
    it 'should pass the validation if the user is new and the google id is not currently in use' do
      user = build(:student, google_id: 'new_and_different')
      expect(user.valid?).to be
    end

    it 'should not pass the validation if the user is new and the google id is already in use' do
      create(:student, google_id: 'already_used')
      new_user = build(:student, google_id: 'already_used')
      expect(new_user.valid?).not_to be
    end

    it 'should pass the validation if the user already exists and has not changed their google id, even if another user already has it' do
      create(:teacher, id: described_class::GOOGLE_ID_UNIQUENESS_CONSTRAINT_MINIMUM_ID - 1, google_id: 'already_used')
      second_user = build(:teacher, google_id: 'already_used')
      second_user.save!(validate: false)
      second_user.name = 'google User'
      expect(second_user).to be_valid
    end

    it 'should not pass the validation if the user already exists and a duplicate google_id is attempted to be saved' do
      create(:teacher, google_id: 'already_used')
      second_user = build(:teacher, google_id: 'already_used')
      expect { second_user.save!(validate: false) }.to raise_error ActiveRecord::RecordNotSaved
    end

    it 'should pass the validation if the user already exists and changes their google id to a unique one' do
      user = create(:student)
      user.google_id = 'something'
      expect(user.valid?).to be
    end
  end

  describe '.deleted_users' do
    before { user.save }

    let!(:to_be_deleted_user) { create(:user) }

    it 'returns all deleted users' do
      expect(User.count).to eq 2

      expect { ClearUserDataWorker.new.perform(to_be_deleted_user.id) }.to change { User.deleted_users.count }.from(0).to(1)
    end
  end

  describe '.valid_email?' do
    it { expect(User.valid_email?('')).to be false }
    it { expect(User.valid_email?(nil)).to be false }
    it { expect(User.valid_email?('1')).to be false }
    it { expect(User.valid_email?('a@b.com')).to be true }
  end

  describe '#google_authorized?' do
    context 'user without auth_credentials is unauthorized' do
      it { expect(user.google_authorized?).to be_falsey }
    end

    context 'user with auth credentials has valid authorization' do
      let(:google_user) { create(:google_auth_credential).user }

      it { expect(google_user.google_authorized?).to be true }
    end
  end

  describe '#clever_authorized?' do
    context 'user without auth_credentials is unauthorized' do
      it { expect(user.clever_authorized?).to be_falsey }
    end

    context 'user with auth credentials has valid authorization' do
      let(:clever_user) { create(:clever_library_auth_credential).user }

      it { expect(clever_user.clever_authorized?).to be true }
    end
  end

  describe '#staff_session_duration_exceeded' do
    let(:user) { create(:user, role: role) }

    subject { user.staff_session_duration_exceeded? }

    context 'user is not staff' do
      let(:role) { :teacher }

      it { expect(subject).to eq false }
    end

    context 'user is staff' do
      let(:role) { :staff}

      context 'nil last_sign_in' do
        before { user.update(last_sign_in: nil) }

        it { expect(subject).to eq false }
      end

      context 'last_sign_in happened too long ago' do
        before { user.update(last_sign_in: described_class::STAFF_SESSION_DURATION.ago + 1.hour) }

        it { expect(subject).to eq false }
      end

      context 'last_sign_in happened within acceptable interval' do
        before { user.update(last_sign_in: described_class::STAFF_SESSION_DURATION.ago - 1.hour) }

        it { expect(subject).to eq true }
      end
    end
  end

  describe '#inactive_too_long?' do
    subject { user.inactive_too_long? }

    context 'last_sign_in_too_long_ago? is false' do
      before { allow(user).to receive(:last_sign_in_too_long_ago?).and_return(false) }

      it { expect(subject).to eq false }
    end

    context 'last_sign_in_too_long_ago? is true' do
      before { allow(user).to receive(:last_sign_in_too_long_ago?).and_return(true) }

      context 'last_active_too_long_ago? is false' do
        before { allow(user).to receive(:last_active_too_long_ago?).and_return(false) }

        it { expect(subject).to eq false }
      end

      context 'last_active_too_long_ago? is true' do
        before { allow(user).to receive(:last_active_too_long_ago?).and_return(true) }

        it { expect(subject).to eq true }
      end
    end
  end

  describe '#last_sign_in_too_long_ago' do
    subject { user.last_sign_in_too_long_ago? }

    context 'nil last_sign_in' do
      before { user.update(last_sign_in: nil) }

      it { expect(subject).to eq false }
    end

    context 'last_sign_in happened too long ago' do
      before { user.update(last_sign_in: described_class::USER_SESSION_DURATION.ago + 1.day) }

      it { expect(subject).to eq false }
    end

    context 'last_sign_in happened within acceptable interval' do
      before { user.update(last_sign_in: described_class::USER_SESSION_DURATION.ago - 1.day) }

      it { expect(subject).to eq true }
    end
  end

  describe '#last_active_too_long_ago?' do
    subject { user.last_active_too_long_ago? }

    context 'nil last_active' do
      before { user.update(last_active: nil) }

      it { expect(subject).to eq true }
    end

    context 'last_active happened too long ago' do
      before { user.update(last_active: described_class::USER_INACTIVITY_DURATION.ago + 1.day) }

      it { expect(subject).to eq false }
    end

    context 'last_active happened within acceptable interval' do
      before { user.update(last_active: described_class::USER_INACTIVITY_DURATION.ago - 1.day) }

      it { expect(subject).to eq true }
    end
  end

  describe '#set_time_zone' do
    describe 'if the user has a school' do
      it 'sets the timezone to the school timezone if the school has a zipcode' do
        school = create(:school, zipcode: 87505)
        user.school = school
        user.set_time_zone
        user.save
        expect(user.reload.time_zone).to eq('America/Denver')
      end

      it 'sets the timezone to the school timezone if the school has a mail_zipcode' do
        school = create(:school, mail_zipcode: 19130)
        user.school = school
        user.set_time_zone
        user.save
        expect(user.reload.time_zone).to eq('America/New_York')
      end

      it 'sets the timezone based on the ip address if the school does not have a zipcode or a mail_zipcode' do
        school = create(:school, mail_zipcode: nil, zipcode: nil)
        user.school = school
        user.update(ip_address: "179.61.239.7")
        user.set_time_zone
        expect(user.time_zone).to eq('America/New_York')
      end
    end

    describe 'if the user does not have a school' do
      it 'sets the timezone based on the ip address' do
        user.update(ip_address: "73.9.149.0")
        user.set_time_zone
        expect(user.time_zone).to eq('America/New_York')
      end
    end
  end

  describe '.find_by_stripe_customer_id_or_email!' do
    subject { User.find_by_stripe_customer_id_or_email!(stripe_customer_id, email) }

    let(:email) { 'text@example.com' }

    context 'stripe_customer_id nil' do
      let(:stripe_customer_id) { nil }

      context 'user does not exist with email' do
        it { expect { subject }.to raise_error(ActiveRecord::RecordNotFound) }
      end

      context 'user exists with email' do
        let!(:user) { create(:user, email: email) }

        it { expect(subject).to eq user }
      end
    end

    context 'stripe_customer_id present' do
      let(:stripe_customer_id) { "cus_#{SecureRandom.hex}" }

      context 'user exists with stripe_customer_id' do
        let!(:user) { create(:user, stripe_customer_id: stripe_customer_id) }

        it { expect(subject).to eq user }
      end

      context 'user does not exist with stripe_customer_id' do
        context 'user exists with email' do
          let!(:user) { create(:user, email: email) }

          it { expect(subject).to eq user }
        end

        context 'user does not exist with email' do
          it { expect { subject }.to raise_error(ActiveRecord::RecordNotFound) }
        end
      end
    end
  end

  describe '#duplicate_empty_student_accounts' do
    subject { student.duplicate_empty_student_accounts }

    let(:student) { create(:student) }
    let(:id) { student.id }
    let(:email) { student.email }

    let(:duplicate) do
      s = build(:student, email: student.email)
      s.save(validate: false)
      s
    end

    context 'nil id' do
      let(:id) { nil }

      it { expect(subject).to be_empty }
    end

    context 'no duplicates' do
      let(:student_ids) { [student.id] }

      it { expect(subject).to be_empty }
    end

    context 'duplicates exist' do
      let(:student_ids) { [student.id, duplicate.id] }

      it { expect(subject).to eq [duplicate] }

      context 'duplicate is not a student' do
        let(:duplicate) { create(:teacher) }

        it { expect(subject).to be_empty }
      end

      context 'duplicate has activity session' do
        before { create(:activity_session, user: duplicate) }

        it { expect(subject).to be_empty}
      end

      context 'duplicate has students_classrooms' do
        before { create(:students_classrooms, student: duplicate) }

        it { expect(subject).to be_empty }
      end
    end
  end

end
