# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::GoogleIdTransferrer do
  subject { described_class.run(calling_user_id, from_user, to_user) }

  let(:calling_user_id) { create(:user).id }
  let(:from_user) { create(:user, google_id: from_user_google_id) }
  let(:to_user) { create(:user, google_id: to_user_google_id) }

  context 'from_user_google_id is nil' do
    let(:from_user_google_id) { nil }

    context 'to_user_google_id is nil' do
      let(:to_user_google_id) { nil }

      it { expect { subject }.not_to change { from_user.reload.google_id }.from(from_user_google_id) }
      it { expect { subject }.not_to change { to_user.reload.google_id }.from(to_user_google_id) }
      it { expect { subject }.not_to change(ChangeLog, :count) }
    end

    context 'to_user_google_id is not nil' do
      let(:to_user_google_id) { 'ghijkl789012' }

      it { expect { subject }.not_to change { from_user.reload.google_id }.from(from_user_google_id) }
      it { expect { subject }.not_to change { to_user.reload.google_id }.from(to_user_google_id) }
      it { expect { subject }.not_to change(ChangeLog, :count) }
    end
  end

  context 'from_user_google_id is not nil' do
    let(:from_user_google_id) { 'abcdef123456' }

    context 'to_user_google_id is nil' do
      let(:to_user_google_id) { nil }

      it { expect { subject }.to change { from_user.reload.google_id }.from(from_user_google_id).to(nil) }
      it { expect { subject }.to change { to_user.reload.google_id }.from(to_user_google_id).to(from_user_google_id) }
      it { expect { subject }.to change(ChangeLog, :count).by(2) }
    end

    context 'to_user_google_id is not nil' do
      let(:to_user_google_id) { 'ghijkl789012' }

      it { expect { subject }.to change { from_user.reload.google_id }.from(from_user_google_id).to(nil) }
      it { expect { subject }.to change { to_user.reload.google_id }.from(to_user_google_id).to(from_user_google_id) }
      it { expect { subject }.to change(ChangeLog, :count).by(2) }
    end
  end
end
