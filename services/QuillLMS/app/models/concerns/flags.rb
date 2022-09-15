# frozen_string_literal: true

module Flags
  extend ActiveSupport::Concern
  FLAGS = [
    PRODUCTION = 'production',
    ARCHIVED = 'archived',
    ALPHA = 'alpha',
    EVIDENCE_BETA1 = 'evidence_beta1',
    EVIDENCE_BETA2 = 'evidence_beta2',
    BETA = 'beta',
    GAMMA = 'gamma',
    COLLEGE_BOARD = 'college_board',
    PRIVATE = 'private'
  ]

  module ClassMethods
    def flag_all(flag)
      not_flagged(flag).update_all sanitize_sql(['flags = array_append(flags, ?)', flag])
    end
  end

  included do
    scope :flagged,     ->(flag) { where('?  = ANY (flags)', flag) }
    scope :not_flagged, ->(flag) { where('? != ALL (flags)', flag) }
    scope :not_archived, -> { not_flagged(:archived) }
  end

  def flag(flag_name)
    self.flags = (flags << flag_name).uniq
  end

  def unflag(flag_name)
    self.flags = (flags - [flag_name]).uniq
  end

  def flags
    self[:flags].map(&:intern)
  end

  def flag!(flag_name)
    flag(flag_name)
    save!
  end

  def unflag!(flag_name)
    unflag(flag_name)
    save!
  end

  def archive!
    flag!(:archived)
  end

  def unarchive!
    unflag!(:archived)
  end
end
