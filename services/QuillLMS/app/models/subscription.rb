# frozen_string_literal: true

# == Schema Information
#
# Table name: subscriptions
#
#  id                    :integer          not null, primary key
#  account_type          :string
#  de_activated_date     :date
#  expiration            :date
#  payment_amount        :integer
#  payment_method        :string
#  purchase_order_number :string
#  purchaser_email       :string
#  recurring             :boolean          default(FALSE)
#  start_date            :date
#  created_at            :datetime
#  updated_at            :datetime
#  plan_id               :integer
#  purchaser_id          :integer
#  stripe_invoice_id     :string
#
# Indexes
#
#  index_subscriptions_on_de_activated_date  (de_activated_date)
#  index_subscriptions_on_purchaser_email    (purchaser_email)
#  index_subscriptions_on_purchaser_id       (purchaser_id)
#  index_subscriptions_on_recurring          (recurring)
#  index_subscriptions_on_start_date         (start_date)
#
require 'newrelic_rpm'
require 'new_relic/agent'

class Subscription < ApplicationRecord
  class RenewalNilStripeCustomer < StandardError; end

  has_many :credit_transactions, as: :source
  has_many :district_subscriptions
  has_many :districts, through: :district_subscriptions
  has_many :school_subscriptions
  has_many :schools, through: :school_subscriptions
  has_many :user_subscriptions
  has_many :users, through: :user_subscriptions
  belongs_to :purchaser, class_name: "User"
  belongs_to :plan, optional: true

  validates :expiration, presence: true

  after_commit :check_if_purchaser_email_is_in_database
  after_initialize :set_null_start_date_to_today

  CB_LIFETIME_DURATION = 365 * 50 # In days, this is approximately 50 years

  CB_LIFETIME_SUBSCRIPTION_TYPE = 'College Board Educator Lifetime Premium'
  PREMIUM_CREDIT = 'Premium Credit'
  SCHOOL_DISTRICT_PAID = 'School District Paid'
  SCHOOL_PAID = 'School Paid'
  SCHOOL_SPONSORED_FREE = 'School Sponsored Free'
  TEACHER_PAID = 'Teacher Paid'
  TEACHER_SPONSORED_FREE = 'Teacher Sponsored Free'
  TEACHER_TRIAL = 'Teacher Trial'

  OFFICIAL_PAID_TYPES = [
    SCHOOL_DISTRICT_PAID,
    SCHOOL_PAID,
    TEACHER_PAID,
    PREMIUM_CREDIT,
    CB_LIFETIME_SUBSCRIPTION_TYPE
  ].freeze

  OFFICIAL_FREE_TYPES = [
    SCHOOL_SPONSORED_FREE,
    TEACHER_SPONSORED_FREE,
    TEACHER_TRIAL
  ].freeze

  OFFICIAL_SCHOOL_TYPES = [
    SCHOOL_PAID,
    SCHOOL_SPONSORED_FREE
  ].freeze

  OFFICIAL_DISTRICT_TYPES = [
    SCHOOL_DISTRICT_PAID
  ].freeze

  OFFICIAL_TEACHER_TYPES = [
    TEACHER_PAID,
    PREMIUM_CREDIT,
    TEACHER_SPONSORED_FREE,
    TEACHER_TRIAL,
    CB_LIFETIME_SUBSCRIPTION_TYPE
  ].freeze

  ALL_OFFICIAL_TYPES = OFFICIAL_PAID_TYPES + OFFICIAL_FREE_TYPES
  TRIAL_TYPES = [TEACHER_TRIAL]

  TYPES_HASH = {
    trial: TRIAL_TYPES,
    teacher: OFFICIAL_TEACHER_TYPES,
    school: OFFICIAL_SCHOOL_TYPES
  }

  PAYMENT_METHODS = [
    INVOICE_PAYMENT_METHOD = 'Invoice',
    CREDIT_CARD_PAYMENT_METHOD = 'Credit Card',
    PREMIUM_CREDIT_PAYMENT_METHOD = 'Premium Credit'
  ].freeze

  CMS_PAYMENT_METHODS = [
    INVOICE_PAYMENT_METHOD,
    PREMIUM_CREDIT_PAYMENT_METHOD
  ].freeze

  ALL_TYPES = OFFICIAL_FREE_TYPES.dup.concat(OFFICIAL_PAID_TYPES).freeze

  delegate :stripe_cancel_at_period_end, :stripe_subscription_id, :stripe_subscription_url,
    to: :stripe_subscription

  scope :active, -> { not_expired.not_de_activated.order(expiration: :asc) }
  scope :expired, -> { where('expiration <= ?', Date.current) }
  scope :not_expired, -> { where('expiration > ?', Date.current) }
  scope :not_de_activated, -> { where(de_activated_date: nil) }
  scope :recurring, -> { where(recurring: true) }
  scope :not_recurring, -> { where(recurring: false) }
  scope :not_stripe, -> { where(stripe_invoice_id: nil) }
  scope :started, -> { where("start_date <= ?", Date.current) }
  scope :paid_with_card, -> { where.not(stripe_invoice_id: nil).or(where(payment_method: 'Credit Card')) }
  scope :for_schools, -> { where(account_type: OFFICIAL_SCHOOL_TYPES) }
  scope :for_teachers, -> { where(account_type: OFFICIAL_TEACHER_TYPES) }
  scope :expiring, ->(date) { where(expiration: date) }

  def self.create_and_attach_subscriber(subscription_attrs, subscriber)
    if !subscription_attrs[:expiration]
      case subscription_attrs[:account_type]
      when TEACHER_TRIAL
        subscription_attrs = subscription_attrs.merge(set_trial_expiration_and_start_date(subscriber))
      when CB_LIFETIME_SUBSCRIPTION_TYPE
        subscription_attrs = subscription_attrs.merge(set_cb_lifetime_expiration_and_start_date)
      else
        subscription_attrs = subscription_attrs.merge(set_premium_expiration_and_start_date(subscriber))
      end
    end

    ActiveRecord::Base.transaction(requires_new: true) do
      subscriber.subscriptions.each do |existing_subscription|
        existing_subscription.update!(recurring: false)
        existing_subscription.stripe_cancel_at_period_end
      end

      subscription = Subscription.create!(subscription_attrs)
      subscriber.attach_subscription(subscription)
      subscription
    end
  end

  def premium_types
    return OFFICIAL_DISTRICT_TYPES if district_subscriptions.exists?
    return OFFICIAL_SCHOOL_TYPES if school_subscriptions.exists?
    return OFFICIAL_TEACHER_TYPES if user_subscriptions.exists?

    []
  end

  def is_trial?
    account_type && TRIAL_TYPES.include?(account_type)
  end

  def expired?
    expiration <= Date.current
  end

  def check_if_purchaser_email_is_in_database
    return unless purchaser_email
    return if purchaser_id

    new_purchaser_id = User.find_by_email(purchaser_email)&.id
    return unless new_purchaser_id

    update(purchaser_id: new_purchaser_id)
  end

  def school_subscription?
    SchoolSubscription.exists?(subscription_id: id)
  end

  def self.account_types
    ALL_TYPES
  end

  def credit_user_and_de_activate
    return if district_subscriptions.ids.any? || school_subscriptions.ids.any? || user_subscriptions.ids.count > 1

    update(de_activated_date: Date.current, recurring: false)
    stripe_cancel_at_period_end
    amount_to_credit = expiration - start_date
    CreditTransaction.create(user_id: user_subscriptions.first.user_id, amount: amount_to_credit.to_i, source: self)
  end

  def self.expired_today_or_previously_and_recurring
    Subscription
      .expired
      .not_de_activated
      .not_stripe
      .recurring
  end

  def self.redemption_start_date(subscriber)
    subscriber&.subscriptions&.active&.first&.expiration || Date.current
  end

  def self.default_expiration_date(subscriber)
    last_subscription = subscriber.subscriptions.active.first
    if last_subscription.present?
      redemption_start_date(subscriber) + 1.year
    elsif subscriber.promotional_dates?
      promotional_dates[:expiration]
    else
      Date.current + 1.year
    end
  end

  def renew_via_stripe
    raise RenewalNilStripeCustomer unless purchaser&.stripe_customer?

    Stripe::Subscription.create(
      customer: purchaser.stripe_customer_id,
      items: [
        price: Plan.stripe_teacher_plan.stripe_price_id
      ]
    )
  rescue Stripe::InvalidRequestError, RenewalNilStripeCustomer => e
    ErrorNotifier.report(e, subscription_id: id)
  end

  def self.update_todays_expired_recurring_subscriptions
    expired_today_or_previously_and_recurring.each do |subscription|
      subscription.update(recurring: false, de_activated_date: Date.current)

      next unless subscription.users.count == 1
      next unless subscription.users.first.subscriptions.active.empty?

      subscription.renew_via_stripe
    end
  end

  def self.promotional_dates
    today = Date.current
    exp_month_and_day = today.month < 7 ? "30-6" : "31-12"

    { start_date: today, expiration: Date::strptime("#{exp_month_and_day}-#{today.year + 1}","%d-%m-%Y") }
  end

  def self.set_premium_expiration_and_start_date(subscriber)
    today = Date.current

    if !subscriber.ever_paid_for_subscription? && subscriber.promotional_dates?
      # We end their trial if they have one
      subscriber.subscription&.update(de_activated_date: today)
      promotional_dates
    elsif subscriber.subscription
      old_sub = subscriber.subscription
      { expiration: old_sub.expiration + 1.year, start_date: old_sub.expiration }
    else
      { expiration: today + 1.year, start_date: today }
    end
  end

  def self.set_trial_expiration_and_start_date(user=nil)
    start_date = Date.current
    expiration = start_date + 30
    existing_sub = user&.subscription
    if existing_sub&.expiration && existing_sub.expiration > start_date
      start_date = existing_sub.expiration + 1
      expiration = start_date + 30
    end
    {expiration: expiration, start_date: start_date}
  end

  def self.set_cb_lifetime_expiration_and_start_date
    today = Date.current
    { expiration: today + CB_LIFETIME_DURATION, start_date: today }
  end

  protected def set_null_start_date_to_today
    return if start_date

    self.start_date = Date.current
  end

  def last_four
    stripe_subscription&.last_four || purchaser&.last_four
  end

  def subscription_status
    attributes.merge(
      'account_type' => account_type || plan&.name,
      'customer_email' => purchaser&.email,
      'expired' => expired?,
      'last_four' => last_four,
      'purchaser_name' => purchaser&.name,
      'renewal_stripe_price_id' => renewal_stripe_price_id,
      'renewal_price' => plan && PlanSerializer.new(plan).price_in_dollars,
      'school_ids' =>  schools.pluck(:id),
      'stripe_customer_id' => purchaser&.stripe_customer_id,
      'stripe_subscription_id' => stripe_subscription_id
    )
  end

  def stripe_subscription
    StripeIntegration::Subscription.new(self)
  end

  def stripe_invoice
    @stripe_invoice ||= Stripe::Invoice.retrieve(stripe_invoice_id)
  end

  def populate_data_from_stripe_invoice
    return unless stripe?

    self.payment_amount = stripe_invoice.total unless payment_amount
    self.purchaser_email = stripe_invoice.customer_email unless purchaser_email
  end

  def renewal_stripe_price_id
    return STRIPE_TEACHER_PLAN_PRICE_ID if [TEACHER_PAID, TEACHER_TRIAL].include?(account_type)
    # TODO: can get cleaned up when we unify account types vs plan names, this covers the existing bases
    return STRIPE_SCHOOL_PLAN_PRICE_ID if account_type == SCHOOL_PAID
    return STRIPE_SCHOOL_PLAN_PRICE_ID if account_type == Plan::STRIPE_SCHOOL_PLAN
  end

  def stripe?
    stripe_invoice_id.present?
  end
end
