# frozen_string_literal: true

module IntercomIntegration
  class WebhooksController < ApplicationController

    class UnauthorizedIntercomWebhookCallError < StandardError; end

    UNKNOWN_NAME = "Unknown User"
    CREATE_SALES_FORM_SUBMISSION_INTERCOM_EVENTS = [
      "user.tag.created",
      "contact.tag.created"
    ]
    QUOTE_REQUEST_DISTRICT = "Quote Request District"
    QUOTE_REQUEST_SCHOOL = "Quote Request School"
    RENEWAL_REQUEST_DISTRICT = "Renewal Request District"
    RENEWAL_REQUEST_SCHOOL = "Renewal Request School"

    COLLECTION_MAPPING = {
      QUOTE_REQUEST_DISTRICT => SalesFormSubmission::DISTRICT_COLLECTION_TYPE,
      QUOTE_REQUEST_SCHOOL => SalesFormSubmission::SCHOOL_COLLECTION_TYPE,
      RENEWAL_REQUEST_DISTRICT => SalesFormSubmission::DISTRICT_COLLECTION_TYPE,
      RENEWAL_REQUEST_SCHOOL => SalesFormSubmission::SCHOOL_COLLECTION_TYPE
    }

    SUBMISSION_MAPPING = {
      QUOTE_REQUEST_DISTRICT => SalesFormSubmission::QUOTE_REQUEST_TYPE,
      QUOTE_REQUEST_SCHOOL => SalesFormSubmission::QUOTE_REQUEST_TYPE,
      RENEWAL_REQUEST_DISTRICT => SalesFormSubmission::RENEWAL_REQUEST_TYPE,
      RENEWAL_REQUEST_SCHOOL => SalesFormSubmission::RENEWAL_REQUEST_TYPE
    }

    skip_before_action :verify_authenticity_token
    before_action :verify_signature, only: [:create]

    def create
      topic = params["topic"]
      if CREATE_SALES_FORM_SUBMISSION_INTERCOM_EVENTS.include?(topic)
        tag = params["data"]["item"]["tag"]["name"]
        user = find_or_create_user
        SalesFormSubmission.create!(
          first_name: user.name.split[0],
          last_name: user.name.split[1],
          email: user.email,
          phone_number: user_params["phone"],
          school_name: user&.school&.name,
          district_name: user&.school&.district&.name,
          source: SalesFormSubmission::INTERCOM_SOURCE,
          intercom_link: intercom_link(user_params["id"]),
          collection_type: collection_type(tag),
          submission_type: submission_type(tag)
        )
      end
      head 200
    end

    private def intercom_link(intercom_user_id)
      "https://app.intercom.com/a/apps/v2ms5bl3/users/#{intercom_user_id}/all-conversations"
    end

    private def payload
      request.body.read
    end

    private def user_params
      @user_params ||= params["data"]["item"]["user"] || params["data"]["item"]["contact"]
    end

    private def verify_signature
      client_secret = ENV.fetch('INTERCOM_APP_SECRET', '')
      hexdigest = OpenSSL::HMAC.hexdigest('sha1', client_secret, payload)
      return if request.headers['X-Hub-Signature'] == "sha1=#{hexdigest}"

      raise(UnauthorizedIntercomWebhookCallError, "unauthorized call of Intercom webhook")
    end

    # TODO: Reaxamine the logic we use here after we figure out what we want to do
    # regarding 'sales-contact' User roles.
    private def find_or_create_user
      user = User.find_by(id: user_params["user_id"]) unless user_params["anonymous"]
      return user if user.present?

      user = User.find_by(email: user_params["email"])
      return user if user.present?

      User.create!(
        email: user_params["email"],
        role: User::SALES_CONTACT,
        name: user_params["name"] || UNKNOWN_NAME,
        password: SecureRandom.uuid
      )
    end

    private def collection_type(tag)
      COLLECTION_MAPPING.fetch(tag, '')
    end

    private def submission_type(tag)
      SUBMISSION_MAPPING.fetch(tag, '')
    end
  end
end
