require 'rails_helper'

describe ActivityAuthorizer do
  let(:user) { create(:teacher) }
  let(:session) { create(:activity_session, user: user) }
  let(:subject) { described_class.new(user, session) }

  describe '#authorize' do
    context 'when user is staff' do
      before do
        allow(user).to receive(:staff?) { true }
      end

      it 'should return true' do
        expect(subject.authorize).to eq true
      end
    end

    context 'when activity session is blank' do
      before do
        allow(session).to receive(:blank?) { true }
      end

      it 'should return false' do
        expect(subject.authorize).to eq false
      end
    end

    context 'when activity session user is not the same as given user' do
      before do
        allow(session).to receive(:user) { create(:teacher) }
      end

      it 'should return false' do
        expect(subject.authorize).to eq false
      end
    end

    context 'when activity session user is the same as given user' do
      it 'should return true' do
        expect(subject.authorize).to eq true
      end
    end
  end

  describe '#authorize_teacher' do
    let(:classroom) { create(:classroom, :with_no_teacher) }
    let(:classroom_unit) { create(:classroom_unit, classroom: classroom) }

    before do
      allow(session).to receive(:classroom_unit) { classroom_unit }
    end

    it 'should return true if the classroom owner in the classroom unit is the same as given user' do
      ClassroomsTeacher.create(classroom: classroom, user: user, role: 'owner')
      expect(subject.authorize_teacher).to eq true
    end
  end
end
