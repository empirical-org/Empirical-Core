# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(HTMLTagRemover, type: :module) do
    context '#run' do
      it 'should replace all expected characters (not just UTF codes)' do
        # Note that \u0301 and \u0308 don't render in Terminal.
        # I'd be tempted to remove it from our list of characters, but they're
        # explicitly used on the front-end, so I want to remain consistent
        all_target_characters = '´`‘’ʻˈ“”˝ˌ‚，…—–'
        conversion_target = "''''''\"\"\",,,...—–"
        expect(StringNormalizer.new(all_target_characters).run).to eq(conversion_target)
      end

      it 'should replace multiple instances of the same character' do
        left_single_smart_quote = "\u2018"
        expect(StringNormalizer.new(left_single_smart_quote * 3).run).to eq("'''")
      end

      it 'should normalize single quotes' do
        [
          accute_accent = "\u00B4",
          grave_accent = "\u0060",
          left_single_quotation_mark = "\u2018",
          right_single_quotation_mark = "\u2019",
          combining_accute_accent = "\u0301",
          modifier_letter_turned_comma = "\u02BB",
          modifier_letter_vertical_line = "\u02C8"
        ].each do |character|
          expect(StringNormalizer.new(character).run).to eq("'")
        end
      end

      it 'should normalize double quotes' do
        [
          left_double_quotation_mark = "\u201C",
          right_double_quotation_mark = "\u201D",
          double_acute_accent = "\u02DD",
          combining_diaeresis = "\u0308"
        ].each do |character|
          expect(StringNormalizer.new(character).run).to eq('"')
        end
      end

      it 'should normalize "commas"' do
        [
          modifier_letter_low_vertical_line = "\u02CC",
          single_low9_quotation_mark = "\u201A",
          fullwidth_comma = "\uFF0C"
        ].each do |character|
          expect(StringNormalizer.new(character).run).to eq(',')
        end
      end

      it 'should normalize the single elipsis character' do
        ellipsis = "\u2026"
        expect(StringNormalizer.new(ellipsis).run).to eq("...")
      end

      it 'should normalize utf-8 emdash to ASCII mdash' do
        emdash = "\u2014"
        # This may not be visible on your screen, but the value in the eq is an ANSI emdash
        expect(StringNormalizer.new(emdash).run).to eq("—")
      end

      it 'should normalize utf-8 endash to ASCII ndash' do
        endash = "\u2013"
        # This may not be visible on your screen, but the value in the eq is an ANSI endash
        expect(StringNormalizer.new(endash).run).to eq("–")
      end
    end
  end
end
