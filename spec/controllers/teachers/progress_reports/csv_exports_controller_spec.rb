require 'rails_helper'

describe Teachers::ProgressReports::CsvExportsController, :type => :controller do
  include_context 'Activity Progress Report'

  describe 'POST #create' do
    let(:export_type) { 'activity_sessions' }
    subject { post :create, {csv_export: {export_type: export_type }}}

    context 'when authenticated as a teacher' do
      before do
        session[:user_id] = mr_kotter.id
      end

      it 'creates a CSV export with the specified type' do
        expect {
          subject
        }.to change(CsvExport, :count).by(1)
      end

      context 'with a nonsense export type' do
        let(:export_type) { 'foobar' }

        it 'responds with an error' do
          expect {
            subject
          }.to_not change(CsvExport, :count)
          expect(response.status).to eq(422)
        end
      end
    end

    context 'when not authenticated as a teacher' do
      it 'requires a logged-in teacher' do
        subject
        expect(response.status).to eq(401)
      end
    end
  end
end