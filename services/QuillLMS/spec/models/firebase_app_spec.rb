# frozen_string_literal: true

# == Schema Information
#
# Table name: firebase_apps
#
#  id         :integer          not null, primary key
#  name       :string
#  pkey       :text
#  secret     :string
#  throwaway  :text             default("lorem")
#  created_at :datetime
#  updated_at :datetime
#
require 'rails_helper'
require 'jwt'

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

  describe '#connect_token_for' do
    let(:time) { Time.new('1010') }
    let(:key) { OpenSSL::PKey::RSA.new(2045) }

    def payload_hash(user, claims)
      user_id = user.present? ? user.id.to_s : 'anonymous'
      now_seconds = Time.now.to_i
      payload = {
        'iss' => ENV['FIREBASE_CONNECT_SERVICE_EMAIL'],
        'sub' => ENV['FIREBASE_CONNECT_SERVICE_EMAIL'],
        'uid' => user_id,
        'aud' =>"https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
        'iat' => now_seconds,
        'exp' => now_seconds+(60*60), # Maximum expiration time is one hour,
        'claims' => claims
      }
    end

    before do
      allow(Time).to receive(:now).and_return(time)
      #to decode the encrypted payload
      allow(OpenSSL::PKey::RSA).to receive(:new).and_return(key)
    end

    context 'when no user' do
      it 'should return the encoded payload with anonymous claims' do
        connect_token = firebase_app.connect_token_for(nil)
        expect(JWT.decode(connect_token, key, true, { algorithm: 'RS256' })).to eq [payload_hash(nil, {'anonymous' => true}), {"alg"=>"RS256"}]
      end
    end

    context 'when staff user' do
      let(:user) { create(:user, role: 'staff') }

      it 'should return the encoded payload with staff claims' do
        connect_token = firebase_app.connect_token_for(user)
        expect(JWT.decode(connect_token, key, true, { algorithm: 'RS256' })).to eq [payload_hash(user, {'staff' => true}), {"alg"=>"RS256"}]
      end
    end

    context 'when admin user' do
      let(:user) { create(:user, role: User::ADMIN) }

      it 'should return the encoded payload with admin claims' do
        connect_token = firebase_app.connect_token_for(user)
        expect(JWT.decode(connect_token, key, true, { algorithm: 'RS256' })).to eq [payload_hash(user, {'admin' => true}), {"alg"=>"RS256"}]
      end
    end

    context 'when teacher user' do
      let(:user) { create(:user, role: 'teacher') }

      it 'should return the encoded payload with teacher claims' do
        connect_token = firebase_app.connect_token_for(user)
        expect(JWT.decode(connect_token, key, true, { algorithm: 'RS256' })).to eq [payload_hash(user, {'teacher' => true}), {"alg"=>"RS256"}]
      end
    end

    context 'when student user' do
      let(:user) { create(:user, role: 'student') }

      it 'should return the encoded payload with student claims' do
        connect_token = firebase_app.connect_token_for(user)
        expect(JWT.decode(connect_token, key, true, { algorithm: 'RS256' })).to eq [payload_hash(user, {'student' => true}), {"alg"=>"RS256"}]
      end
    end
  end

end
