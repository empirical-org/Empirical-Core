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
end
