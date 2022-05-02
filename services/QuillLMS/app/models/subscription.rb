# frozen_string_literal: true

# == Schema Information
#
# Table name: subscriptions
#
#  id                :integer          not null, primary key
#  account_type      :string
#  de_activated_date :date
#  expiration        :date
#  payment_amount    :integer
#  payment_method    :string
#  purchaser_email   :string
#  recurring         :boolean          default(FALSE)
#  start_date        :date
#  created_at        :datetime
#  updated_at        :datetime
#  plan_id           :integer
#  purchaser_id      :integer
#  stripe_invoice_id :string
#
# Indexes
#
#  index_subscriptions_on_de_activated_date  (de_activated_date)
#  index_subscriptions_on_purchaser_email    (purchaser_email)
#  index_subscriptions_on_purchaser_id       (purchaser_id)
#  index_subscriptions_on_recurring          (recurring)
#  index_subscriptions_on_start_date         (start_date)
#  index_subscriptions_on_stripe_invoice_id  (stripe_invoice_id) UNIQUE
#
require 'newrelic_rpm'
require 'new_relic/agent'

class Subscription < ApplicationRecord
  class RenewalNilStripeCustomer < StandardError; end

  has_many :user_subscriptions
  has_many :users, through: :user_subscriptions
  has_many :school_subscriptions
  has_many :credit_transactions, as: :source
  has_many :users, through: :user_subscriptions
  has_many :schools, through: :school_subscriptions
  belongs_to :purchaser, class_name: "User"
  belongs_to :subscription_type
  belongs_to :plan, optional: true
  validates :expiration, presence: true
  after_commit :check_if_purchaser_email_is_in_database
  after_initialize :set_null_start_date_to_today

  CB_LIFETIME_DURATION = 365 * 50 # In days, this is approximately 50 years

  CB_LIFETIME_SUBSCRIPTION_TYPE = 'College Board Educator Lifetime Premium'

  OFFICIAL_PAID_TYPES = ['School District Paid',
                         'School Paid',
                         'Teacher Paid',
                         'Premium Credit',
                         CB_LIFETIME_SUBSCRIPTION_TYPE]

  OFFICIAL_FREE_TYPES = ['School Sponsored Free',
                         'Teacher Sponsored Free',
                         'Teacher Trial']

  OFFICIAL_SCHOOL_TYPES = ['School District Paid',
                           'School Paid',
                           'School Sponsored Free']

  OFFICIAL_TEACHER_TYPES = ['Teacher Paid',
                            'Premium Credit',
                            'Teacher Sponsored Free',
                            'Teacher Trial',
                            CB_LIFETIME_SUBSCRIPTION_TYPE]

  ALL_OFFICIAL_TYPES = OFFICIAL_PAID_TYPES.dup.concat(OFFICIAL_FREE_TYPES)
  TRIAL_TYPES = ['Teacher Trial']
  SCHOOL_RENEWAL_PRICE = 90000

  TYPES_HASH = {
    trial: TRIAL_TYPES,
    teacher: OFFICIAL_TEACHER_TYPES,
    school: OFFICIAL_SCHOOL_TYPES
  }

  # 2/27 - for now every school is 90000 cents, whether they are renewing or re-signing up.
  SCHOOL_FIRST_PURCHASE_PRICE = SCHOOL_RENEWAL_PRICE
  TEACHER_PRICE = 8000
  ALL_PRICES = [TEACHER_PRICE, SCHOOL_RENEWAL_PRICE]
  PAYMENT_METHODS = [
    INVOICE_PAYMENT_METHOD = 'Invoice',
    CREDIT_CARD_PAYMENT_METHOD = 'Credit Card',
    PREMIUM_CREDIT_PAYMENT_METHOD = 'Premium Credit'
  ]

  ALL_TYPES = OFFICIAL_FREE_TYPES.dup.concat(OFFICIAL_PAID_TYPES)

  validates :stripe_invoice_id, allow_blank: true, stripe_uid: { prefix: :in }

  scope :active, -> { not_expired.where(de_activated_date: nil).order(expiration: :asc) }
  scope :expired, -> { where('expiration <= ?', Date.today) }
  scope :not_expired, -> { where('expiration > ?', Date.today) }

  def is_trial?
    account_type && TRIAL_TYPES.include?(account_type)
  end

  def expired?
    expiration <= Date.today
  end

  def check_if_purchaser_email_is_in_database
    return unless purchaser_email
    return if purchaser_id

    new_purchaser_id = User.find_by_email(purchaser_email)&.id
    return unless new_purchaser_id

    update(purchaser_id: new_purchaser_id)
  end

  def renewal_price
    if schools.any?
      SCHOOL_RENEWAL_PRICE
    else
      TEACHER_PRICE
    end
  end

  def self.create_with_user_join user_id, attributes
    create_with_school_or_user_join user_id, 'User', attributes
  end

  def school_subscription?
    SchoolSubscription.where(subscription_id: id).limit(1).exists?
  end

  def self.account_types
    ALL_TYPES
  end

  def credit_user_and_de_activate
    if school_subscriptions.ids.any?
      # we should not do this if the sub belongs to a school
      report_to_new_relic("Sub credited and expired with school. Subscription: #{id}")
    elsif user_subscriptions.ids.count > 1
      report_to_new_relic("Sub credited and expired with multiple users. Subscription: #{id}")
    else
      update(de_activated_date: Date.today, recurring: false)
      # subtract later of start date or today's date from expiration date to calculate amount to credit
      # amount_to_credit = self.expiration - [self.start_date, Date.today].max
      amount_to_credit = expiration - start_date
      CreditTransaction.create(user_id: user_subscriptions.first.user_id, amount: amount_to_credit.to_i, source: self)
    end
  end

  def self.expired_today_or_previously_and_recurring
    Subscription
      .where(stripe_invoice_id: nil, recurring: true, de_activated_date: nil)
      .expired
  end

  def self.expired_today_or_previously_and_not_recurring
    Subscription
      .where(recurring: false, de_activated_date: nil)
      .expired
  end

  def self.school_or_user_has_ever_paid?(school_or_user)
    # TODO: 'subscription type spot'
    paid_accounts = school_or_user.subscriptions.pluck(:account_type) & OFFICIAL_PAID_TYPES
    paid_accounts.any?
  end

  def self.new_school_premium_sub(school, user)
    expiration = school_or_user_has_ever_paid?(school) ? (Date.today + 1.year) : promotional_dates[:expiration]
    new(expiration: expiration, start_date: Date.today, account_type: 'School Paid', recurring: true, purchaser_id: user.id)
  end

  def self.give_school_premium_if_charge_succeeds(school, user)
    school_premium_sub = new_school_premium_sub(school, user)
    school_premium_sub.save_if_charge_succeeds('school', school)
    if school_premium_sub.new_record?
      false
    else
      SchoolSubscription.create(school: school, subscription: school_premium_sub)
      school_premium_sub
    end
  end

  def self.redemption_start_date(school_or_user)
    last_subscription = school_or_user.subscriptions.active.first
    if last_subscription.present?
      last_subscription.expiration
    else
      Date.today
    end
  end

  def self.default_expiration_date(school_or_user)
    last_subscription = school_or_user.subscriptions.active.first
    if last_subscription.present?
      redemption_start_date(school_or_user) + 1.year
    elsif school_or_user.instance_of?(School)
      promotional_dates[:expiration]
    else
      Date.today + 1.year
    end
  end

  def save_if_charge_succeeds(premium_type, school=nil)
    raise "an incorrect premium type #{premium_type} was passed" unless premium_type == 'school'

    charge = charge_user_for_school_premium(school)
    payment_amount = SCHOOL_RENEWAL_PRICE

    if charge[:status] == 'succeeded'
      self.payment_method = 'Credit Card'
      self.payment_amount = payment_amount
      save!
      self
    else
      nil
    end
  end

  def detach_district_admins
    schools.each do |school|
      school.detach_from_existing_district_admins(school.district)
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
      subscription.update(recurring: false, de_activated_date: Date.today)

      next unless subscription.users.count == 1
      next unless subscription.users.first.subscriptions.active.empty?

      subscription.renew_via_stripe
    end
  end

  def self.update_todays_expired_school_subscriptions
    expired_today_or_previously_and_not_recurring.where(account_type: OFFICIAL_SCHOOL_TYPES).each do |subscription|
      subscription.detach_district_admins
    end
  end

  def self.promotional_dates
    # available to users who have never paid before
    # if today's month is before july, it expires end of June, else December
    exp_month_and_day = Date.today.month < 7 ? "30-6" : "31-12"
    {expiration: Date::strptime("#{exp_month_and_day}-#{Date.today.year+1}","%d-%m-%Y"),
    start_date: Date.today}
  end

  protected def charge_user_for_school_premium(school)
    return unless purchaser&.stripe_customer?

    Stripe::Charge.create(amount: SCHOOL_FIRST_PURCHASE_PRICE, currency: 'usd', customer: purchaser.stripe_customer_id)
  end

  def self.set_premium_expiration_and_start_date(school_or_user)
    if !Subscription.school_or_user_has_ever_paid?(school_or_user) && school_or_user.instance_of?(School)
      # We end their trial if they have one
      school_or_user.subscription&.update(de_activated_date: Date.today)
      # Then they get the promotional subscription
      promotional_dates
    elsif school_or_user.subscription
      # Expire one year later, start at end of sub
      old_sub = school_or_user.subscription
      {expiration: old_sub.expiration + 1.year, start_date: old_sub.expiration}
    else
      # sub lasts one year from Date.today
      {expiration: Date.today + 1.year, start_date: Date.today}
    end
  end

  def self.set_trial_expiration_and_start_date(user=nil)
    expiration = Date.today + 30
    start_date = Date.today
    existing_sub = user&.subscription
    if existing_sub&.expiration && existing_sub.expiration > Date.today
      start_date = existing_sub.expiration + 1
      expiration = start_date + 30
    end
    {expiration: expiration, start_date: start_date}
  end

  def self.set_cb_lifetime_expiration_and_start_date
    {expiration: Date.today + CB_LIFETIME_DURATION, start_date: Date.today}
  end

  protected def report_to_new_relic(error)
    begin
      raise error
    rescue => e
      NewRelic::Agent.notice_error(e)
    end
  end

  protected def set_null_start_date_to_today
    return if start_date

    self.start_date = Date.today
  end

  def self.create_with_school_or_user_join(school_or_user_id, type, attributes)
    type = type.capitalize
    # since we're constantizing the type, need to make sure it is capitalized if not already
    school_or_user = type.constantize.find school_or_user_id
    # get school or user object
    if !attributes[:expiration]
      # if there is no expiration, either give them a trial one or a premium one
      # TODO: 'subscription type spot'
      if attributes[:account_type]&.downcase == 'teacher trial'
        attributes = attributes.merge(Subscription.set_trial_expiration_and_start_date(school_or_user))
      elsif attributes[:account_type] == CB_LIFETIME_SUBSCRIPTION_TYPE
        attributes = attributes.merge(Subscription.set_cb_lifetime_expiration_and_start_date)
      else
        attributes = attributes.merge(Subscription.set_premium_expiration_and_start_date(school_or_user))
      end
    end

    school_or_user.subscriptions.each {|s| s.update!(recurring: false)}
    subscription = Subscription.create!(attributes)

    h = {}
    h["#{type.downcase}_id".to_sym] = school_or_user_id
    h[:subscription_id] = subscription.id
    "#{type}Subscription".constantize.create(h)

    subscription
  end

  def subscription_status
    attributes.merge(
      'account_type' => account_type || plan&.name,
      'customer_email' => purchaser&.email,
      'expired' => expired?,
      'last_four' => last_four,
      'purchaser_name' => purchaser&.name,
      'stripe_customer_id' => purchaser&.stripe_customer_id,
      'stripe_subscription_id' => stripe_subscription_id
    )
  end

  def last_four
    StripeIntegration::Subscription.new(self).last_four
  end

  private def stripe_subscription_id
    StripeIntegration::Subscription.new(self).stripe_subscription_id
  end
end
