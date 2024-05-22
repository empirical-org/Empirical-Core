require 'rails_helper'

module Pdfs
  RSpec.describe AdminUsageSnapshotReportHelper, type: :helper do
    describe '#change_direction_class' do
      it { expect(helper.change_direction_class(1)).to eq described_class::POSITIVE }
      it { expect(helper.change_direction_class(-1)).to eq described_class::NEGATIVE }
      it { expect(helper.change_direction_class(0)).to eq described_class::NO_CHANGE }
      it { expect(helper.change_direction_class(nil)).to eq described_class::NO_CHANGE }
    end

    describe '#change_icon_src' do
      it { expect(helper.change_icon_src(1)).to eq described_class::ICONS_SRC[:arrow_up] }
      it { expect(helper.change_icon_src(-1)).to eq described_class::ICONS_SRC[:arrow_down] }
      it { expect(helper.change_icon_src(0)).to be_nil }
      it { expect(helper.change_icon_src(nil)).to be_nil }
    end

    describe '#new_tab_src' do
      it { expect(helper.new_tab_src).to eq described_class::ICONS_SRC[:new_tab] }
    end

    describe '#section_icon_src' do
      it { expect(helper.section_icon_src(:classrooms)).to eq(described_class::ICONS_SRC[:teacher]) }
      it { expect(helper.section_icon_src(:highlights)).to eq(described_class::ICONS_SRC[:bulb]) }
      it { expect(helper.section_icon_src(:practice)).to eq(described_class::ICONS_SRC[:pencil]) }
      it { expect(helper.section_icon_src(:schools)).to eq(described_class::ICONS_SRC[:school]) }
      it { expect(helper.section_icon_src(:users)).to eq(described_class::ICONS_SRC[:students]) }

      it { expect(helper.section_icon_src(:undefined_section)).to be_nil }
    end
  end
end
