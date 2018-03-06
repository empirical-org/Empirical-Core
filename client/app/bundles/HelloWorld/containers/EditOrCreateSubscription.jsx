import React from 'react';
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown.jsx';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subscription: props.subscription,
    };
    this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this);
  }

  handleAccountTypeChange(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.account_type = e;
    this.setState({ subscription: newSub, });
  }

  render() {
    const schoolOrUser = this.props.school || this.props.user;
    return (
      <div>
        <h1>Edit Subscription: {schoolOrUser.name}</h1>
        <h2>Subscription Information</h2>
        <h4>Premium Status</h4>
        <ItemDropdown
          items={this.props.userPremiumTypes}
          callback={this.handleAccountTypeChange}
          selectedItem={this.state.subscription.account_type || ''}
        />
      </div>);
  }
}
