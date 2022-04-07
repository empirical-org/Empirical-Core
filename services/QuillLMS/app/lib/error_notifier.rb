# frozen_string_literal: true

module ErrorNotifier
  # pass an exception
  def self.report(error)
    Raven.capture_exception(error)
    NewRelic::Agent.notice_error(error)
  end
end
