# frozen_string_literal: true

require 'rails_helper'

describe ClearUserDataWorker, type: :worker do
  subject { described_class.new.perform(user.id) }

  let!(:ip_location) { create(:ip_location) }
  let(:user) { create(:student_in_two_classrooms_with_many_activities, google_id: 'sergey_and_larry_were_here', send_newsletter: true, ip_location: ip_location) }
  let!(:auth_credential) { create(:auth_credential, user: user) }
  let!(:activity_sessions) { user.activity_sessions }
  let!(:classroom_units) { ClassroomUnit.where("? = ANY (assigned_student_ids)", user.id) }

  it { expect { subject }.to change { user.reload.email }.to("deleted_user_#{user.id}@example.com") }
  it { expect { subject }.to change { user.reload.username }.to("deleted_user_#{user.id}") }
  it { expect { subject }.to change { user.reload.name }.to("Deleted User_#{user.id}") }
  it { expect { subject }.to change { user.reload.google_id }.to(nil) }
  it { expect { subject }.to change { user.reload.auth_credential }.to(nil) }
  it { expect { subject }.to change { user.reload.ip_address }.to(nil) }
  it { expect { subject }.to change { user.reload.send_newsletter }.to(false) }
  it { expect { subject }.to change { user.reload.ip_location }.to(nil) }
  it { expect { subject }.to change { StudentsClassrooms.where(student_id: user.id).count }.to(0) }


  it "removes student from related classroom_units" do
    subject
    classroom_units.each {|cu| expect(cu.assigned_student_ids).not_to include(user.id)}
  end

  it "removes student from related activity_sessions" do
    subject

    expect(user.reload.activity_sessions.count).to eq(0)
    activity_sessions.each do |as|
      expect(as.classroom_unit_id).to be nil
      expect(as.user_id).to be nil
    end
  end

  context 'subscriptions' do
    let!(:subscription) { create(:subscription, :recurring, :stripe) }
    let!(:user_subscription) { create(:user_subscription, subscription: subscription, user: user) }
    let(:stripe_subscription) { double(:stripe_subscription, stripe_cancel_at_period_end: nil) }

    before { allow(StripeIntegration::Subscription).to receive(:new).with(subscription).and_return(stripe_subscription) }

    it { expect { subject }.to change { subscription.reload.recurring }.from(true).to(false) }

    it 'updates the stripe subscription' do
      expect(stripe_subscription).to receive(:stripe_cancel_at_period_end)
      subject
    end
  end
end
