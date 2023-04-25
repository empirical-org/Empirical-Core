# frozen_string_literal: true

require 'stringio'

module QuillBigQuery
  JSON_CREDENTIAL_IOSTREAM = StringIO.new(ENV.fetch('BIGQUERY_CREDENTIALS', ''))
end
