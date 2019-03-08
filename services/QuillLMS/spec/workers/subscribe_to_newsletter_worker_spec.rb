require 'rails_helper'

describe SubscribeToNewsletterWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let(:http) { double(:http, "use_ssl=" => true, "verify_mode=" => true, request: double(:response, read_body: { "persisted_recipients" => ["recipients"] }.to_json)) }
    let(:post) { {} }

    before do
      post.class.class_eval { attr_accessor :body }
      allow(Net::HTTP).to receive(:new) { http }
      allow(Net::HTTP::Post).to receive(:new) { post }
      allow_any_instance_of(User).to receive(:send_newsletter) { true }
    end

    it 'should send the newsletter' do
      expect_any_instance_of(User).to receive(:send_newsletter)
      subject.perform(user.id)
    end

    it 'should add the recipient to the contacs and list' do
      expect(http).to receive(:request).with(post)
      expect(post).to receive("body=").with([{email: user.email, first_name: user.first_name, last_name: "User"}].to_json).ordered
      expect(post).to receive("body=").with("null").ordered
      subject.perform(user.id)
    end
  end
end