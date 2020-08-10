module ReportDemoDestroyer
  def self.destroy_demo(name)
    email = name ? "hello+#{name}@quill.org" : "hello+demoteacher@quill.org"
    teacher  = User.find_by_email(email)
    SalesContact.where(user_id: teacher.id).destroy_all
    Notification.where(user_id: teacher.id).destroy_all
    teacher.destroy
  end
end
