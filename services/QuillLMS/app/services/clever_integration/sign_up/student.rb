module CleverIntegration::SignUp::Student
  # teacher must have signed up first (importing associated students)
  def self.run(auth_hash)
    student = User.find_by(clever_id: auth_hash[:info][:id])
    if student.present?
      result = {type: 'user_success', data: student}
    else
      result = {type: 'user_failure', data: "No Student Present"}
    end
    result
  end
end
