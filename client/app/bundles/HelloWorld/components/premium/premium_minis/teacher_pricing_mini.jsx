import React from 'react'
import PleaseLoginModal from '../please_login_modal.jsx'
import Stripe from '../../modules/stripe.jsx'
export default React.createClass({

    // TODO: make route for free trial that depends on if they are signed in or not, add stripe integration to free trial

    charge: function() {
        new Stripe();
    },

    getInitialState: function() {
        return {
            isUserSignedIn: ($('#user-logged-in').data().signedIn === true)
        };
    },

    beginTrial: function() {
        if (this.state.isUserSignedIn === true) {
            $.post('/subscriptions', {
                account_limit: 1000,
                account_type: 'trial',
                authenticity_token: $('meta[name=csrf-token]').attr('content')
            }).success(function() {
                window.location.assign('/teachers/classrooms/scorebook');
            });
        } else {
            alert('You must be logged in to begin your free trial.');
        }
    },

    pleaseLoginModal: function() {
        $(this.refs.pleaseLoginModal).modal();
    },

    purchaseButton: function() {
        if (this.state.isUserSignedIn === true) {
            return <button type='button' id='purchase-btn' data-toggle="modal" onClick={this.charge} className='btn btn-default mini-btn blue'>Buy Now</button>;
        } else {
            return <button type='button' id='purchase-btn' onClick={() => alert('You must be logged in to purchase Quill Premium.')} className='btn btn-default mini-btn blue'>Buy Now</button>;
        }
    },

    render: function() {
        return (
            <div className='pricing-mini'>
                <header className='pricing-mini-header blue'>
                    <div className='img-holder'>
                        <img src="/images/teacher_premium_icon.png" alt="teacher_premium_icon"/>
                    </div>

                    <h4>Teacher Premium</h4>
                </header>
                <section className='pricing-info'>
                    <div className='premium-rates'>
                        <h3>$80</h3>
                        <h4>per year</h4>
                    </div>
                    <ul className='text-left'>
                        <li>Everything in Basic</li>
                        <li>Unlimited students in each class</li>
                        <li>Student reports on Common Core Standards</li>
                        <li>Download and print reports</li>
                    </ul>
                </section>
                <div className='row'>
                    <button type='button' className='btn btn-default mini-btn empty-blue' onClick={this.beginTrial}>Free Trial</button>
                    {this.purchaseButton()}
                    <PleaseLoginModal ref='pleaseLoginModal'/>
                </div>
            </div>
        );
    }
});
