# frozen_string_literal: true

# This concern is intended to describe the many different tables that we use
# to normalize different types of text.  Basically these tables all do the
# same thing, but we wanted to keep the various concerns separated.
module IsResponseNormalizedText
  extend ActiveSupport::Concern

  included do
  end
end

