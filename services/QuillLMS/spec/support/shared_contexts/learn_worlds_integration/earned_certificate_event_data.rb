# frozen_string_literal: true

RSpec.shared_context 'LearnWorlds Earned Certificate Event Data' do
  include_context 'LearnWorlds Account Course Event Data'

  let(:earned_certificate_event_data) do
    {
      "certificate" => {
        "attempts" => 0,
        "course_id" => learn_worlds_course.external_id,
        "form" => {
          "firstname" => "John",
          "lastname" => "Doe",
          "ptin" => "123456"
        },
        "id" => "619600bfec57735ec64a6b39",
        "issued" => 1637220543.671415,
        "score" => "OK",
        "short_url" => false,
        "status" => "active",
        "title" => "Cert of Completion",
        "type" => "completion",
        "user" => {
          "email" => "john@doe.com",
          "id" => "618e6db9cfb2226fe229d927"
        }
      },
      "ip_address" => nil,
      "user" => {
        "created" => 1644228530.45123,
        "email" => "john@doe.com",
        "eu_customer" => false,
        "fields" => {
          "address" => nil,
          "behance" => nil,
          "bio" => nil,
          "birthday" => nil,
          "company" => nil,
          "company_size" => nil,
          "country" => nil,
          "dribbble" => nil,
          "fb" => nil,
          "github" => nil,
          "graduation_year" => nil,
          "instagram" => nil,
          "linkedin" => nil,
          "location" => nil,
          "phone" => nil,
          "skype" => nil,
          "twitter" => nil,
          "university" => nil,
          "url" => nil
        },
        "id" => learn_worlds_account.external_id,
        "is_admin" => false,
        "is_affiliate" => false,
        "is_instructor" => false,
        "is_reporter" => false,
        "role" => {
          "level" => "user",
          "name" => "User"
        },
        "last_login" => 1646146990.079593,
        "signup_approval_status" => "passed",
        "email_verification_status" => "verified",
        "referrer_id" => nil,
        "subscribed_for_marketing_emails" => nil,
        "tags" => [],
        "username" => "JohnDoe",
        "utms" => {
          "fc_landing" => "/",
          "lc_landing" => "/"
        },
        "billing_info" => {
          "bf_name" => "Sherlock Holmes",
          "bf_address" => "Baker Street 221B",
          "bf_city" => "London",
          "bf_postalcode" => "NW1",
          "bf_country" => "UK",
          "bf_taxid" => nil
        },
        "nps_score" => 9,
        "nps_comment" => "Fantastic learning resources."
      }
    }
  end
end
