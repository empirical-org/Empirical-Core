# frozen_string_literal: true

require 'rails_helper'

RSpec.describe(ApplicationRecord, :type => :model) do
  describe '#save_with_error_handling' do
    context 'no exception' do
      let!(:a_school) { build(:school) }

      it { expect(a_school.save_with_error_handling).to be true }

      it 'should append no model errors' do
        a_school.save_with_error_handling
        expect(a_school.errors).to be_empty
      end
    end

    context 'ActiveRecord::RecordNotUnique exception' do
      let!(:a_school) { create(:school, nces_id: '123') }
      let!(:school_with_duplicate_nces_id) { build(:school, nces_id: '123') }

      it 'should rescue the exception' do
        expect do
          school_with_duplicate_nces_id.save_with_error_handling
        end.to_not raise_error
      end

      it 'should append the correct error to model.errors' do
        school_with_duplicate_nces_id.save_with_error_handling
        error = school_with_duplicate_nces_id.errors.first
        expect(error).to be_present
        expect(error.attribute).to eq :nces_id
      end

      it { expect(school_with_duplicate_nces_id.save_with_error_handling).to be false }
    end
  end
end
