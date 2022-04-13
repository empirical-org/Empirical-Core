# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ChargesController, type: :controller do
  let(:teacher) { create(:teacher_with_school) }

  before do
    allow(controller).to receive(:current_user) { teacher.reload }
  end

  describe '#create_customer_with_card' do
    before do
      teacher.update(stripe_customer_id: nil)
      allow(Stripe::Customer).to receive(:create) { double(:customer, id: 42) }
    end

    it 'should create the customer on stripe and update current users stripe customer id' do
      expect(Stripe::Customer).to receive(:create).with(
        description: "premium",
        source: "1",
        email: teacher.email,
        metadata: { name: teacher.name, school: teacher.reload.school.name }
      )
      post :create_customer_with_card, params: { source: { id: 1 } }
      expect(teacher.reload.stripe_customer_id).to eq "42"
    end
  end

  describe '#update_card' do
    let(:new_card) { double(:card, id: 108) }
    let(:sources) { double(:sources, create: new_card) }
    let(:customer) { double(:customer, sources: sources, "default_source=".to_sym => true, save: true) }

    before do
      allow(Stripe::Customer).to receive(:retrieve) { customer }
    end

    it 'should create a new source and add that as default source in stripe customer' do
      expect(sources).to receive(:create).with(source: "29")
      expect(customer).to receive("default_source=".to_sym).with(108)
      expect(customer).to receive(:save)
      post :update_card, params: { source: { id: 29 } }
    end
  end

  describe '#new_school_premium' do
    context 'when new subscription present' do
      before do
        allow(Subscription).to receive(:give_school_premium_if_charge_succeeds) { "subscription" }
      end

      it 'should kick off the sales contact updater and return the json' do
        expect(UpdateSalesContactWorker).to receive(:perform_async).with(teacher.id, "6.1")
        post :new_school_premium
        expect(response.body).to eq({new_subscription: "subscription"}.to_json)
      end
    end

    context 'when new subscription not present' do
      before do
        allow(Subscription).to receive(:give_school_premium_if_charge_succeeds) { nil }
      end

      it 'should return the json' do
        post :new_school_premium
        expect(response.body).to eq({new_subscription: nil}.to_json)
      end
    end
  end
end
