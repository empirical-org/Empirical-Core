# frozen_string_literal: true

RSpec.shared_context 'Clever District Admin auth_hash' do
  let(:user_type) { :district_admin }
  let(:email) { Faker::Internet.email }
  let(:district_clever_id) { SecureRandom.hex(12) }
  let(:district_admin_clever_id) { SecureRandom.hex(12) }
  let(:first_name) { Faker::Name.first_name }
  let(:last_name) { Faker::Name.last_name }
  let(:token) { "il#{SecureRandom.hex(19)}" }

  let(:auth_hash) do
    OmniAuth::AuthHash.new(
      {
        'credentials' => {
          'token' => token,
          'expires' => false
        },
        'info' => {
          'email' => email,
          'district' => district_clever_id,
          'id' => district_admin_clever_id,
          'name' => {
            'first' => first_name,
            'last' => last_name
          },
          'uid' => district_admin_clever_id,
          'user_type' => user_type
        },
        'provider' => 'clever'
      }
    )
  end
end
