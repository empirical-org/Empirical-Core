'use strict';
$(function () {
  var ele = $('#cms-authors');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.Authors, props);
    React.render(comp, ele[0]);
  }
});

EC.Authors = React.createClass({

  getImageUrl: function (cmsComponent) {
    var url;
    if (cmsComponent.state.resourceToEdit) {
      url = cmsComponent.state.resourceToEdit.avatar_url;
    } else {
      url = null;
    }
    return url;
  },

  resourceComponentGenerator: function (cmsComponent) {

    var initialModel = {
      id: null,
      name: null
      //avatar: null
    };

    var savingKeys = ['id', 'name', 'avatar']
    var fieldsToNormalize = []

    var formFields = [
      {
        name: 'name',
      },
      {
        name: 'avatar',
        type: 'file'
      }
    ];

    return (
            <div>
              <div className='row'>
                <div className='col-xs-12'>
                  <img src={this.getImageUrl(cmsComponent)}></img>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-12'>
                  <EC.Resource
                           resourceNameSingular='author'
                           resourceNamePlural='authors'
                           initialModel={initialModel}
                           resource={cmsComponent.state.resourceToEdit}
                           formFields={formFields}
                           savingKeys={savingKeys}
                           fieldsToNormalize={fieldsToNormalize}
                           returnToIndex={cmsComponent.returnToIndex} />
                </div>
              </div>
            </div>
           );
  },

  render: function () {
    return (
      <EC.Cms resourceNameSingular='author'
              resourceNamePlural='authors'
              resourceComponentGenerator={this.resourceComponentGenerator}/>

    );
  }
});