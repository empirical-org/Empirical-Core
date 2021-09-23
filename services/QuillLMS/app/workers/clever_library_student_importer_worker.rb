class CleverLibraryStudentImporterWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(classroom_ids, token)
    client = CleverLibrary::Api::Client.new(token)

    CleverIntegration::LibraryStudentImporter.new(classroom_ids, client).run
  end
end
