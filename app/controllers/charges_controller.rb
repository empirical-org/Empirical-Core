class ChargesController < ApplicationController

  def create_customer_with_card
    create_customer_and_update_user
    render json: {current_user: current_user}
  end

  def update_card
    update_card_helper
    render json: {error: @err}
  end

  def new_teacher_premium
    new_sub = Subscription.give_teacher_premium_if_charge_succeeds(current_user)
    render json: {new_subscription: new_sub}
  end

  def new_school_premium
    new_sub = Subscription.give_school_premium_if_charge_succeeds(current_user.school, current_user)
    render json: {new_subscription: new_sub}
  end

  private

  def create_customer_and_update_user
    customer_id = Stripe::Customer.create(
      :description => "premium",
      :source  => params[:source][:id],
      :email => current_user.email,
      :metadata => { name: current_user.name, school: current_user.school&.name }
    ).id
    current_user.update(stripe_customer_id: customer_id)
  end

  def update_card_helper
    customer_id = current_user.stripe_customer_id
    customer = Stripe::Customer.retrieve(customer_id)
    new_card = customer.sources.create(source: params[:source][:id])
    customer.default_source = new_card.id
    customer.save
  end

<<<<<<< HEAD
  def handle_subscription
    attributes[:purchaser_id] = current_user.id
    attributes[:payment_method] = 'Credit Card'
    attributes[:payment_amount] = @charge.amount
    attributes[:recurring] = true
    current_user.update(stripe_customer_id: @charge.customer)
    if @charge.amount == Subscription::SCHOOL_RENEWAL_PRICE
      attributes[:account_type] = "School Paid"
      if current_user.school && ['home school', 'us higher ed', 'international', 'other', 'not listed'].exclude?(current_user.school.name)
        # if the user has a school, and it is not one of the aforementioned defaults, create or update the premium subscription for it
        Subscription.create_with_school_or_user_join(current_user.school.id, 'school', attributes)
      else
        @message = 'You do not seem to be registered with a school. Your account has been upgraded, and we will reach out to you shortly to upgrade the rest of your school to premium.'
        attributes[:account_type] = 'Purchase Missing School'
        PremiumMissingSchoolEmailWorker.perform_async(current_user.id)
        Subscription.create_with_school_or_user_join(current_user.id, 'user', attributes)
      end
    else
      attributes[:account_type] = "Teacher Paid"
      Subscription.create_with_school_or_user_join(current_user.id, 'user', attributes)
    end
  end

  def premium_redirect
    if current_user
      subscriptions_path
    else
      new_session_path
    end
  end
=======
>>>>>>> fix/subscription-post-launch
end
