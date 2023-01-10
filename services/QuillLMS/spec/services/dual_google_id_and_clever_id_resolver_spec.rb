# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DualGoogleIdAndCleverIdResolver do
  let(:google_id) { '12345' }
  let(:clever_id) { '67890' }
  let(:account_type) { nil }
  let(:user) { create(:user, account_type: account_type, clever_id: clever_id, google_id: google_id) }

  subject { described_class.run(user) }

  it { does_not_change_the_account_type }

  context 'resolve_by_account_type' do
    context 'clever account_type' do
      let(:account_type) { User::CLEVER_ACCOUNT }

      it { sets_the_account_to_clever }
    end

    context 'google account_type' do
      let(:account_type) { User::GOOGLE_CLASSROOM_ACCOUNT }

      it { sets_the_account_to_google }
    end
  end

  context 'resolve_by_auth_credential' do
    context 'clever district auth credential' do
      before { create(:clever_district_auth_credential, user: user) }

      it { sets_the_account_to_clever }
    end

    context 'clever library auth credential' do
      before { create(:clever_library_auth_credential, user: user) }

      it { sets_the_account_to_clever }
    end

    context 'google auth credential' do
      before { create(:google_auth_credential, user: user) }

      it { sets_the_account_to_google }
    end
  end

  context 'resolve_by_last_classroom' do
    before do
      allow(user).to receive(:classrooms_i_teach).and_return(classrooms)
      allow(classrooms).to receive(:sort_by).and_return(ordered_classrooms)
    end

    let(:classrooms) { double(:classroom) }
    let(:ordered_classrooms) { double(:ordered_classrooms, last: last_classroom) }

    let!(:quill_classroom) { create(:simple_classroom) }
    let!(:google_classroom) { create(:simple_classroom, google_classroom_id: '54321') }
    let!(:clever_classroom) { create(:simple_classroom, clever_id: '54321') }

    context 'last classroom is google classroom' do
      let!(:last_classroom) { google_classroom }

      it { sets_the_account_to_google }
    end

    context 'last classroom is clever classroom' do
      let!(:last_classroom) { clever_classroom }

      it { sets_the_account_to_clever }
    end

    context 'last classroom is quill classroom' do
      let(:last_classroom) { quill_classroom }

      it { does_not_change_the_account_type }
    end
  end

  def does_not_change_the_account_type
    subject
    user.reload
    expect(user.clever_id).to eq clever_id
    expect(user.google_id).to eq google_id
    expect(user.account_type).to eq nil
    expect(ChangeLog.where(changed_attribute: :clever_id).count).to eq 0
    expect(ChangeLog.where(changed_attribute: :google_id).count).to eq 0
  end

  def sets_the_account_to_clever
    subject
    user.reload
    expect(user.clever_id).to eq clever_id
    expect(user.google_id).to eq nil
    expect(user.account_type).to eq User::CLEVER_ACCOUNT
    expect(ChangeLog.where(changed_attribute: :clever_id).count).to eq 0
    expect(ChangeLog.where(changed_attribute: :google_id).count).to eq 1
  end

  def sets_the_account_to_google
    subject
    user.reload
    expect(user.clever_id).to eq nil
    expect(user.google_id).to eq google_id
    expect(user.account_type).to eq User::GOOGLE_CLASSROOM_ACCOUNT
    expect(ChangeLog.where(changed_attribute: :clever_id).count).to eq 1
    expect(ChangeLog.where(changed_attribute: :google_id).count).to eq 0
  end
end
