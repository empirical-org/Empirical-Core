require 'rails_helper'

describe 'GoogleIntegration::Classroom::Creators::Students' do

  def subject(classrooms, students_requester)
    x = GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
    x.map(&:reload).map{ |y| { name: y.name, email: y.email } }
  end

  let!(:classroom) { create(:classroom) }
  let!(:classrooms) { [classroom] }

  let!(:students_requester) do
    lambda do |course_id|
      x = [{
          "profile": {
              "id": "107708392406225674265",
              "name": {
                  "givenName": "test1_s1",
                  "familyName": "s1",
                  "fullName": "test1_s1 s1"
              },
              "emailAddress": "test1_s1@gedu.demo.rockerz.xyz"
          }
      }, {
          "profile": {
              "id": "2",
              "name": {
                  "givenName": "test1_s2",
                  "familyName": "s2",
                  "fullName": "test1_s2 s2"
              },
              "emailAddress": "test1_s2@gedu.demo.rockerz.xyz"
          }
      }]
      body = JSON.parse(x.to_json)
    end
  end

  context 'no students have been previously created' do
    let!(:expected) do
      [
        { name: 'Test1_s1 S1', email: 'test1_s1@gedu.demo.rockerz.xyz'},
        { name: 'Test1_s2 S2', email: 'test1_s2@gedu.demo.rockerz.xyz'}
      ]
    end

    it 'creates all the students' do
      expect(subject(classrooms, students_requester)).to eq(expected)
    end
  end


  context 'activities have been assigned to the classroom in the past' do

    def subject
      GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
    end

    let!(:activity) { create(:activity) }
    let!(:classroom_activity) { create(:classroom_activity, classroom: classroom, activity: activity, assign_on_join: true) }

    xit 'assigns those activities to the new students' do
      expect(classroom_activity.assigned_student_ids.length).to eq(subject.count)
    end
  end
end
