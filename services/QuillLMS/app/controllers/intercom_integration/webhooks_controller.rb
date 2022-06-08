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
        tag = parsed_payload["data"]["tag"]["name"]
        if tag == "Quote Request School"
          user = User.find(parsed_payload["data"]["user"]["user_id"])
          sales_form_submission = SalesFormSubmission.create(
            first_name: user.name.split[0],
            last_name: user.name.split[1],
            email: user.email,
            phone_number: "",
            zipcode: "",
            school_name: user.school&.name,
            district_name: user.school&.district&.name,
            collection_type: "school",
            submission_type: "quote request"
          )
          sales_form_submission.send_opportunity_to_vitally
        elsif tag == "Quote Request District"
        elsif tag == "Renewal Request School"
        elsif tag == "Renewal Request District"
        end
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
        ErrorNotifier.report(new Error("unauthorized call of Intercom webhook"))
        head :forbidden
      end
    end
  end
end
