# frozen_string_literal: true

class SaveTranslatedTextWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::LOW

  def perform(order_id)
    EnglishText.save_translated_text!(order_id:)
  end
end
