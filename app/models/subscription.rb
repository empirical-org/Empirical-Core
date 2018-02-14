require 'newrelic_rpm'
require 'new_relic/agent'

class Subscription < ActiveRecord::Base
  has_many :user_subscriptions
  has_many :school_subscriptions
  has_many :credit_transactions, as: :source
  has_many :users, through: :user_subscriptions
  has_many :schools, through: :school_subscriptions
  belongs_to :contact_user, class_name: "User"
  belongs_to :subscription_type
  validates :expiration, presence: true
  validates :account_limit, presence: true
  after_commit :check_if_contact_email_is_in_database

  OFFICIAL_PAID_TYPES = ['School District Paid',
    'School NYC Paid',
    'School Strategic Paid',
    'School Paid',
    'Teacher Paid',
    'Purchase Missing School',
    'Premium Credit'
  ]

  OFFICIAL_FREE_TYPES = ['School NYC Free',
        'School Research',
        'School Sponsored Free',
        'School Strategic Free',
        'Teacher Contributor Free',
        'Teacher Sponsored Free',
        'Teacher Trial']

  SCHOOL_SUBSCRIPTIONS_TYPES = ['School District Paid',
        'School NYC Paid',
        'School Strategic Paid',
        'School Paid',
        'Purchase Missing School',
        'School NYC Free',
        'School Research',
        'School Sponsored Free',
        'School Strategic Free']

  # TODO: ultimately these should be clenaned up so we just have OFFICIAL_TYPES but until then, we keep them here
  GRANDFATHERED_PAID_TYPES = ['paid', 'school', 'premium', 'school', 'School']
  GRANDFATHERED_FREE_TYPES = ['trial']
  ALL_FREE_TYPES = GRANDFATHERED_FREE_TYPES.concat(OFFICIAL_FREE_TYPES)
  ALL_PAID_TYPES = GRANDFATHERED_PAID_TYPES.concat(OFFICIAL_PAID_TYPES)
  TRIAL_TYPES = ['Teacher Trial', 'trial']
  SCHOOL_RENEWAL_PRICE = 90000
  TEACHER_PRICE = 8000


  def is_not_paid?
    self.account_type && TRIAL_TYPES.include?(self.account_type.downcase == 'teacher trial')
  end

  def check_if_contact_email_is_in_database
    if self.contact_email && !self.contact_user_id
      contact_id = User.find_by_email(self.contact_email)&.id
      if contact_id
        self.update(contact_user_id: contact_id)
      end
    end
  end

  def renewal_price
    if self.schools.any?
      SCHOOL_RENEWAL_PRICE
    else
      TEACHER_PRICE
    end
  end

  def self.create_with_user_join user_id, attributes
    self.create_with_school_or_user_join user_id, 'User', attributes
  end

  def school_subscription?
    SchoolSubscription.where(subscription_id: self.id).limit(1).exists?
  end

  def self.account_types
    ALL_FREE_TYPES.concat(ALL_PAID_TYPES)
  end

  def renew_subscription
    # creates a new sub based off the old ones
    # dups last subscription
    new_sub = self.dup
    new_sub.expiration = self.expiration + 365
    new_sub.start_date = self.expiration
    new_sub.save!
  end

  def credit_user_and_de_activate
    if self.school_subscriptions.ids.any?
      # we should not do this if the sub belongs to a school
      report_to_new_relic("Sub credited and expired with school. Subscription: #{self.id}")
    elsif self.user_subscriptions.ids.count > 1
      report_to_new_relic("Sub credited and expired with multiple users. Subscription: #{self.id}")
    else
      self.update(de_activated_date: Date.today, recurring: false)
      # subtract later of start date or today's date from expiration date to calculate amount to credit
      # amount_to_credit = self.expiration - [self.start_date, Date.today].max
      amount_to_credit = self.expiration - self.start_date
      CreditTransaction.create(user_id: self.user_subscriptions.first.user_id, amount: amount_to_credit.to_i, source: self)
    end
  end


  def self.expired_today_or_previously_and_recurring
    Subscription.where('expiration <= ? AND recurring IS TRUE AND de_activated_date IS NULL', Date.today)
  end

  def self.school_or_user_has_ever_paid(school_or_user)
    # TODO: 'subscription type spot'
    paid_accounts = school_or_user.subscriptions.pluck(:account_type) & ALL_PAID_TYPES
    paid_accounts.any?
  end

  def self.new_teacher_premium_sub(user)
    expiration = school_or_user_has_ever_paid(user) ? (Date.today + 1.year) : promotional_dates[:expiration]
    self.new(expiration: expiration, start_date: Date.today, account_type: 'Teacher Paid', recurring: true, account_limit: 1000, contact_user_id: user.id)
  end

  def self.give_teacher_premium_if_charge_succeeds(user)
    teacher_premium_sub = new_teacher_premium_sub(user)
    teacher_premium_sub.save_if_charge_succeeds
    if !teacher_premium_sub.new_record?
      UserSubscription.create(user: user, subscription: teacher_premium_sub)
      teacher_premium_sub
    else
      false
    end
  end

  def update_if_charge_succeeds
    charge = charge_user
    if charge[:status] == 'succeeded'
      self.renew_subscription
    end
  end

  def save_if_charge_succeeds
    charge = charge_user_for_teacher_premium
    if charge[:status] == 'succeeded'
      self.payment_method = 'Credit Card'
      self.payment_amount = TEACHER_PRICE
      self.save!
      self
    else
      nil
    end
  end


  def self.update_todays_expired_recurring_subscriptions
    self.expired_today_or_previously_and_recurring.each do |s|
      s.update_if_charge_succeeds
    end
  end

  def self.promotional_dates
    # available to users who have never paid before
    # if today's month is before august, it expires end of July, else December
    exp_month = Date.today.month < 8 ? 7 : 12
    {expiration: Date::strptime("31-#{exp_month}-#{Date.today.year+1}","%d-%m-%Y"),
    start_date: Date.today}
  end

  protected



  def charge_user_for_teacher_premium
    if contact_user && contact_user.stripe_customer_id
      Stripe::Charge.create(amount: TEACHER_PRICE, currency: 'usd', customer: contact_user.stripe_customer_id)
    end
  end

  def charge_user
    if contact_user && contact_user.stripe_customer_id
      Stripe::Charge.create(amount: renewal_price, currency: 'usd', customer: contact_user.stripe_customer_id)
    end
  end

  def self.set_premium_expiration_and_start_date(school_or_user)
      if !Subscription.school_or_user_has_ever_paid(school_or_user)
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

  def self.set_trial_expiration_and_start_date
    {expiration: Date.today + 30, start_date: Date.today}
  end

  def report_to_new_relic(e)
    begin
      raise e
    rescue => e
      NewRelic::Agent.notice_error(e)
    end
  end

  def self.create_with_school_or_user_join school_or_user_id, type, attributes
    type.capitalize!
    # since we're constantizing the type, need to make sure it is capitalized if not already
    school_or_user = type.constantize.find school_or_user_id
    # get school or user object
    attributes[:account_limit] ||= 1000
    if !attributes[:expiration]
      # if there is no expiration, either give them a trial one or a premium one
      # TODO: 'subscription type spot'
      if attributes[:account_type]&.downcase == 'teacher trial'
        attributes = attributes.merge(Subscription.set_trial_expiration_and_start_date)
      else
        attributes = attributes.merge(Subscription.set_premium_expiration_and_start_date(school_or_user))
      end
    end
    subscription = Subscription.create!(attributes)
    if subscription.persisted?
      h = {}
      h["#{type.downcase}_id".to_sym] = school_or_user_id
      h[:subscription_id] = subscription.id
      "#{type}Subscription".constantize.create(h)
    end
    subscription
  end


end
