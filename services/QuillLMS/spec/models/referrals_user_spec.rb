# frozen_string_literal: true

# == Schema Information
#
# Table name: referrals_users
#
#  id               :integer          not null, primary key
#  activated        :boolean          default(FALSE)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  referred_user_id :integer          not null
#  user_id          :integer          not null
#
# Indexes
#
#  index_referrals_users_on_activated         (activated)
#  index_referrals_users_on_referred_user_id  (referred_user_id) UNIQUE
#  index_referrals_users_on_user_id           (user_id)
#
require 'rails_helper'

RSpec.describe ReferralsUser, type: :model do
  context 'associations' do
    let(:referrals_user) { create(:referrals_user) }
    let(:referring_user) { referrals_user.user }
    let(:referred_user)  { referrals_user.referred_user }

    it 'returns the right user' do
      expect(referrals_user.user).to be(referring_user)
      expect(referrals_user.referring_user).to be(referring_user)
    end

    it 'returns the right referred user' do
      expect(referrals_user.referred_user).to be(referred_user)
    end
  end

  context 'validations' do
    it 'does not allow more than one of the same referred user' do
      referred_user_id = create(:referrals_user).referred_user_id
      expect {
        create(:referrals_user, referred_user_id: referred_user_id)
      }.to raise_error ActiveRecord::RecordNotUnique
    end
  end

  context 'callbacks' do
    let(:segment_analytics) { SegmentAnalytics.new }
    let(:track_calls) { segment_analytics.backend.track_calls }
    let(:identify_calls) { segment_analytics.backend.identify_calls }

    describe 'on create' do
      let!(:referrals_user) { create(:referrals_user) }

      it 'triggers an invited event' do
        expect(identify_calls.size).to eq(1)
        expect(identify_calls[0][:user_id]).to be(referrals_user.referrer.id)
        expect(track_calls[0][:event]).to be(SegmentIo::BackgroundEvents::REFERRAL_INVITED)
        expect(track_calls[0][:user_id]).to be(referrals_user.referrer.id)
        expect(track_calls[0][:properties][:referral_id]).to be(referrals_user.referral.id)
      end
    end

    describe 'on update when activated becomes true' do
      let!(:referrals_user) { create(:referrals_user) }

      it 'triggers an activated event' do
        referrals_user.update(activated: true)
        expect(identify_calls.size).to eq(2)
        expect(identify_calls[1][:user_id]).to be(referrals_user.referrer.id)
        expect(track_calls[1][:event]).to be(SegmentIo::BackgroundEvents::REFERRAL_ACTIVATED)
        expect(track_calls[1][:user_id]).to be(referrals_user.referrer.id)
        expect(track_calls[1][:properties][:referral_id]).to be(referrals_user.referral.id)
      end

      it 'registers a user milestone' do
        referrals_user.update(activated: true)
        expect(UserMilestone.where(
          user_id: referrals_user.referrer.id,
          milestone_id: Milestone.find_by(name: Milestone::TYPES[:refer_an_active_teacher])
        )).to exist
      end

      it 'sends an email notification' do
        current_jobs = ReferralEmailWorker.jobs.size
        referrals_user.update(activated: true)
        expect(ReferralEmailWorker.jobs.size).to be(current_jobs + 1)
      end
    end
  end

  describe '#send_activation_email' do
    let(:referrals_user) { create(:referrals_user) }
    let(:referrer) { referrals_user.referrer }
    let(:referral) { referrals_user.referral }

    it 'should trigger mailer with appropriate data' do
      # So we don't accidentally send emails on develop, many of our mailer
      # methods are scoped to production with the exception of if the email
      # address includes the quill.org domain. Let's just make these users'
      # email addresses include quill.org so we can test this properly.
      referrer.update(email: 'referrer@quill.org')
      referral.update(email: 'referral@quill.org')
      expect { referrals_user.send_activation_email }.to change { ActionMailer::Base.deliveries.count }.by(1)
      expect(ActionMailer::Base.deliveries.map(&:subject)).to include("#{referral.name} just activated their account on Quill!")
      expect(ActionMailer::Base.deliveries.last.to).to eq([referrer.email])
    end
  end

  describe 'self.ids_due_for_activation' do
    it 'should return ids where the referred teacher is not activated and has at least one activity session' do
      activated_referrals_user = create(:referrals_user)
      activated_referral = activated_referrals_user.referral
      activated_referrals_user.update(activated: true)

      referrals_user = create(:referrals_user)
      referral = referrals_user.referral

      expect(ReferralsUser.ids_due_for_activation).to eq([])

      [activated_referral, referral].each do |teacher|
        classroom_id = create(:classrooms_teacher, user_id: teacher.id).classroom_id
        create(:classroom_unit_with_activity_sessions, classroom_id: classroom_id)
      end

      expect(ReferralsUser.ids_due_for_activation).to eq([referrals_user.id])
    end
  end
end
