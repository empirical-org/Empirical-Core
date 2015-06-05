/*
lets just update subscription through our own ajax pathway here, to the subscriptions controller
*/

EC.SelectSubscription = React.createClass({
  getInitialState: function () {
    return ({
      id: null,
      expiration: null,
      accountLimit: null
    });
  },
  componentDidMount: function () {
    $.ajax({
      url: '/users/' + this.props.userId + '/subscription'
    }).done(function (data) {
      this.setState({id: data.id, expiration: data.expiration, accountLimit: data.account_limit});
    });
  },
  createOrDestroySubscription: function () {
    var x = $(this.refs.select.getDOMNode()).val();
    if (x == 'free') {
      this.destroySubscription();
    } else {
      this.createSubscription();
    }
  },
  createSubscription: function () {
    var expiration, accountLimit;
    expiration = null;
    accountLimit = null;
    $.ajax({
      type: 'POST',
      url: '/users/' + this.props.userId + '/subscription',
      data: {expiration: expiration, account_limit: accountLimit}
    });
  },
  destroySubscription: function () {
    $.ajax({
      type: 'POST',
      url: '/users/' + this.props.userId + '/subscription',
      data: {id: this.state.id}
    });
  },
  render: function () {
    var optionStrings = ['free', 'premium'];
    var options = _.map(optionStrings, function (optionString) {
      return <option key={optionString} value={optionString}>{optionString}</option>;
    });
    return (
      <div className='row'>
        <div className='col-xs-2 form-label'>
          Status
        </div>
        <div className='col-xs-4'>
          <select ref='select' onChange={this.createOrDestroySubscription} value={this.props.subscription}>
            {options}
          </select>
        </div>
      </div>
    );
  }
});