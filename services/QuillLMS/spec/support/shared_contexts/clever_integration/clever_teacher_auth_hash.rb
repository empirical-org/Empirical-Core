# frozen_string_literal: true

RSpec.shared_context "Clever Teacher auth_hash" do
  let(:teacher) { create(:teacher, :signed_up_with_clever) }
  let(:teacher_clever_id) { teacher.clever_id }
  let(:user_type) { 'teacher' }
  let(:email) { teacher.email }
  let(:first_name) { teacher.first_name }
  let(:last_name) { teacher.last_name }
  let(:sections) { [] }
  let(:token) { "ila49754462" }

  let(:library_auth_hash) do
    OmniAuth::AuthHash.new(
      {
        "credentials" => {
          "token" => token,
          "expires" => false
        },
        "info" => {
          "email" => email,
          "id" => teacher_clever_id,
          "name" => {
            "first" => first_name,
            "last" => last_name
          },
          "sections" => sections,
          "type" => user_type,
          "uid" => teacher_clever_id,
          "user_type" => user_type
        },
        "provider" => "clever"
      }
    )
  end

  let(:district_auth_hash) do
    OmniAuth::AuthHash.new(
      {
        "credentials" => {
          "token" => token,
          "expires" => false
        },
        "info" => {
          "district" => district_clever_id,
          "email" => email,
          "id" => teacher_clever_id,
          "name" => {
            "first" => first_name,
            "last" => last_name
          },
          "sections" => sections,
          "type" => user_type,
          "uid" => teacher_clever_id,
          "user_type" => user_type
        },
        "provider" => "clever"
      }
    )
  end

  let(:district) { create(:district) }
  let(:district_clever_id) { district.clever_id }
end
