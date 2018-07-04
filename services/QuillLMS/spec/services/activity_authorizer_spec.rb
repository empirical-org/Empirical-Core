require 'rails_helper'

describe ActivityAuthorizer do
  let(:user) { double(:user, staff?: false) }
  let(:session) { double(:session, user: user) }
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
        allow(session).to receive(:user) { double(:another_user) }
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
    let(:classroom) { double(:classroom, owner: user) }
    let(:activity) { double(:classroom_activity, classroom: classroom) }

    before do
      allow(session).to receive(:classroom_activity) { activity }
    end

    it 'should return true if the classroom owner in the activity is the same as given user' do
      expect(subject.authorize_teacher).to eq true
    end
  end
end