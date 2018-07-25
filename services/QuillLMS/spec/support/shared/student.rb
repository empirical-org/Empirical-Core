shared_examples_for "student" do
  let(:classroom){ build(:classroom, code: '101') }
  let(:student){build(:student)}

  context 'if username is not present' do
    let!(:student){ build(:student, username: nil) }

    it 'should be valid' do
      expect(student).to be_valid
    end

    context 'when email and username is missing' do
      it 'should have an error' do
        student.email = nil
        student.valid?
        expect(student.errors[:username]).to include "can't be blank"
      end
    end
  end

  describe "#activity_sessions" do
    let!(:activity){ create(:activity) }
    let!(:student){ create(:student, :in_one_classroom) }
    let!(:classroom_activity) { create(:classroom_activity,activity_id: activity.id, classroom_id: student.classrooms.first.id) }

    it "must returns an empty array when none is assigned" do
      expect(student.activity_sessions).to be_empty
    end

    it "must not be empty when an activity session has been completed and is visible" do
      ActivitySession.create(classroom_activity_id: classroom_activity.id, activity_id: activity.id, completed_at: Time.now, user_id: student.id)
      expect(student.activity_sessions).not_to be_empty
    end
  end
end
