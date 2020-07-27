require 'newrelic_rpm'
require 'new_relic/agent'

class Subscription < ActiveRecord::Base
  has_many :user_subscriptions
  has_many :users, through: :user_subscriptions
  has_many :school_subscriptions
  has_many :credit_transactions, as: :source
  has_many :users, through: :user_subscriptions
  has_many :schools, through: :school_subscriptions
  belongs_to :purchaser, class_name: "User"
  belongs_to :subscription_type
  validates :expiration, presence: true
  after_commit :check_if_purchaser_email_is_in_database
  after_initialize :set_null_start_date_to_today

  COVID_19_EXPIRATION = Date.parse('2020-07-31')
  CB_LIFETIME_DURATION = 365 * 50 # In days, this is approximately 50 years

  COVID_19_SUBSCRIPTION_TYPE = 'Quill Premium for School Closures'
  COVID_19_SCHOOL_SUBSCRIPTION_TYPE = 'Quill School Premium for School Closures'
  CB_LIFETIME_SUBSCRIPTION_TYPE = 'College Board Educator Lifetime Premium'

  OFFICIAL_PAID_TYPES = ['School District Paid',
                         'School NYC Paid',
                         'School Strategic Paid',
                         'School Paid',
                         'Teacher Paid',
                         'Purchase Missing School',
                         'Premium Credit']

  OFFICIAL_FREE_TYPES = ['School NYC Free',
                         'School Research',
                         'School Sponsored Free',
                         'School Strategic Free',
                         'Teacher Contributor Free',
                         'Teacher Sponsored Free',
                         'Teacher Trial',
                         COVID_19_SUBSCRIPTION_TYPE,
                         COVID_19_SCHOOL_SUBSCRIPTION_TYPE]

  OFFICIAL_SCHOOL_TYPES = ['School District Paid',
                           'School NYC Paid',
                           'School Strategic Paid',
                           'School Paid',
                           'Purchase Missing School',
                           'School NYC Free',
                           'School Research',
                           'School Sponsored Free',
                           'School Strategic Free',
                           COVID_19_SCHOOL_SUBSCRIPTION_TYPE]

  OFFICIAL_TEACHER_TYPES = ['Teacher Paid',
                            'Premium Credit',
                            'Teacher Contributor Free',
                            'Teacher Sponsored Free',
                            'Teacher Trial',
                            COVID_19_SUBSCRIPTION_TYPE,
                            CB_LIFETIME_SUBSCRIPTION_TYPE]

  # TODO: ultimately these should be cleaned up so we just have OFFICIAL_TYPES but until then, we keep them here
  GRANDFATHERED_PAID_TYPES = ['paid', 'school', 'premium', 'school', 'School']
  GRANDFATHERED_FREE_TYPES = ['trial']
  ALL_FREE_TYPES = GRANDFATHERED_FREE_TYPES.dup.concat(OFFICIAL_FREE_TYPES)
  ALL_PAID_TYPES = GRANDFATHERED_PAID_TYPES.dup.concat(OFFICIAL_PAID_TYPES)
  ALL_OFFICIAL_TYPES = OFFICIAL_PAID_TYPES.dup.concat(OFFICIAL_FREE_TYPES)
  TRIAL_TYPES = ['Teacher Trial', 'trial']
  COVID_TYPES = [COVID_19_SCHOOL_SUBSCRIPTION_TYPE, COVID_19_SUBSCRIPTION_TYPE]
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
  PAYMENT_METHODS = ['Invoice', 'Credit Card', 'Premium Credit']
  ALL_TYPES = ALL_FREE_TYPES.dup.concat(ALL_PAID_TYPES)


  def is_trial?
    account_type && (TRIAL_TYPES | COVID_TYPES).include?(account_type)
  end

  def check_if_purchaser_email_is_in_database
    if purchaser_email && !purchaser_id
      purchaser_id = User.find_by_email(purchaser_email)&.id
      if purchaser_id
        update(purchaser_id: purchaser_id)
      end
    end
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

  def renew_subscription
    # creates a new sub based off the old ones
    # dups last subscription, other than the dates
    new_sub = dup
    new_sub.expiration = expiration + 365
    new_sub.start_date = expiration
    new_sub.de_activated_date = nil
    new_sub.save!
    update(de_activated_date: Date.today)
    new_sub.users.push(users)
    new_sub.schools.push(schools)
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
    Subscription.where('expiration <= ? AND recurring IS TRUE AND de_activated_date IS NULL', Date.today)
  end

  def self.school_or_user_has_ever_paid?(school_or_user)
    # TODO: 'subscription type spot'
    paid_accounts = school_or_user.subscriptions.pluck(:account_type) & ALL_PAID_TYPES
    paid_accounts.any?
  end

  def self.new_teacher_premium_sub(user)
    expiration = school_or_user_has_ever_paid?(user) ? (Date.today + 1.year) : promotional_dates[:expiration]
    new(expiration: expiration, start_date: Date.today, account_type: 'Teacher Paid', recurring: true, purchaser_id: user.id)
  end

  def self.new_school_premium_sub(school, user)
    expiration = school_or_user_has_ever_paid?(school) ? (Date.today + 1.year) : promotional_dates[:expiration]
    new(expiration: expiration, start_date: Date.today, account_type: 'School Paid', recurring: true, purchaser_id: user.id)
  end

  def self.give_teacher_premium_if_charge_succeeds(user)
    teacher_premium_sub = new_teacher_premium_sub(user)
    teacher_premium_sub.save_if_charge_succeeds('teacher')
    if !teacher_premium_sub.new_record?
      UserSubscription.create(user: user, subscription: teacher_premium_sub)
      teacher_premium_sub
    else
      false
    end
  end

  def self.give_school_premium_if_charge_succeeds(school, user)
    school_premium_sub = new_school_premium_sub(school, user)
    school_premium_sub.save_if_charge_succeeds('school', school)
    if !school_premium_sub.new_record?
      SchoolSubscription.create(school: school, subscription: school_premium_sub)
      school_premium_sub
    else
      false
    end
  end

  def update_if_charge_succeeds
    charge = charge_user
    if charge[:status] == 'succeeded'
      renew_subscription
    end
  end

  def save_if_charge_succeeds(premium_type, school=nil)
    if premium_type === 'teacher'
      charge = charge_user_for_teacher_premium
      payment_amount = TEACHER_PRICE
    elsif premium_type === 'school'
      charge = charge_user_for_school_premium(school)
      payment_amount = SCHOOL_RENEWAL_PRICE
    else
      raise "an incorrect premium type #{premium_type} was passed"
    end
    if charge[:status] == 'succeeded'
      self.payment_method = 'Credit Card'
      self.payment_amount = payment_amount
      save!
      self
    else
      nil
    end
  end


  def self.update_todays_expired_recurring_subscriptions
    expired_today_or_previously_and_recurring.each do |s|
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

  def covid19?
    account_type == COVID_19_SUBSCRIPTION_TYPE
  end

  protected

  def charge_user_for_teacher_premium
    if purchaser && purchaser.stripe_customer_id
      Stripe::Charge.create(amount: TEACHER_PRICE, currency: 'usd', customer: purchaser.stripe_customer_id)
    end
  end

  def charge_user_for_school_premium(school)
    if purchaser && purchaser.stripe_customer_id
      Stripe::Charge.create(amount: SCHOOL_FIRST_PURCHASE_PRICE, currency: 'usd', customer: purchaser.stripe_customer_id)
    end
  end

  def charge_user
    if purchaser && purchaser.stripe_customer_id
      begin
        Stripe::Charge.create(amount: renewal_price, currency: 'usd', customer: purchaser.stripe_customer_id)
      rescue Stripe::CardError
        UserMailer.declined_renewal_email(purchaser).deliver_now! if purchaser.email
      end
    end
  end

  def self.set_premium_expiration_and_start_date(school_or_user)
      if !Subscription.school_or_user_has_ever_paid?(school_or_user)
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

  def self.set_covid_expiration_and_start_date
    {expiration: COVID_19_EXPIRATION, start_date: Date.today}
  end

  def self.set_cb_lifetime_expiration_and_start_date
    {expiration: Date.today + CB_LIFETIME_DURATION, start_date: Date.today}
  end

  def report_to_new_relic(error)
    begin
      raise error
    rescue => e
      NewRelic::Agent.notice_error(e)
    end
  end

  def set_null_start_date_to_today
    if !start_date
      self.start_date = Date.today
    end
  end

  def self.create_with_school_or_user_join school_or_user_id, type, attributes
    type.capitalize!
    # since we're constantizing the type, need to make sure it is capitalized if not already
    school_or_user = type.constantize.find school_or_user_id
    # get school or user object
    if !attributes[:expiration]
      # if there is no expiration, either give them a trial one or a premium one
      # TODO: 'subscription type spot'
      if attributes[:account_type]&.downcase == 'teacher trial'
        PremiumAnalyticsWorker.perform_async(school_or_user_id, attributes[:account_type])
        attributes = attributes.merge(Subscription.set_trial_expiration_and_start_date(school_or_user))
      elsif [COVID_19_SUBSCRIPTION_TYPE, COVID_19_SCHOOL_SUBSCRIPTION_TYPE].include?(attributes[:account_type])
        attributes = attributes.merge(Subscription.set_covid_expiration_and_start_date)
        extend_current_subscription_for_covid_19(school_or_user)
      elsif attributes[:account_type] == CB_LIFETIME_SUBSCRIPTION_TYPE
        attributes = attributes.merge(Subscription.set_cb_lifetime_expiration_and_start_date)
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


  def self.extend_current_subscription_for_covid_19(user)
    existing_sub = user.subscription
    if existing_sub&.expiration && existing_sub.expiration > Date.today
      time_to_add = [COVID_19_EXPIRATION - Date.today, 0].max
      existing_sub.update(expiration: existing_sub.expiration + time_to_add)
    end
  end

end
