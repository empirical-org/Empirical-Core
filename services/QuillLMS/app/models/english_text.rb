# == Schema Information
#
# Table name: english_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class EnglishText < ApplicationRecord
  has_many :translated_texts
  has_many :translation_mappings

  STANDARD_COMMENT = "
  We are translating the instructions for an English-language grammar activity. The content of the activity itself is not translated. Therefore, please leave words that sound like they are part of the activity in the original english. Often they will between an HTML tag such as in <em>english word</em> or <ul>english  word</ul>.
"

  def self.translate!(jobs_list:)
    resp = GengoAPI.postTranslationJobs(jobs: create_payload(jobs_list:))
    jobs = GengoAPI.getTranslationJobs(order_id: resp["order_id"])
    puts jobs
  end

  private_class_method def self.create_payload(jobs_list:)
    jobs_list.reduce({}) do |hash, job|
      hash.merge({"#{job[:slug]}" => job })
    end
  end

  def gengo_payload(excluded_tags: [])
    {
      type: "text",
      body_src: clean_src(excluded_tags),
      lc_src: "en",
      lc_tgt: "es-la",
      tier: "standard",
      slug: id,
      group: true,
      comment: STANDARD_COMMENT
    }
  end

  private def clean_src(excluded_tags)
    clean = text
    excluded_tags.each do |tag|
      clean.gsub!(%r{<#{tag}>(.*?)</#{tag}>}, "<#{tag}>[[[\\1]]]</#{tag}>")
    end
    clean
  end
end
