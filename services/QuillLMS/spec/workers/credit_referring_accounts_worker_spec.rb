# frozen_string_literal: true

require 'rails_helper'

describe CreditReferringAccountsWorker, type: :worker do
  let(:worker) { described_class.new }
  let(:referrals_user) { create(:referrals_user) }

  it 'retrieves a list of validated referring users' do
    expect(ReferralsUser).to receive(:ids_due_for_activation).and_return([])
    worker.perform
  end

  it 'credits accounts of validated referring users' do
    worker.provide_referral_credit_to_user(referrals_user.id)
    expect(referrals_user.user.credit_transactions.length).to eq(1)
  end
end


