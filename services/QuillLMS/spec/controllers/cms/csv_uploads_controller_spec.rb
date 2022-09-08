# frozen_string_literal: true

require 'rails_helper'

describe Cms::CsvUploadsController do
  before { allow(controller).to receive(:current_user) { create(:staff) } }

  describe '#create' do
    let(:filename) {'test.csv'}
    let(:mock_uploader) { double(filename: filename) }
    let(:file) { fixture_file_upload(filename) }

    it 'should store a file and return the filename' do
      expect(StaffCSVUploader).to receive(:new).and_return(mock_uploader)
      expect(mock_uploader).to receive(:store!)

      post :create, params: {file: file}

      json = JSON.parse(response.body)

      expect(json).to eq({"filename" => filename})
    end
  end
end
