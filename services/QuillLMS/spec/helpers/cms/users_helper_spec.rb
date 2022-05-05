# frozen_string_literal: true

require 'rails_helper'

describe Cms::UsersHelper do
  describe '#format_date' do
    it 'should return the correct format' do
      expect(format_date(nil)).to eq "--"
      expect(format_date(Date.current)).to eq Date.current.strftime("%b %d, %Y")
    end
  end

  describe '#completed_by' do
    let(:user) { double(:user, name: "name") }

    it 'should give the correct values' do
      expect(completed_by(nil)).to eq "--"
      expect(completed_by(user)).to eq "name"
    end
  end

  describe '#action_column' do
    context 'when stage is completed' do
      let(:stage) { double(:stage, completed_at: "completed") }

      it 'should return completed' do
        expect(action_column(stage)).to eq "Completed"
      end

    end

    context 'when stage has user trigger' do
      let(:stage) { double(:stage, completed_at: nil, trigger: "user") }

      before do
        allow(helper).to receive(:complete_sales_stage_link) { "link" }
      end

      it 'should return the complete stage sales link' do
        expect(helper.action_column(stage)).to eq "link"
      end
    end

    context 'when stage does not have user trigger' do
      let(:stage) { double(:stage, completed_at: nil, trigger: "not user") }

      it 'should give the titlized trigger' do
        expect(action_column(stage)).to eq "Not User"
      end
    end
  end
end
