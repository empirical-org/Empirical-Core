# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::UserImporter do
  include_context 'Canvas user auth hash'

  let(:role) { User::TEACHER }

  subject { described_class.run(auth_hash, role) }

  context 'canvas_account exists with canvas_instance, external_id' do
    let!(:user) { create(:canvas_account, canvas_instance: canvas_instance, external_id: canvas_user_external_id).user }

    it { expect(subject).to eq user}
    it { expect { subject}.not_to change(User, :count) }
    it { expect { subject}.not_to change(CanvasAccount, :count) }
  end

  context 'canvas_account does not exists with canvas_instance, external_id' do
    context 'user exists with canvas_user_email' do
      let!(:user) { create(:user, email: canvas_user_email) }

      it { expect(subject).to eq user }
      it { expect { subject}.not_to change(User, :count) }
      it { expect { subject}.to change(CanvasAccount, :count).by(1) }
    end

    context 'user does not exist with canvas_user_email' do
      it { expect(subject).to be_a User }
      it { expect { subject}.to change(User.teacher, :count).by(1) }
      it { expect { subject}.to change(CanvasAccount, :count).by(1) }

      context 'auth_hash contains student role' do
        let(:role) { User::STUDENT }

        it { expect { subject}.to change(User.student, :count).by(1) }
      end
    end
  end
end
