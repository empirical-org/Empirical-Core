# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe PremiumDataCsvGenerator do
    subject { described_class.run(data, specified_columns:) }
    let(:rows) { subject.split("\n") }

    let(:specified_columns) { data.first.keys }
    let(:data) do
      [
        {
          student_name: student_name1
        },
        {
          student_name: student_name2
        }
      ]
    end

    let(:student_name1) { 'First Student' }
    let(:student_name2) { 'Second Student' }

    it { expect(rows.first).to eq('Student Name') }
    it { expect(rows.second).to eq(student_name1) }
    it { expect(rows.third).to eq(student_name2) }
  end
end
