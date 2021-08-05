require 'rails_helper'

describe GoogleIntegration::Classroom::Creators::Students do

  context '.run' do
    def subject(classrooms, students_requester)
      profiles = GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
      profiles.map(&:reload).map { |profile| { name: profile.name, email: profile.email } }
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
  end

  context '.update_existing_student_with_google_id_and_different_email' do
    let!(:student) { create :student, google_id: '123' }
    let(:orig_email) { student.email }
    let(:data) { { email: email, google_id: google_id } }

    subject do
      described_class.update_existing_student_with_google_id_and_different_email(data)
      student.reload
    end

    context 'no student exists with google_id' do
      let(:google_id) { '456' }
      let(:email) { orig_email }

      it 'does not update the email' do
        expect { subject }.to_not change(student, :email)
      end
    end

    context 'student exists with google_id and same email as data[:email]' do
      let(:google_id) { '123' }
      let(:email) { orig_email }

      it 'does not update the email' do
        expect { subject }.to_not change(student, :email)
      end
    end

    context 'student exists with google_id but different email than data[:email]' do
      let(:different_email) { 'different_' + orig_email }
      let(:google_id) { '123' }
      let(:email) { different_email }

      it 'updates the email' do
        expect { subject }.to change(student, :email).from(orig_email).to(different_email)
      end

      context 'a different user exists with data[:email]' do
        let!(:another_student) { create :student, email: different_email }

        it 'does not update the email' do
          expect { subject }.to_not change(student, :email)
        end
      end
    end
  end
end


