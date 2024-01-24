# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PdfSubscriptionsController, type: :controller do
  let(:user) { create(:user) }
  let(:user_id) { user.id }
  let(:json_response) { JSON.parse(response.body) }

  before { allow(controller).to receive(:current_user).and_return(user) }

  describe 'GET #existing' do
    subject { get :existing, params: { report: report } }

    let(:admin_report_filter_selection) { create(:usage_snapshot_report_pdf_filter_selection, user:) }
    let(:pdf_subscription) { create(:pdf_subscription, admin_report_filter_selection:) }
    let(:report) { pdf_subscription.report }

    before { subject }

    it 'returns the pdf subscription' do
      expect(json_response['id']).to eq(pdf_subscription.id)
      expect(json_response['admin_report_filter_selection_id']).to eq(admin_report_filter_selection.id)
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
      context 'admin_report_filter_selection belongs to current user' do
        let(:admin_report_filter_selection_id) { create(:admin_report_filter_selection, user:).id }

        it { expect { subject }.to change(PdfSubscription, :count).by(1) }
      end

      context 'admin_report_filter_selection does not belong to user' do
        let(:admin_report_filter_selection_id) { create(:admin_report_filter_selection).id }

        before { subject }

        it { expect(PdfSubscription.count).to eq 0 }
        it { expect(response).to have_http_status(:unauthorized) }
      end
    end

    context 'when updating an existing subscription' do
      let(:old_freq) { PdfSubscription::WEEKLY }
      let(:new_freq) { frequency }
      let(:pdf_subscription) { create(:pdf_subscription, admin_report_filter_selection_id:, frequency: old_freq) }

      context 'when the pdf subscription belongs to the current user' do
        let(:admin_report_filter_selection_id) { create(:admin_report_filter_selection, user:).id }

        it { expect { subject }.to change { pdf_subscription.reload.frequency }.from(old_freq).to(new_freq) }
      end

      context 'when the pdf subscription belongs to a different user' do
        let(:admin_report_filter_selection_id) { create(:admin_report_filter_selection).id }

        before { subject }

        it { expect(pdf_subscription.reload.frequency).not_to eq(new_freq) }
        it { expect(response).to have_http_status(:unauthorized) }
      end
    end
  end

  describe 'DELETE #destroy' do
    subject { delete :destroy, params: { id: pdf_subscription.id } }

    let(:pdf_subscription) { create(:pdf_subscription, admin_report_filter_selection:) }

    before { subject }

    context 'when the pdf subscription belongs to the current user' do
      let(:admin_report_filter_selection) { create(:usage_snapshot_report_pdf_filter_selection, user:) }

      it { expect(PdfSubscription.count).to eq 0 }
    end

    context 'when the pdf subscription belongs to a different user' do
      let(:admin_report_filter_selection) { create(:usage_snapshot_report_pdf_filter_selection) }

      it { expect(PdfSubscription.all).to eq [pdf_subscription] }
      it { expect(response).to have_http_status(:unauthorized) }
    end
  end

  describe 'DELETE #unsubscribe' do
    subject { delete :unsubscribe, params: { token: } }

    let(:pdf_subscription) { create(:pdf_subscription) }

    before { subject }

    context 'when the pdf subscription exists with a given token' do
      let(:token) { pdf_subscription.token }

      it { expect(response).to have_http_status(:ok) }
      it { expect(PdfSubscription.count).to eq 0 }
    end

    context 'when no pdf subscription is found with that token' do
      let(:token) { 'invalid-token' }

      it { expect(PdfSubscription.all).to eq [pdf_subscription] }
    end
  end
end
