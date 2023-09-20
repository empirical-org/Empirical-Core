# frozen_string_literal: true

FactoryBot.define do
  factory :omniauth_auth_hash, class: 'OmniAuth::AuthHash' do
    skip_create

    factory :canvas_auth_hash do
      initialize_with do
        OmniAuth::AuthHash.new(
          provider: 'canvas',
          uid: uid,
          info:  {
            name: name,
            email: email,
            bio: nil,
            title: nil,
            nickname: nickname,
            active_avatar: nil,
            url: url
          },
          credentials:  {
            token: token,
            refresh_token: refresh_token,
            expires_at: expires_at,
            expires: true
          },
          extra:  {
            raw_info:  {
              id: uid,
              name: name,
              short_name: short_name,
              sortable_name: sortable_name,
              sis_user_id: nil,
              integration_id: nil,
              title: nil,
              bio: nil,
              primary_email: primary_email,
              login_id: login_id,
              time_zone: time_zone,
              locale: nil,
              effective_locale: 'en',
              lti_user_id: lti_user_id,
              k5_user: false,
              use_classic_font_in_k5: false
            }
          }
        )
      end

      transient do
        email { Faker::Internet.email }
        expires_at { 1.hour.from_now.to_i }
        lti_user_id { SecureRandom.uuid }
        login_id { Faker::Internet.username }
        name { Faker::Name.custom_name }
        nickname { Faker::Name.first_name }
        primary_email { email }
        short_name { Faker::Name.first_name }
        sortable_name { Faker::Name.custom_name }
        time_zone { 'America/New_York' }
        token { [rand(1..99999), SecureRandom.alphanumeric(64)].join('~') }
        refresh_token { [rand(1..99999), SecureRandom.alphanumeric(64)].join('~') }
        sequence(:uid)
        url { "https://#{Faker::Internet.domain_word}.instructure.com" }
      end
    end
  end
end
