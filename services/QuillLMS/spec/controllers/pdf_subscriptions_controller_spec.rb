# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PdfSubscriptionsController, type: :controller do
  let(:user) { create(:user) }
  let(:user_id) { user.id}
  let(:json_response) { JSON.parse(response.body) }

  before { allow(controller).to receive(:current_user).and_return(user) }

  describe 'GET #existing' do
    subject { get :existing, params: { report: report } }

    let(:pdf_subscription) { create(:pdf_subscription) }
    let(:admin_report_filter_selection) { pdf_subscription.admin_report_filter_selection }
    let(:report) { admin_report_filter_selection.report }

    before { subject }

    it 'returns the pdf subscription' do
      expect(json_response['id']).to eq(pdf_subscription.id)
      expect(json_response['frequency']).to eq(pdf_subscription.frequency)
    end

    context 'when pdf subscription does not exist' do
      let(:report) { 'invalid-report' }

      it { expect(json_response).to be_nil }
    end
  end

  describe 'POST #create_or_update' do
    subject { post :create_or_update, params: { pdf_subscription: { admin_report_filter_selection_id:, frequency: } } }

    let(:frequency) { PdfSubscription::MONTHLY }

    context 'when creating a new subscription' do
      let(:admin_report_filter_selection_id) { create(:admin_report_filter_selection).id }

      it { expect { subject }.to change(PdfSubscription, :count).by(1) }
    end

    context 'when updating an existing subscription' do
      let(:original_frequency) { PdfSubscription::WEEKLY }
      let(:pdf_subscription) { create(:pdf_subscription, frequency: original_frequency) }
      let(:admin_report_filter_selection_id) { pdf_subscription.admin_report_filter_selection_id }

      it { expect { subject }.to change { pdf_subscription.reload.frequency }.from(original_frequency).to(frequency) }
    end
  end

  describe 'DELETE #destroy' do
    subject { delete :destroy, params: { id: pdf_subscription.id } }

    it { expect { subject }.to change(PdfSubscription, :count).by(-1) }
    it { expect(response).to have_http_status(:ok) }
  end

  describe 'GET #unsubscribe' do
    it 'unsubscribes the user from the pdf subscription' do
      get :unsubscribe, params: { token: pdf_subscription.token }
      expect(PdfSubscription.exists?(pdf_subscription.id)).to be_falsey
    end
  end

end
