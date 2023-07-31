# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::Classroom::Parsers::Students do
  subject { described_class.run(students) }

  context 'nil students' do
    let(:students) { nil }

    it { expect(subject).to eq [] }
  end

  context 'empty students' do
    let(:students) { [] }

    it { expect(subject).to eq [] }
  end

  context 'one student' do
    let(:email_address) { 'test1_s1@gedu.demo.rockerz.xyz' }
    let(:id) { '107708392406225674265' }
    let(:given_name) { 'test1_s1' }
    let(:family_name) { 's1' }
    let(:full_name) { 'test1_s1 s1' }

    let(:student) do
      {
        profile: {
          emailAddress: email_address,
          id: id,
          name: {
            givenName: given_name,
            familyName: family_name,
            fullName: full_name
          }
        }
      }
    end

    let(:students) { [student].as_json }

    let(:expected_result) {
      [
        {
          email: email_address,
          first_name: given_name,
          last_name: family_name,
          name: full_name,
          user_external_id: id
        }
      ]
    }

    it { is_expected.to eq expected_result }
  end
end
