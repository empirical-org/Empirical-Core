# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherUpdater do
  let(:name) { 'The Name' }
  let(:data_name) { 'New Name' }
  let(:email) { 'teacher@email.com' }
  let!(:teacher) { create(:teacher, provider_trait, email: email, name: name) }

  subject { described_class.run(teacher, data)}

  let(:data) { { clever_id: data_clever_id, email: data_email, name: data_name } }

  context 'teacher is already linked with clever' do
    let(:provider_trait) { :signed_up_with_clever }
    let(:data_clever_id) { teacher.clever_id }
    let(:data_email) { "new#{email}" }

    it { expect { subject }.to change(teacher, :name).from(name).to(data_name) }
    it { expect { subject }.to change(teacher, :email).from(email).to(data_email) }
    it { expect { subject}.not_to change(teacher, :clever_id) }
  end

  context 'teacher is linked with google' do
    let(:provider_trait) { :signed_up_with_google }
    let(:data_clever_id) { "5b2c69d17306d1054bc49f38" }
    let(:data_email) { email }

    it { expect { subject }.to change(teacher, :clever_id).from(nil).to(data_clever_id) }
    it { expect { subject }.to change(teacher, :name).from(name).to(data_name) }
    it { expect { subject }.to change(teacher, :google_id).to(nil) }
    it { expect { subject}.not_to change(teacher, :email) }
  end

  context 'teacher neither linked with clever nor google' do
    let(:provider_trait) { nil }
    let(:data_clever_id) { "7b2c69d17306d1054bc49f38" }
    let(:data_email) { email }

    it { expect { subject }.to change(teacher, :clever_id).from(nil).to(data_clever_id) }
    it { expect { subject }.to change(teacher, :name).from(name).to(data_name) }
    it { expect { subject}.not_to change(teacher, :email) }
  end
end
