# frozen_string_literal: true

RSpec.shared_context 'LearnWorlds Course Completed Event Data' do
  include_context 'LearnWorlds Account Course Event Data'

  let(:course_completed_event_data) do
    {
      "completed_at" => 1637232384.736462,
      "ip_address" => nil,
      "manually_completed" => false,
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
        "title" => "sample course",
        "identifiers" => {
          "google_store_id" => "sample_course",
          "apple_store_id" => "sample_course"
        }
      },
      "user" => {
        "created" => 1636463631.488376,
        "email" => "john@doe.com",
        "eu_customer" => false,
        "fields" => {
          "address" => nil,
          "behance" => nil,
          "bio" => "my story",
          "birthday" => nil,
          "cf_checkboxtest" => nil,
          "cf_drop" => nil,
          "cf_mycustom" => nil,
          "cf_test" => "123",
          "company" => nil,
          "company_size" => nil,
          "country" => nil,
          "dribbble" => nil,
          "fb" => "htttps =>//www.fb.com",
          "github" => nil,
          "graduation_year" => "2000",
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
        "last_login" => 1637233550.657523,
        "signup_approval_status" => "passed",
        "email_verification_status" => "verified",
        "referrer_id" => nil,
        "subscribed_for_marketing_emails" => nil,
        "tags" => [
          "testgeo",
          "hi"
        ],
        "username" => "johndoe",
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
