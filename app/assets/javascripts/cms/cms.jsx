EC.Cms = React.createClass({

  propTypes: {
    resourceName: React.PropTypes.string.isRequired,
    resourceNamePlural: React.PropTypes.string.isRequired
  },

  initializeModules: function () {
    this.modules = {
      server: new EC.Server(this)
    }
  },

  // TODO: abstract out below method
  updateState: function (key, value) {
    var newState = this.state;
    newState[key] = value;
    this.setState(newState);
  },

  getInitialState: function () {
    this.initializeModules()
    var hash1 = {
      crudState: 'index',
      resourceToEdit: null
    };
    hash1[this.props.resourceNamePlural] = [];
    return hash1;
  },

  indexUrl: function () {
    return ['/cms/', this.props.resourceNamePlural].join('');
  },

  componentDidMount: function () {
    if (this.state.crudState == 'index') {
      this.modules.server.getStateFromServer(this.props.resourceNamePlural, this.indexUrl());
    }
  },

  indexTable: function () {
    return (
      <span>
        <div className='row'>
          <div className='col-xs-12'>
            <button className='button-green button-top' onClick={this.crudNew}>New</button>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <EC.CmsIndexTable resources={this.state[this.props.resourceNamePlural]}
                              edit={this.edit}
                              delete={this.delete}/>
          </div>
        </div>
      </span>
    );
  },

  returnToIndex: function () {
    this.setState({crudState: 'index'});
  },

  individualResourceMode: function () {
    return (this.props.resourceComponentGenerator(this));
  },

  edit: function (resource) {
    this.setState({crudState: 'edit', resourceToEdit: resource});
  },

  delete: function () {
    alert('delete')
  },

  crudNew: function () {
    this.setState({crudState: 'new', resourceToEdit: {}});
  },

  render: function () {
    var result;
    switch (this.state.crudState) {
      case 'index':
        result = this.indexTable();
        break;
      case 'edit':
        result = this.individualResourceMode();
        break;
      case 'new':
        result = this.individualResourceMode();
        break;
    }

    return result;
  }
});