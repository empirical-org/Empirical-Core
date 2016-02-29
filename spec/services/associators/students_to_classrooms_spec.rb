require 'rails_helper'

describe 'Associators::StudentsToClassrooms' do

  def subject(student, classroom)
    Associators::StudentsToClassrooms.run(student, classroom)
  end

  let!(:student) { FactoryGirl.create(:user, role: 'student') }
  let!(:classroom) { FactoryGirl.create(:classroom) }

  it 'associates a student to a classroom' do
    subject(student, classroom)
    expect(student.classrooms).to include(classroom)
  end
end
