# frozen_string_literal: true

module IntercomIntegration
  class WebhooksController < ApplicationController
    # frozen_string_literal: true
    skip_before_action :verify_authenticity_token
    before_action :verify_signature, only: [:create]

    def create
      parsed_payload = JSON.parse(payload)
      topic = parsed_payload["topic"]
      if topic == "user.tag.created"
        tag = parsed_payload["data"]["item"]["tag"]["name"]
        user = User.find(parsed_payload["data"]["item"]["user"]["user_id"])
        sales_form_submission = SalesFormSubmission.new(
          first_name: user.name.split[0],
          last_name: user.name.split[1],
          email: user.email,
          phone_number: parsed_payload["data"]["item"]["user"]["phone"],
          zipcode: parsed_payload["data"]["item"]["user"]["location_data"]["postal_code"],
          school_name: user.school&.name,
          district_name: user.school&.district&.name,
          source: SalesFormSubmission::INTERCOM_SOURCE
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

    private def payload
      request.body.read
    end

    private def verify_signature
      client_secret = ENV.fetch('INTERCOM_APP_SECRET', '')
      hexdigest = OpenSSL::HMAC.hexdigest('sha1', client_secret, payload)
      unless request.headers['X-Hub-Signature'] == "sha1=#{hexdigest}"
        raise "unauthorized call of Intercom webhook"
        head :forbidden
      end
    end
  end
end
