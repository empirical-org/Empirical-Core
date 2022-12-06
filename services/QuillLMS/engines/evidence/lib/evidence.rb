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
  mattr_accessor :sidekiq_module
  mattr_accessor :file_mailer
  mattr_accessor :file_uploader
  mattr_accessor :flags_class

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

  def self.sidekiq_module
    @@sidekiq_module.constantize
  end

  def self.file_mailer
    @@file_mailer.constantize
  end

  def self.file_uploader
    @@file_uploader.constantize
  end

  def self.flags_class
    @@flags_class.constantize
  end
end
