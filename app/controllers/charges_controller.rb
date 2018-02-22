class ChargesController < ApplicationController

  def create
    if params['source']['email'] != current_user.email
      raise 'Email is different from the user that is currently logged into Quill'
    end
    if !current_user.stripe_customer_id
      customer_id = Stripe::Customer.create(
        :description => "premium",
        :source  => params[:source][:id],
        :email => params[:source][:email]
      ).id
    else
      customer_id = current_user.stripe_customer_id
    end
    @charge = Stripe::Charge.create(
      :customer    => customer_id,
      :amount      => params['amount'].to_i,
      :description => 'Teacher Premium',
      :currency    => 'usd',
      :receipt_email =>  params['source']['email']
    )
    if @charge && @charge.status == 'succeeded'
      handle_subscription
    end
    respond_to  do |format|
      format.json { render :json => {route: premium_redirect}}
    end
  end

  def update_card
    customer_id = current_user.stripe_customer_id
    customer = Stripe::Customer.retrieve(customer_id)
    new_card = customer.sources.create(source: params[:source][:id])
    customer.default_source = new_card.id
    customer.save
    render json: {error: @err}
  end

  def new_teacher_premium
    new_sub = Subscription.give_teacher_premium_if_charge_succeeds(current_user)
    render json: {new_subscription: new_sub}
  end

  private

  def handle_subscription
    attributes = {account_limit: 1000}
    attributes[:purchaser_id] = current_user.id
    attributes[:payment_method] = 'Credit Card'
    attributes[:payment_amount] = @charge.amount
    attributes[:recurring] = true
    current_user.update(stripe_customer_id: @charge.customer)
    if @charge.amount == 45000
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
      teachers_progress_reports_concepts_students_path
    else
      new_session_path
    end
  end
end
