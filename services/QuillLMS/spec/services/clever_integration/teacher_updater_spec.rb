# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherUpdater do
  subject { described_class.run(teacher, data)}

  let(:teacher) { create(:teacher, provider_trait) }

  let(:email) { teacher.email }
  let(:name) { teacher.name }

  let(:data) do
    {
      email: email,
      name: name,
      user_external_id: user_external_id
    }
  end

  context 'teacher is already linked with clever' do
    let(:provider_trait) { :signed_up_with_clever }
    let(:user_external_id) { teacher.clever_id }
    let(:name) { 'Another Teacher' }
    let(:email) { Faker::Internet.email }

    it { expect { subject }.to change(teacher, :name).to(name) }
    it { expect { subject }.to change(teacher, :email).to(email) }
    it { expect { subject}.not_to change(teacher, :clever_id) }

    context 'teacher does not have a TEACHER_INFO role (i.e. they are school staff)' do
      let(:role) { User::STUDENT }

      before { teacher.update(role: role) }

      it { expect { subject }.to change(teacher, :role).from(role).to(User::TEACHER) }
    end

    context 'teacher has a TEACHER_INFO role already' do
      before { teacher.update(role: User::ADMIN) }

      it { expect { subject }.not_to change(teacher, :role) }
    end
  end

  context 'teacher is linked with google' do
    let(:provider_trait) { :signed_up_with_google }
    let(:user_external_id) { SecureRandom.hex(12) }

    it { expect { subject }.to change(teacher, :clever_id).to(user_external_id) }
    it { expect { subject }.to change(teacher, :google_id).to(nil) }
    it { expect { subject}.not_to change(teacher, :email) }
  end

  context 'teacher neither linked with clever nor google' do
    let(:provider_trait) { nil }
    let(:user_external_id) { SecureRandom.hex(12) }

    it { expect { subject }.to change(teacher, :clever_id).to(user_external_id) }
    it { expect { subject}.not_to change(teacher, :email) }
  end
end
