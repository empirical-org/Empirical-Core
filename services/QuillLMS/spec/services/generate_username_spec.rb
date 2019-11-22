require 'rails_helper'

describe GenerateUsername do
  it 'generates a downcased username made up of the first name, last name, and class code of the student' do
    expect(GenerateUsername.new('John', 'Smith', 'student').call).to eq 'john.smith@student'
  end

  it 'inserts a number after the last name if there is already a student in the database with that username' do
    create(:student, { username: 'john.smith@student' })
    expect(GenerateUsername.new('John', 'Smith', 'student').call).to eq 'john.smith2@student'
  end
end
