# frozen_string_literal: true

require 'rails_helper'

describe 'CleverIntegration::Parsers::Student' do
  let(:data) do
    Clever::Student.new(
      id: '1',
      email: email,
      name: Clever::Name.new(first: 'john', last: 'smith'),
      credentials: Clever::Credentials.new(district_username: 'Username')
    )
  end

  let!(:parsed_data) do
    {
      clever_id: '1',
      email: parsed_email,
      name: 'John Smith',
      username: 'username'
    }
  end

  subject { CleverIntegration::Parsers::Student.run(data) }

  context 'valid email' do
    let(:email) { 'Student@gmail.com' }
    let(:parsed_email) { email.downcase }

    it { expect(subject).to eq(parsed_data) }
  end

  context 'invalid email' do
    let(:email) { 'not-an-email' }
    let(:parsed_email) { nil }

    it { expect(subject).to eq(parsed_data) }
  end
end
