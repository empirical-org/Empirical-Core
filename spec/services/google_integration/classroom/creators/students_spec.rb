require 'rails_helper'

describe 'GoogleIntegration::Classroom::Creators::Students' do

  def subject(classrooms, students_requester)
    x = GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
    x.map{ |y| { name: y.name, email: y.email, classcode: y.classcode } }
  end

  let!(:classroom) { FactoryGirl.create(:classroom) }
  let!(:classrooms) { [classroom] }

  let!(:students_requester) {
    lambda do |course_id|
      x = {
            "students":
            [
              {"courseId":"455798942",
               "userId":"107708392406225674265",
               "profile":
                  {"id":"107708392406225674265",
                   "name":
                    {"givenName":"test1_s1",
                     "familyName":"s1",
                     "fullName":"test1_s1 s1"},
                    "emailAddress":"test1_s1@gedu.demo.rockerz.xyz"
                  }
              },
              {"courseId":"2",
               "userId":"2",
               "profile":
                  {"id":"2",
                   "name":
                    {"givenName":"test1_s2",
                     "familyName":"s2",
                     "fullName":"test1_s2 s2"},
                    "emailAddress":"test1_s2@gedu.demo.rockerz.xyz"
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

  context 'no students have been previously created' do
    let!(:expected) {
      [
        { name: 'test1_s1 s1', email: 'test1_s1@gedu.demo.rockerz.xyz', classcode: classroom.code },
        { name: 'test1_s2 s2', email: 'test1_s2@gedu.demo.rockerz.xyz', classcode: classroom.code }
      ]
    }

    it 'creates all the students' do
      expect(subject(classrooms, students_requester)).to eq(expected)
    end
  end

  context 'one student already exists' do
    let!(:extant) {
      FactoryGirl.create(:user, email: 'test1_s1@gedu.demo.rockerz.xyz')
    }

    let!(:expected) {
      [
        { name: 'test1_s2 s2', email: 'test1_s2@gedu.demo.rockerz.xyz', classcode: classroom.code }
      ]
    }

    it 'creates only the new students' do
      expect(subject(classrooms, students_requester)).to eq(expected)
    end
  end

end