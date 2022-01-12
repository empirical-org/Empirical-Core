# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherCreator do
  let(:clever_id) { 'abcdef123456' }
  let(:email) { 'the_teacher@gmail.com' }
  let(:name) { 'The Teacher' }

  let(:data) { { clever_id: clever_id, email: email, name: name } }

  subject { described_class.run(data) }

  it { expect(subject.clever_id).to eq clever_id }
  it { expect(subject.email).to eq email }
  it { expect(subject.name).to eq name }
end
