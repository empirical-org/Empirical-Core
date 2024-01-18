require 'rails_helper'

RSpec.describe Pdfs::AdminUsageSnapshotReportHelper, type: :helper do
  describe '#change_direction_class' do
    it 'returns "positive" for positive numbers' do
      expect(helper.change_direction_class(1)).to eq('positive')
    end

    it 'returns "negative" for negative numbers' do
      expect(helper.change_direction_class(-1)).to eq('negative')
    end

    it 'returns "no-change" for zero' do
      expect(helper.change_direction_class(0)).to eq('no-change')
    end

    it 'returns "no-change" for nil' do
      expect(helper.change_direction_class(nil)).to eq('no-change')
    end
  end

  describe '#change_icon_src' do
    let(:arrow_up_src) { "#{described_class::IMG_SRC_BASE}/arrow_up_icon.svg" }
    let(:arrow_down_src) { "#{described_class::IMG_SRC_BASE}/arrow_down_icon.svg" }

    it 'returns arrow up icon src for positive numbers' do
      expect(helper.change_icon_src(1)).to eq(arrow_up_src)
    end

    it 'returns arrow down icon src for negative numbers' do
      expect(helper.change_icon_src(-1)).to eq(arrow_down_src)
    end

    it 'returns nil for zero' do
      expect(helper.change_icon_src(0)).to be_nil
    end

    it 'returns nil for nil' do
      expect(helper.change_icon_src(nil)).to be_nil
    end
  end

  describe '#new_tab_src' do
    it 'returns new tab icon src' do
      new_tab_src = "#{described_class::ADMINISTRATOR_IMG_SRC_BASE}/new_tab.svg"
      expect(helper.new_tab_src).to eq(new_tab_src)
    end
  end

  describe '#section_icon_src' do
    it 'returns correct icon src based on section name' do
      expect(helper.section_icon_src(:classrooms)).to eq(described_class::ICONS_SRC[:teacher])
      # Add more tests for each mapping in ICONS_SRC_MAPPING
    end

    it 'returns nil for undefined section names' do
      expect(helper.section_icon_src(:undefined_section)).to be_nil
    end
  end
end
