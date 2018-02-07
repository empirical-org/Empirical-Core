class ChargesController < ApplicationController

  def new
  end

  def create
    @err = nil
    begin
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

      rescue Stripe::CardError => e
        # Since it's a decline, Stripe::CardError will be caught
        body = e.json_body
        @err  = body[:error]

      rescue Stripe::RateLimitError => e
        @err = e
      # Too many requests made to the API too quickly
      rescue Stripe::InvalidRequestError => e
        @err = e
      # Invalid parameters were supplied to Stripe's API
      rescue Stripe::AuthenticationError => e
        @err = e
      # Authentication with Stripe's API failed
      # (maybe you changed API keys recently)
      rescue Stripe::APIConnectionError => e
        @err = e
      # Network communication with Stripe failed
      rescue Stripe::StripeError => e
        @err = e
      # Display a very generic error to the user, and maybe send
      # yourself an email
      rescue => e
        @err = e
      # Something else happened, completely unrelated to Stripe
    end
    # then it is a teacher premium
    if @charge && @charge.status == 'succeeded'
      handle_subscription
    end

    respond_to  do |format|
      format.json { render :json => {route: premium_redirect, err: @err}}
    end
  end

  def update_card
    @message = nil
    handle_stripe_error do
      customer_id = current_user.stripe_customer_id
      customer = Stripe::Customer.retrieve(customer_id)
      new_card = customer.sources.create(source: params[:source][:id])
      customer.default_source = new_card.id
      customer.save
    end
    # then it is a teacher premium
    if @charge && @charge.status == 'succeeded'
      handle_subscription
    end

    render json: {error: @err}
  end

  private

  def handle_subscription
    attributes = {account_limit: 1000}
    attributes[:contact_user_id] = current_user.id
    current_user.update(stripe_customer_id: @charge.customer)
    if @charge.amount == 45000
      attributes[:account_type] = "School Paid"
      if current_user.school && ['home school', 'us higher ed', 'international', 'other', 'not listed'].exclude?(current_user.school.name)
        # if the user has a school, and it is not one of the aforementioned defaults, create or update the premium subscription for it
        Subscription.create_with_school_or_user_join(current_user.school.id, 'school', attributes)
      else
        @message = 'You do not seem to be registered with a school. Your account has been upgraded, and we will reach out to you shortly to upgrade the rest of your school to premium.'
        attributes[:account_type] = 'Purchase Missing School'
        Subscription.create_with_school_or_user_join(current_user.id, 'user', attributes)
      end
    else
      attributes[:account_type] = "Teacher Paid"
      Subscription.create_with_school_or_user_join(current_user.id, 'user', attributes)
    end
  end

  def handle_stripe_error &block
    begin
      block.call
    rescue Stripe::CardError => e
      # Since it's a decline, Stripe::CardError will be caught
      body = e.json_body
      @err  = body[:error]

    rescue Stripe::RateLimitError => e
      @err = e
    # Too many requests made to the API too quickly
    rescue Stripe::InvalidRequestError => e
      @err = e
    # Invalid parameters were supplied to Stripe's API
    rescue Stripe::AuthenticationError => e
      @err = e
    # Authentication with Stripe's API failed
    # (maybe you changed API keys recently)
    rescue Stripe::APIConnectionError => e
      @err = e
    # Network communication with Stripe failed
    rescue Stripe::StripeError => e
      @err = e
    # Display a very generic error to the user, and maybe send
    # yourself an email
    rescue => e
      @err = e
    # Something else happened, completely unrelated to Stripe
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
