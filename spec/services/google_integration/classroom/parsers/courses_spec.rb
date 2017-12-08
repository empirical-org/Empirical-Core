require 'rails_helper'

describe 'GoogleIntegration::Classroom::Parsers::Courses' do

  let!(:imported_classroom) { create(:classroom, google_classroom_id: '455798942')}
  let!(:user) { imported_classroom.owner }

  let!(:response) {
    {courses:[{id:"455798942",
                      name:"class1",
                      ownerId:"117520115627269298978",
                      creationTime:"2016-02-01T21:19:54.662Z",
                      updateTime:"2016-02-01T21:20:39.424Z",
                      enrollmentCode:"w5o4h0v",
                      alternateLink:"http://classroom.google.com/c/NDU1Nzk4OTQy"}]}
  }

  let(:archived_response) {
    response[:courses].first[:courseState] = 'ARCHIVED'
    response
  }

  let!(:expected_result) {
    course = response[:courses][0]
    [
      {id: course[:id].to_i, name: course[:name], ownerId: course[:ownerId], alreadyImported: true, creationTime: course[:creationTime], section: course[:section], grade: imported_classroom.grade}
    ]
  }

  describe 'when the user is a teacher' do
    it 'works' do
      expect(GoogleIntegration::Classroom::Parsers::Courses.run(user, response)).to eq(expected_result)
    end

    # it 'only returns classes where the passed user is also the class owner' do
    #   user.google_id = (user.google_id.to_i + 1).to_s
    #   expect(GoogleIntegration::Classroom::Parsers::Courses.run(user, response)).to eq([])
    # end

    describe 'classrooms that were archived on Google' do

      # it "only show up if they have already been imported" do
      #   expect(GoogleIntegration::Classroom::Parsers::Courses.run(user, archived_response)).to eq(expected_result)
      # end

      it "don't show up if they have not been imported" do
        imported_classroom.update(google_classroom_id: '2')
        imported_classroom.reload
        expect(GoogleIntegration::Classroom::Parsers::Courses.run(user, archived_response)).to eq([])
      end

    end
  end

  describe 'when the user is a student' do
    let!(:student) { create(:user, role: 'student') }

    it 'only returns google classroom ids where the student is not the class owner' do
      expect(GoogleIntegration::Classroom::Parsers::Courses.run(student, response)).to eq([response[:courses][0][:id]])
    end

    it 'will not return google classroom ids where the student is the class owner' do
      student.update(google_id: response[:courses][0][:ownerId])
      expect(GoogleIntegration::Classroom::Parsers::Courses.run(student, response)).to eq([])
    end
  end




end
