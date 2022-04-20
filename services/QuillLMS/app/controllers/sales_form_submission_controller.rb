# frozen_string_literal: true

class SalesFormSubmissionController < ApplicationController
  RENEWAL_REQUEST = 'renewal request'
  QUOTE_REQUEST = 'quote request'

  def request_renewal
    @type = RENEWAL_REQUEST
  end

  def request_quote
    @type = QUOTE_REQUEST
  end
end
