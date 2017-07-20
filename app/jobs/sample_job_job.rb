class SampleJobJob < ApplicationJob
  queue_as :default

  # to simply queue
  # SampleJobJob.perform_later

  # to queue at a later time
  # SampleJobJob.new.enqueue(wait: 6.seconds)

  def perform(*args)
    puts 'sample job was run'
  end
end
