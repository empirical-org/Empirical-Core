# frozen_string_literal: true

RSpec.shared_context 'LearnWorlds Enrolled Free Course Event Data' do
  include_context 'LearnWorlds Account Course Event Data'

  let(:enrolled_free_course_event_data) do
    {
      "ip_address" => nil,
      "date" => 1638190255,
      "course" => {
        "access" => "free",
        "afterPurchase" => nil,
        "author" => nil,
        "categories" => [],
        "courseImage" => nil,
        "created" => 1637232215.057839,
        "description" => nil,
        "discount_price" => 0,
        "dripFeed" => "none",
        "expires" => nil,
        "expiresType" => "weeks",
        "final_price" => 0,
        "id" => learn_worlds_course.external_id,
        "label" => nil,
        "modified" => 1637232244.922408,
        "original_price" => 0,
        "title" => learn_worlds_course.title,
        "identifiers" => {
          "google_store_id" => "sample_course",
          "apple_store_id" => "sample_course"
        }
      },
      "user" => {
        "created" => 1636724153.189269,
        "email" => "john@doe.com",
        "eu_customer" => false,
        "fields" => {
          "address" => nil,
          "behance" => nil,
          "bio" => "my story",
          "birthday" => nil,
          "company" => nil,
          "company_size" => nil,
          "country" => nil,
          "dribbble" => nil,
          "fb" => nil,
          "github" => nil,
          "graduation_year" => "2000-10-10",
          "instagram" => nil,
          "linkedin" => nil,
          "location" => "Athens",
          "phone" => nil,
          "skype" => nil,
          "twitter" => "htttps =>//www.twitter.com",
          "university" => nil,
          "url" => "https =>//test.com"
        },
        "id" => learn_worlds_account.external_id,
        "is_admin" => false,
        "is_instructor" => false,
        "is_reporter" => false,
        "role" => {
          "level" => "user",
          "name" => "User"
        },
        "is_affiliate" => true,
        "last_login" => 1637222305.3564,
        "signup_approval_status" => "passed",
        "email_verification_status" => "verified",
        "referrer_id" => nil,
        "subscribed_for_marketing_emails" => nil,
        "tags" => [
          "testgeo",
          "test2geo"
        ],
        "username" => "johndoe",
        "utms" => {
          "fc_campaign" => "WOW campaign",
          "fc_content" => nil,
          "fc_country" => nil,
          "fc_landing" => "/",
          "fc_medium" => "FB",
          "fc_referrer" => nil,
          "fc_source" => "Facebook",
          "fc_term" => nil,
          "lc_campaign" => nil,
          "lc_content" => nil,
          "lc_country" => nil,
          "lc_landing" => "/",
          "lc_medium" => nil,
          "lc_referrer" => nil,
          "lc_source" => nil,
          "lc_term" => nil
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