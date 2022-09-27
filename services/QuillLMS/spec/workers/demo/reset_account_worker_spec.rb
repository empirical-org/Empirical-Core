# frozen_string_literal: true

require 'rails_helper'

describe Demo::ResetAccountWorker, type: :worker do
  let(:worker) { described_class.new }
  let(:teacher) { create(:teacher) }

  describe "#perform" do
    context 'no teacher found' do
      it "should NOT call reset_account" do
        expect(Demo::ReportDemoCreator).to_not receive(:reset_account)

        worker.perform(1234)
      end
    end

    context 'teacher found' do
      it "should call reset_account" do
        expect(Demo::ReportDemoCreator).to receive(:reset_account).with(teacher).once

        worker.perform(teacher.id)
      end
    end
  end
end
