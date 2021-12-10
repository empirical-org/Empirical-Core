# frozen_string_literal: true

shared_examples_for "student" do
  let(:classroom){ build(:classroom, code: '101') }
  let(:student){build(:student)}

  context 'if username is not present' do
    let!(:student){ build(:student, username: nil) }

    it 'should be valid' do
      expect(student).to be_valid
    end

  end
end
