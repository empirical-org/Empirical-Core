# frozen_string_literal: true

# Set the Engines connection to the parent activity here.
Evidence.parent_activity_class = "::Activity"
Evidence.parent_activity_classification_class = "::ActivityClassification"
Evidence.change_log_class = "::ChangeLog"
Evidence.user_class = "::User"
Evidence.feedback_history_class = "::FeedbackHistory"
Evidence.error_notifier = "::ErrorNotifier"
Evidence.sidekiq_module = "::Sidekiq::Worker"
Evidence.file_mailer = "::SendAttachmentMailer"
