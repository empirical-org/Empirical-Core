# frozen_string_literal: true

require "evidence/engine"
require 'net/http'

module Evidence
  HTTP_TIMEOUT_ERRORS = [::Net::OpenTimeout, ::Net::ReadTimeout]

  mattr_accessor :parent_activity_class
  mattr_accessor :parent_activity_classification_class
  mattr_accessor :change_log_class
  mattr_accessor :user_class
  mattr_accessor :feedback_history_class
  mattr_accessor :error_notifier

  def self.parent_activity_class
    @@parent_activity_class.constantize
  end

  def self.parent_activity_classname
    @@parent_activity_class
  end

  def self.parent_activity_classification_class
    @@parent_activity_classification_class.constantize
  end

  def self.change_log_class
    @@change_log_class.constantize
  end

  def self.user_class
    @@user_class.constantize
  end

  def self.feedback_history_class
    @@feedback_history_class.constantize
  end

  def self.error_notifier
    @@error_notifier.constantize
  end

end
