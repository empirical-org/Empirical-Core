# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::UserImporter do
  subject { described_class.run(**params) }

  let(:params) do
    {
      email: email,
      external_id: external_id,
      name: name,
      role: role,
      url: url
    }
  end

  let(:canvas_instance) { create(:canvas_instance) }

  let(:email) { Faker::Internet.email }
  let(:external_id) { Faker::Number.number }
  let(:name) { Faker::Name.custom_name }
  let(:role) { User::TEACHER }
  let(:url) { canvas_instance.url }

  context 'canvas_account exists with canvas_instance, external_id' do
    let!(:user) { create(:canvas_account, canvas_instance: canvas_instance, external_id: external_id).user }

    it { expect { subject}.not_to change(User, :count) }
    it { expect { subject}.not_to change(CanvasAccount, :count) }
  end

  context 'canvas_account does not exists with canvas_instance, external_id' do
    context 'user exists with email' do
      let!(:user) { create(:user, email: email) }

      it { expect { subject}.not_to change(User, :count) }
      it { expect { subject}.to change(CanvasAccount, :count).by(1) }
    end

    context 'user does not exist with email' do
      it { expect { subject}.to change(User.teacher, :count).by(1) }
      it { expect { subject}.to change(CanvasAccount, :count).by(1) }

      context 'unapproved role' do
        let(:role) { User::STAFF }

        it { expect { subject}.to change(User.student, :count).by(1) }
      end

      context 'student' do
        let(:role) { User::STUDENT }

        it { expect { subject}.to change(User.student, :count).by(1) }
      end
    end
  end

  context 'clever_account exists' do
    let!(:user) { create(:teacher, :signed_up_with_clever, email: email) }

    it { expect { subject}.to change { user.reload.clever_id }.to(nil) }
  end

  context 'google_account exists' do
    let!(:user) { create(:teacher, :signed_up_with_google, email: email) }

    it { expect { subject}.to change { user.reload.google_id }.to(nil) }
    it { expect { subject}.to change { user.reload.signed_up_with_google}.to(false) }
  end
end
