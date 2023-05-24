# frozen_string_literal: true

module LearnWorldsIntegration
  class WebhooksController < ApplicationController
    class Error < StandardError; end
    class InvalidSignatureError < Error; end
    class UnknownEventTypeError < Error; end

    SIGNATURE_HEADER_KEY = 'HTTP_LEARNWORLDS_WEBHOOK_SIGNATURE'

    protect_from_forgery except: :create

    def create
      verify_signature
      webhook_handler_class.run(data)
      head 200
    rescue => e
      ErrorNotifier.report(e)
      head 400
    end

    private def event_type
      payload['type']
    end

    private def data
      payload['data']
    end

    private def payload
      @payload ||= JSON.parse(request.body.read)
    end

    private def signature_header
      request.env[SIGNATURE_HEADER_KEY]
    end

    private def verify_signature
      raise InvalidSignatureError unless signature_header.split('=').last == Auth::LearnWorlds::WEBHOOK_SIGNATURE
    end

    private def webhook_handler_class
      case event_type
      when 'enrolledFreeCourse' then Webhooks::EnrolledFreeCourseEventHandler
      when 'courseCompleted' then Webhooks::CourseCompletedEventHandler
      when 'awardedCertificate' then Webhooks::EarnedCertificateEventHandler
      else raise UnknownEventTypeError, "Unknown event type: #{event_type}"
      end
    end
  end
end
