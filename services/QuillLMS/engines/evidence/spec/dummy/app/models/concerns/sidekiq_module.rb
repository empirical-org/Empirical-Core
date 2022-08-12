module SidekiqModule
  extend ActiveSupport::Concern

  class_methods do
    def sidekiq_options(retry: nil)
    end

    def perform_async(*args)
    end
  end
end
