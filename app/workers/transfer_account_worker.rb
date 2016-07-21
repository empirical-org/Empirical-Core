class TransferAccountWorker
  include Sidekiq::Worker

  def perform(old_id, new_id)
    AdminAccountsTeachers.where(teacher_id: old_id).each{

    }
    Checkboxes.where(user_id: old_id)
    Classrooms.where(teacher_id: old_id)
    CsvExports.where()

  end
end
