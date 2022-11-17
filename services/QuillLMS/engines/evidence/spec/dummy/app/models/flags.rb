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

end
