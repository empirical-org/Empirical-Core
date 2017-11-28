require 'rails_helper'

describe FirebaseApp, type: :model do

  let(:firebase_app){ create(:firebase_app) }

  context "#token_for" do
    let(:generator) { double("Firebase::FirebaseTokenGenerator") }

    before do
      allow(firebase_app).to receive(:token_generator).and_return(generator)
    end

    subject do
      firebase_app.token_for(user)
    end

    shared_examples_for 'generating a token' do
      it 'generates a token with the user role in the payload' do
        role = user.role.to_sym
        expected_subhash = { role => true }
        expect(generator).to receive(:create_token).with(hash_including(expected_subhash))
        subject
      end

      it "generates a token with the uid in the payload, where the uid is of the form 'custom:user.id'" do
        expected_subhash = {uid: "custom:#{user.id}"}
        expect(generator).to receive(:create_token).with(hash_including(expected_subhash))
        subject
      end

      it 'returns the token' do
        expect(generator).to receive(:create_token).and_return('foo')
        expect(subject).to eq('foo')
      end
    end

    context 'for a student' do
      let(:user) { create(:student) }

      it_behaves_like 'generating a token'
    end

    context 'for an anonymous user' do
      let(:user) { nil }
      it "generates a token with the uid in the payload, where the uid is 'custom:anonymous'" do
        expected_subhash = {uid: 'custom:anonymous'}
        expect(generator).to receive(:create_token).with(hash_including(expected_subhash))
        subject
      end

      it 'generates a token with the anonymous flag in the payload' do
        expect(generator).to receive(:create_token).with(hash_including({anonymous: true}))
        subject
      end
    end

    context 'for a teacher' do
      let(:user) { create(:teacher) }

      it_behaves_like 'generating a token'
    end

    context 'for a staff member' do
      let(:user) { create(:staff) }

      it_behaves_like 'generating a token'
    end
  end

end
