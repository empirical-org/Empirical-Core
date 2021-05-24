# == Schema Information
#
# Table name: activity_classifications
#
#  id                :integer          not null, primary key
#  app_name          :string
#  form_url          :string
#  instructor_mode   :boolean          default(FALSE)
#  key               :string           not null
#  locked_by_default :boolean          default(FALSE)
#  module_url        :string
#  name              :string
#  order_number      :integer          default(999999999)
#  scored            :boolean          default(TRUE)
#  uid               :string           not null
#  created_at        :datetime
#  updated_at        :datetime
#
# Indexes
#
#  index_activity_classifications_on_uid  (uid) UNIQUE
#
class ActivityClassification < ActiveRecord::Base

  include Uid

  has_many :activities, dependent: :destroy
  has_many :concept_results

  validates :key, presence: true

  DIAGNOSTIC_KEY = 'diagnostic'
  PROOFREADER_KEY = 'passage'
  LESSONS_KEY = 'lessons'
  COMPREHENSION_KEY = 'comprehension'
  CONNECT_KEY = 'connect'
  GRAMMAR_KEY = 'sentence'

  def self.diagnostic
    find_by_key DIAGNOSTIC_KEY
  end

  def self.comprehension
    find_by_key COMPREHENSION_KEY
  end

  def self.lessons
    find_by_key LESSONS_KEY
  end

  def self.proofreader
    find_by_key PROOFREADER_KEY
  end

  def self.grammar
    find_by_key GRAMMAR_KEY
  end

  def self.connect
    find_by_key CONNECT_KEY
  end

  def form_url
    url_domain_replacer(form_uri)
  end

  def module_url
    url_domain_replacer(module_uri)
  end

  private def url_domain_replacer(uri)
    "#{ENV['DEFAULT_URL']}#{uri_path(uri)}"
  end

  private def form_uri
    Addressable::URI.parse(read_attribute(:form_url))
  end

  private def module_uri
    Addressable::URI.parse(read_attribute(:module_url))
  end

  private def uri_path(uri)
    "#{uri.path}#{'?' + uri.query if uri.query}#{'#' + uri.fragment if uri.fragment}"
  end
end
