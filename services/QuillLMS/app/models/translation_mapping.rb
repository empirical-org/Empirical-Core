# == Schema Information
#
# Table name: translation_mappings
#
#  id              :bigint           not null, primary key
#  source_key      :string
#  source_type     :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#  source_id       :integer          not null
#
class TranslationMapping < ApplicationRecord
  belongs_to :english_text
  belongs_to :source, polymorphic: true
end
