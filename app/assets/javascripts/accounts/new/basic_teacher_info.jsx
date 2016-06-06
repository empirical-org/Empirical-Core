'use strict';
EC.BasicTeacherInfo = React.createClass({
    propTypes: {
        analytics: React.PropTypes.object.isRequired,
        signUp: React.PropTypes.func.isRequired,
        // errors: React.PropTypes.object,
        update: React.PropTypes.func.isRequired,
        textInputGenerator: React.PropTypes.object.isRequired
    },

    formFields: [
        {
            name: 'first_name',
            label: 'First Name',
            errorKey: 'name',
            errorLabel: 'Name'
        }, {
            name: 'last_name',
            label: 'Last Name',
            errorKey: 'name',
            errorLabel: 'Name'
        }, {
            name: 'email'
        }, {
            name: 'password'
        }
    ],

    updateSendNewsletter: function() {
        var val = $(this.refs.sendNewsletter.getDOMNode()).attr('checked');
        var bool = (val === 'checked')
        this.props.update({sendNewsletter: bool});
    },

    render: function() {
        var inputs;
        inputs = this.props.textInputGenerator.generate(this.formFields);
        return (
            <div>
                <h3 className='sign-up-header'>Sign up for a Teacher Account</h3>
            <EC.AuthSignUp/>
            <p className='support-p text-center'>We now support Google Classroom!</p>
            <div className='row'>
                <div className='col-xs-offset-3 col-xs-9'>
                    <div className='col-xs-8 need-a-border'/>
                    <div className='row new-teacher-form-fields'>
                        <div className='col-xs-12 form-fields'>
                            {inputs}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-8'>
                            <input type='checkbox' name='sendNewsletter' ref='sendNewsletter' onChange={this.updateSendNewsletter} checked={this.props.sendNewsletter}>
                                Send me monthly Quill updates
                            </input>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-12'>
                            <button id='sign_up' className='button-green col-xs-8' onClick={this.props.signUp}>Sign Up</button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-8'>
                            <div className='text-align-center'>By signing up, you agree to our
                                <a href='/tos'>terms of service</a>
                                and
                                <a href='/privacy'>privacy policy</a>.</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      );
    }
});
