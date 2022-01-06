# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::TeacherClassroomsRetriever do
  let(:teacher) { create(:teacher, :signed_up_with_clever) }

  let(:raw_data) do
    {
      "data"=> [
        {
          "data"=> {
            "grade"=>"2",
            "id"=>"6b2c569c7a68e009745801ab",
            "name"=>"Second grade - Smith - ",
            "students"=>["6b2c569c7a68e0097457ff9a", "6b2c569c7a68e0097457ff9b"],
            "subject"=>"english",
            "teacher"=>"6b2c69d17306d1054bc49f38",
            "teachers"=>["6b2c69d17306d1054bc49f38"]
          },
          "uri"=>"/v2.0/sections/6b2c569c7a68e009745801ab"
        }
      ]
    }
  end

  let(:data) { { classrooms: raw_data }}

  subject { described_class.run(teacher.id) }

  context do
    let(:client) { double(:clever_client, get_sections_for_teacher: raw_data) }

    it '' do
      expect(CleverIntegration::ClientFetcher).to receive(:run).with(teacher).and_return(client)
      expect(CleverIntegration::TeacherClassroomsCache).to receive(:set).with(teacher.id, data.to_json)
      expect(CleverIntegration::TeacherClassroomsCache).to receive(:expire).with(teacher.id)
      expect(PusherTrigger).to receive(:run)

      subject
    end
  end

  context 'no auth_credential' do
    it { expect { subject }.to raise_error CleverIntegration::ClientFetcher::NilAuthCredentialError }
  end

  context 'google auth_credential' do
    before { create(:google_auth_credential, user: teacher) }

    it { expect { subject }.to raise_error CleverIntegration::ClientFetcher::UnsupportedProviderError }
  end
end
