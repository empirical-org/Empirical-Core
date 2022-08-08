# frozen_string_literal: true

module IntercomIntegration
  class WebhooksController < ApplicationController
    UNKNOWN_NAME = "Unknown User"

    class UnauthorizedIntercomWebhookCallError < StandardError; end

    skip_before_action :verify_authenticity_token
    before_action :verify_signature, only: [:create]

    def create
      topic = parsed_payload["topic"]
      if ["user.tag.created", "contact.tag.created"].include?(topic)
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
        sales_form_submission.collection_type = collection_type(tag)
        sales_form_submission.submission_type = submission_type(tag)
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
      return if request.headers['X-Hub-Signature'] == "sha1=#{hexdigest}"

      raise(UnauthorizedIntercomWebhookCallError, "unauthorized call of Intercom webhook")
    end

    private def find_or_create_user
      user = User.find_by(id: user_payload["user_id"]) unless user_payload["anonymous"]
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

    private def collection_type(tag)
      case tag
      when "Quote Request School", "Renewal Request School"
        SalesFormSubmission::SCHOOL_COLLECTION_TYPE
      when "Quote Request District", "Renewal Request District"
        SalesFormSubmission::DISTRICT_COLLECTION_TYPE
      else
        ""
      end
    end

    private def submission_type(tag)
      case tag
      when "Quote Request School", "Quote Request District"
        SalesFormSubmission::QUOTE_REQUEST_TYPE
      when "Renewal Request School", "Renewal Request District"
        SalesFormSubmission::RENEWAL_REQUEST_TYPE
      else
        ""
      end
    end
  end
end
