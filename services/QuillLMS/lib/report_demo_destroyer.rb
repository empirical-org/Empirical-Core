module ReportDemoDestroyer
  def self.destroy_demo(name)
    email = name ? "hello+#{name}@quill.org" : "hello+demoteacher@quill.org"
    teacher  = User.find_by_email(email)
    teacher.delete
  end
end
