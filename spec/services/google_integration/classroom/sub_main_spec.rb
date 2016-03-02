require 'rails_helper'


describe 'GoogleIntegration::Classroom::SubMain' do

  def subject
    GoogleIntegration::Classroom::SubMain.pull_and_save_data(user, course_response, students_requester)
  end

  let!(:google_classroom_id) { "455798942" }
  let!(:google_classroom_id_2) { "2" }

  let!(:course_body) {
    x = {"courses":[{"id": google_classroom_id,"name":"class1","ownerId":"117520115627269298978","creationTime":"2016-02-01T21:19:54.662Z","updateTime":"2016-02-01T21:20:39.424Z","enrollmentCode":"w5o4h0v","courseState":"ACTIVE","alternateLink":"http://classroom.google.com/c/NDU1Nzk4OTQy"},
      {"id": google_classroom_id_2,"name":"class2"}]}
    .to_json
  }

  let!(:course_response) {
    Response = Struct.new(:body)
    Response.new(course_body)
  }

  let!(:students_requester) {
    lambda do |course_id|
      x = {
            "students":
            [
              {"courseId": course_id,
               "userId":"107708392406225674265",
               "profile":
                  {"id":"107708392406225674265",
                   "name":
                    {"givenName":"test1_s1",
                     "familyName":"s1",
                     "fullName":"test1_s1 s1"},
                    "emailAddress": "#{course_id}.test1_s1@gedu.demo.rockerz.xyz"
                  }
              },
              {"courseId": course_id,
               "userId":"2",
               "profile":
                  {"id":"2",
                   "name":
                    {"givenName":"test1_s2",
                     "familyName":"s2",
                     "fullName":"test1_s2 s2"},
                    "emailAddress": "#{course_id}.test1_s2@gedu.demo.rockerz.xyz"
                  }
              }
            ]
      }
      body = x.to_json
      Response = Struct.new(:body)
      response = Response.new(body)
      return response
    end
  }

  context 'student' do
    let!(:extant_google_classroom) {
      FactoryGirl.create(:classroom, google_classroom_id: google_classroom_id.to_i)
    }

    let!(:user) { FactoryGirl.create(:user, role: 'student') }

    it 'associates student to her first google classroom' do
      subject
      expect(user.classrooms.first).to eq(extant_google_classroom)
    end
  end

  context 'teacher' do
    let!(:user) { FactoryGirl.create(:user, role: 'teacher') }
    let!(:classrooms) { Classroom.where(google_classroom_id: [google_classroom_id.to_i, google_classroom_id_2.to_i]) }

    it 'creates both classrooms' do
      subject
      expect(classrooms.length).to eq(2)
    end

    it 'associates both classrooms to the teacher' do
      subject
      expect(classrooms.map(&:teacher_id)).to eq([user.id, user.id])
    end

    it 'creates students for the classrooms' do
      subject
      x = classrooms.map(&:students).map do |students|
        students.map do |student|
          { name: student.name, email: student.email }
        end
      end
      expect(x).to match_array([
        [
          { name: 'Test1_s2 S2', email: "#{google_classroom_id}.test1_s2@gedu.demo.rockerz.xyz" },
          { name: 'Test1_s1 S1', email: "#{google_classroom_id}.test1_s1@gedu.demo.rockerz.xyz" }
        ],
        [
          { name: 'Test1_s2 S2', email: "#{google_classroom_id_2}.test1_s2@gedu.demo.rockerz.xyz" },
          { name: 'Test1_s1 S1', email: "#{google_classroom_id_2}.test1_s1@gedu.demo.rockerz.xyz" }
        ]

      ])
    end
  end
end