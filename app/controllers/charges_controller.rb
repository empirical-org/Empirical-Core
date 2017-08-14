class ChargesController < ApplicationController

  def new
  end

  def create
    err = nil
    @message = nil
    begin
      if params['source']['email'] != current_user.email
        raise 'Email is different from the user that is currently logged into Quill'
      end
      customer = Stripe::Customer.create(
        :description => "premium",
        :source  => params[:source][:id]
      )
      @charge = Stripe::Charge.create(
        :customer    => customer.id,
        :amount      => params['amount'].to_i,
        :description => 'Teacher Premium',
        :currency    => 'usd',
        :receipt_email =>  params['source']['email']
      )

      rescue Stripe::CardError => e
        # Since it's a decline, Stripe::CardError will be caught
        body = e.json_body
        err  = body[:error]

        puts "Status is: #{e.http_status}"
        puts "Type is: #{err[:type]}"
        puts "Charge ID is: #{err[:charge]}"
        # The following fields are optional
        puts "Code is: #{err[:code]}" if err[:code]
        puts "Decline code is: #{err[:decline_code]}" if err[:decline_code]
        puts "Param is: #{err[:param]}" if err[:param]
        puts "Message is: #{err[:message]}" if err[:message]
      rescue Stripe::RateLimitError => e
        err = e
      # Too many requests made to the API too quickly
      rescue Stripe::InvalidRequestError => e
        err = e
      # Invalid parameters were supplied to Stripe's API
      rescue Stripe::AuthenticationError => e
        err = e
      # Authentication with Stripe's API failed
      # (maybe you changed API keys recently)
      rescue Stripe::APIConnectionError => e
        err = e
      # Network communication with Stripe failed
      rescue Stripe::StripeError => e
        err = e
      # Display a very generic error to the user, and maybe send
      # yourself an email
      rescue => e
        err = e
      # Something else happened, completely unrelated to Stripe
      end
      # then it is a teacher premium
      if @charge
        handle_subscription
      end


      respond_to  do |format|
        puts 'here is the error'
        puts err
        format.json { render :json => {route: premium_redirect, err: err, message: @message}}
      end
    end



  private

  def handle_subscription
    attributes = {account_type: 'paid', account_limit: 1000}
    if @charge.amount == 45000
      if current_user.school && ['home school', 'us higher ed', 'international', 'other', 'not listed'].exclude?(current_user.school.name)
        # if the user has a school, and it is not one of the aforementioned defaults, create or update the premium subscription for it
        Subscription.create_or_update_with_school_or_user_join(current_user.school.id, 'school', attributes)
      else
        @message = 'You do not seem to be registered with a school. Your account has been upgraded, and we will reach out to you shortly to upgrade the rest of your school to premium.'
        attributes[:account_type] = 'missing school'
        Subscription.create_or_update_with_school_or_user_join(current_user.id, 'user', attributes)
      end
    else
      Subscription.create_or_update_with_school_or_user_join(current_user.id, 'user', attributes)
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
