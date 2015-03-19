require 'rails_helper'

describe Teachers::ProgressReports::CsvExportsController, :type => :controller do
  include_context 'Activity Progress Report'

  describe 'POST #create' do
    let(:export_type) { 'activity_sessions' }
    let(:filters) { {} }
    subject { post :create, {csv_export: {export_type: export_type, filters: filters }}}

    context 'when authenticated as a teacher' do
      before do
        session[:user_id] = mr_kotter.id
      end

      let(:response_json) { JSON.parse(response.body)['csv_export'] }

      it 'creates a CSV export with the specified type' do
        expect {
          subject
        }.to change(CsvExport, :count).by(1)
        expect(response_json['export_type']).to eq(export_type)
        expect(response_json['filters']).to eq({})
        expect(response_json['teacher_id']).to eq(mr_kotter.id)
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