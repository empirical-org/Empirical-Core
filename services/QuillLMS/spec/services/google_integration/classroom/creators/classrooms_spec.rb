require 'rails_helper'

describe 'GoogleIntegration::Classroom::Creators::Classrooms' do

  def subject(teacher, courses)
    x = GoogleIntegration::Classroom::Creators::Classrooms.run(teacher, courses)
    x.map{ |y| { name: y.name, google_classroom_id: y.google_classroom_id, ownerId: teacher.google_id } }
  end

  let!(:teacher) { create(:teacher, :signed_up_with_google) }

  let!(:courses) do
    [
      {id: 1, name: 'class1', ownerId: teacher.google_id},
      {id: 2, name: 'class2', ownerId: teacher.google_id}
    ]
  end

  context 'no classroom has been created previously from one of the courses' do
    let!(:expected) do
      [
        {name: 'class1', google_classroom_id: 1, ownerId: teacher.google_id},
        {name: 'class2', google_classroom_id: 2, ownerId: teacher.google_id}
      ]
    end

    it 'produces 2 classrooms' do
      expect(subject(teacher, courses)).to eq(expected)
    end
  end
end
