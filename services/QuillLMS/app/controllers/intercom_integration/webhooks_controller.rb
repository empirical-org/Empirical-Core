# frozen_string_literal: true

module IntercomIntegration
  class WebhooksController < ApplicationController
    UNKNOWN_NAME = "Unknown User"

    skip_before_action :verify_authenticity_token
    before_action :verify_signature, only: [:create]

    def create
      topic = parsed_payload["topic"]
      if topic == "user.tag.created" || topic == "contact.tag.created"
        tag = parsed_payload["data"]["item"]["tag"]["name"]
        user = find_or_create_user
        sales_form_submission = SalesFormSubmission.new(
          first_name: user.name.split[0],
          last_name: user.name.split[1],
          email: user.email,
          phone_number: user_payload["phone"],
          zipcode: user_payload["location_data"]["postal_code"],
          school_name: user&.school&.name,
          district_name: user&.school&.district&.name,
          source: SalesFormSubmission::INTERCOM_SOURCE,
          intercom_link: intercom_link(user_payload["id"])
        )
        if tag == "Quote Request School"
          sales_form_submission.collection_type = SalesFormSubmission::SCHOOL_COLLECTION_TYPE
          sales_form_submission.submission_type = SalesFormSubmission::QUOTE_REQUEST_TYPE
        elsif tag == "Quote Request District"
          sales_form_submission.collection_type = SalesFormSubmission::DISTRICT_COLLECTION_TYPE
          sales_form_submission.submission_type = SalesFormSubmission::QUOTE_REQUEST_TYPE
        elsif tag == "Renewal Request School"
          sales_form_submission.collection_type = SalesFormSubmission::SCHOOL_COLLECTION_TYPE
          sales_form_submission.submission_type = SalesFormSubmission::RENEWAL_REQUEST_TYPE
        elsif tag == "Renewal Request District"
          sales_form_submission.collection_type = SalesFormSubmission::DISTRICT_COLLECTION_TYPE
          sales_form_submission.submission_type = SalesFormSubmission::RENEWAL_REQUEST_TYPE
        end
        sales_form_submission.save!
      end
      head 200
    end

    private def intercom_link(intercom_user_id)
      "https://app.intercom.com/a/apps/v2ms5bl3/users/#{intercom_user_id}/all-conversations"
    end

    private def payload
      request.body.read
    end

    private def parsed_payload
      @parsed_payload ||= JSON.parse(payload)
    end

    private def user_payload
      @user_payload ||= parsed_payload["data"]["item"]["user"] || parsed_payload["data"]["item"]["contact"]
    end

    private def verify_signature
      client_secret = ENV.fetch('INTERCOM_APP_SECRET', '')
      hexdigest = OpenSSL::HMAC.hexdigest('sha1', client_secret, payload)
      unless request.headers['X-Hub-Signature'] == "sha1=#{hexdigest}"
        raise "unauthorized call of Intercom webhook"
        head :forbidden
      end
    end

    private def find_or_create_user
      user = User.find_by(id: user_payload["user_id"]) if !user_payload["anonymous"]
      return user if user.present?

      user = User.find_by(email: user_payload["email"])
      return user if user.present?

      User.create!(
        email: user_payload["email"],
        role: User::SALES_CONTACT,
        name: user_payload["name"] || UNKNOWN_NAME,
        password: SecureRandom.uuid
      )
    end
  end
end
