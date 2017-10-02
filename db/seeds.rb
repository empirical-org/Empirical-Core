ActiveRecord::Base.connection.execute(File.read('./db/seeds.sql'))

[:admin, :teacher, :student, :staff].each do |role|
  User.create(
    name: "#{role.capitalize} #{role.capitalize}son",
    email: "#{role}@quill.org",
    password: role,
    password_confirmation: role,
    created_at: Time.now,
    updated_at: Time.now,
    classcode: nil,
    active: true,
    username: role,
    token: nil,
    role: role.to_s
  ) unless User.find_by_role(role)
end
