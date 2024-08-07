# frozen_string_literal: true

require 'rails_helper'

describe CsvGenerator do
  subject { test_subclass.run(data, specified_columns:) }

  let(:object) { test_subclass.new(data, specified_columns:) }
  let(:rows) { CSV.parse(subject).map { |row| row.join(',') } }

  let(:test_subclass) do
    Class.new(described_class) do
      def ordered_columns
        {
          user: {
            csv_header: 'user',
            csv_tooltip: 'user tooltip',
            formatter: Formatter::DEFAULT
          },
          classroom: {
            csv_header: 'classroom',
            csv_tooltip: 'classroom tooltip',
            formatter: Formatter::DEFAULT
          }
        }
      end
    end
  end
  let(:specified_columns) { nil }

  let(:data) do
    [
      {
        user: 'user',
        classroom: 'classroom',
        grade: '9'
      }
    ]
  end
  let(:user_header) { object.ordered_columns[:user][:csv_header] }
  let(:classroom_header) { object.ordered_columns[:classroom][:csv_header] }
  let(:user_tooltip) { object.ordered_columns[:user][:csv_tooltip] }
  let(:classroom_tooltip) { object.ordered_columns[:classroom][:csv_tooltip] }

  it { expect(rows.first).to eq("#{user_header},#{classroom_header}") }
  it { expect(rows.second).to eq("#{user_tooltip},#{classroom_tooltip}") }
  it { expect(rows.third).to include(data.first[:user]) }
  it { expect(rows.third).to include(data.first[:classroom]) }

  context 'exclude entries in data that do not have columns defined in the subclass' do
    it { expect(rows.third).not_to include(data.first.fetch(:grade)) }
  end

  context 'specifying a sub-set of columns' do
    let(:specified_columns) { [:user] }

    it { expect(rows.first).to eq(user_header) }
    it { expect(rows.second).to eq(user_tooltip) }
    it { expect(rows.third).to include(data.first[:user]) }
    it { expect(rows.third).not_to include(data.first[:classroom]) }
  end

  context '#validate_input!' do
    context 'specified_columns includes column names not defined in the subclass' do
      let(:specified_columns) { [:grade] }

      it { expect { subject }.to raise_error(described_class::UnhandledColumnError) }
    end

    context 'data rows do not contain data for all specified columns' do
      let(:data) do
        [
          {
            classroom: 'classroom',
            grade: '9'
          }
        ]
      end

      it { expect { subject }.to raise_error(described_class::DataMissingRequestedColumnError) }
    end
  end

  context 'subclass without headers or tooltips defined for its columns' do
    let(:test_subclass) do
      Class.new(described_class) do
        def ordered_columns
          {
            user: {
              formatter: Formatter::DEFAULT
            },
            classroom: {
              formatter: Formatter::DEFAULT
            }
          }
        end
      end
    end

    it { expect(rows.first).to include(data.first[:user]) }
    it { expect(rows.first).to include(data.first[:classroom]) }
  end
end
