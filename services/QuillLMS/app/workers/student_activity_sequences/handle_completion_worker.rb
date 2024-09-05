# frozen_string_literal: true

module StudentActivitySequences
  class HandleCompletionWorker
    include Sidekiq::Worker

    def perform(activity_session_id)
      HandleCompletion.run(activity_session_id)
    end
  end
end
