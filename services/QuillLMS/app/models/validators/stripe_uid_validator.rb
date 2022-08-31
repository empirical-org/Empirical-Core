# frozen_string_literal: true

class StripeUidValidator < ActiveModel::EachValidator
  VALID_PREFIXES = [
    CARD = 'card',
    CS = 'cs',
    CUS = 'cus',
    DU = 'du',
    EVT = 'evt',
    IN = 'in',
    PLAN = 'plan',
    PM = 'pm',
    PRICE = 'price',
    PROD = 'prod',
    SETI = 'seti',
    SI = 'si',
    SUB = 'sub'
  ].freeze

  PREFIX_TRANSLATION = {
    CARD => 'Card',
    CS => 'Checkout Session',
    CUS => 'Customer',
    DU => 'Dispute',
    EVT => 'Event',
    IN => 'Invoice',
    PLAN => 'Plan',
    PM => 'Payment Method',
    PRICE => 'Price',
    PROD => 'Product',
    SETI => 'Setup Intent',
    SI => 'Subscription Item',
    SUB => 'Subscription',
  }.freeze

  def check_validity!
    raise ArgumentError, 'Requires :prefix' unless options.include?(:prefix)
    raise ArgumentError, 'Invalid :prefix supplied' unless VALID_PREFIXES.include?(options[:prefix].to_s)
  end

  def validate_each(record, attribute, value)
    return if regex(options[:prefix]).match?(value)

    record.errors[attribute] << "is not a valid Stripe #{PREFIX_TRANSLATION[options[:prefix]]}"
  end

  private def regex(prefix)
    /\A#{prefix}_[A-Za-z0-9]{8,}\z/
  end
end
