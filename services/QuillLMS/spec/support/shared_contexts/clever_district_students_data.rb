# frozen_string_literal: true

RSpec.shared_context "Clever District Students Data" do
  let(:student1_clever_id) { "5b2c569c7a68e0097457ff9a" }
  let(:student1_first_name) { 'Bryce' }
  let(:student1_last_name) { 'Pauling' }
  let(:student1_clever_name) { Clever::Name.new(first: student1_first_name, last: student1_last_name) }
  let(:student1_name) { 'Bryce Pauling' }
  let(:student1_email) { 'bryce_pauling@example.com' }
  let(:student1_credentials) { Clever::Credentials.new(district_username: student1_email) }
  let(:student1_username) { 'bryce_pauling' }

  let(:student1_clever_data) do
    Clever::Student.new(
      created: "2021-04-29T15:08:15.162Z",
      credentials: student1_credentials,
      district: "5ea76677200018",
      email: student1_email,
      id: student1_clever_id,
      last_modified: "2021-11-19T13:52:56.162Z",
      name: student1_clever_name,
      school: "608ace9c4b913709b8",
      schools: ["608ace9c4b913709b8"],
      sis_id: student1_email
    )
  end

  let(:student1_data) { Clever::StudentResponse.new(data: student1_clever_data) }

  let(:student1_attrs) do
    {
      clever_id: student1_clever_id,
      email: student1_email,
      name: student1_name,
      username: student1_username
    }
  end

  let(:student2_clever_id) { "5b2c569c7a68e0097457ff9a" }
  let(:student2_first_name) { 'Becca' }
  let(:student2_last_name) { 'Drake' }
  let(:student2_clever_name) { Clever::Name.new(first: student2_first_name, last: student2_last_name) }
  let(:student2_name) { 'Becca Drake' }
  let(:student2_email) { nil }
  let(:student2_credentials) { Clever::Credentials.new(district_username: student2_email) }
  let(:student2_username) { nil }

  let(:student2_clever_data) do
    Clever::Student.new(
      created: "2021-04-29T15:08:15.162Z",
      credentials: student2_credentials,
      district: "5ea76677200018",
      email: student2_email,
      id: student2_clever_id,
      last_modified: "2021-11-19T13:52:56.162Z",
      name: student2_clever_name,
      school: "608ace9c4b913709b8",
      schools: ["608ace9c4b913709b8"],
      sis_id: student2_email
    )
  end

  let(:student2_data) { Clever::StudentResponse.new(data: student2_clever_data) }

  let(:student2_attrs) do
    {
      clever_id: student2_clever_id,
      email: student2_email,
      name: student2_name,
      username: student2_username
    }
  end

  let(:student3_clever_id) { '5b2c569c7a68e0097457ff9c' }
  let(:student3_first_name) { 'Linda' }
  let(:student3_last_name) { 'Redding' }
  let(:student3_clever_name) { Clever::Name.new(first: student3_first_name, last: student3_last_name) }
  let(:student3_name) { 'Linda Redding' }
  let(:student3_email) { 'not-an-actual-email' }
  let(:student3_credentials) { Clever::Credentials.new(district_username: student3_username) }
  let(:student3_username) { nil }

  let(:student3_clever_data) do
    Clever::Student.new(
      created: "2021-04-29T15:08:15.162Z",
      credentials: student3_credentials,
      district: "5ea76677200018",
      email: student3_email,
      id: student3_clever_id,
      last_modified: "2021-11-19T13:52:56.162Z",
      name: student3_clever_name,
      school: "608ace9c4b913709b8",
      schools: ["608ace9c4b913709b8"],
      sis_id: student3_email
    )
  end

  let(:student3_data) { Clever::StudentResponse.new(data: student3_clever_data) }

  let(:student3_attrs) do
    {
      clever_id: student3_clever_id,
      email: nil,
      name: student3_name,
      username: student3_username
    }
  end
end
