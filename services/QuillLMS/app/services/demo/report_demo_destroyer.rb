# frozen_string_literal: true

module Demo::ReportDemoDestroyer
  def self.destroy_demo(email)
    email ||= Demo::ReportDemoCreator::EMAIL
    teacher  = User.find_by_email(email)
    teacher.destroy if teacher
  end
end
