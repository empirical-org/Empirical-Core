import React from 'react'
import request from 'request'
import ReactTable from 'react-table'

import LoadingSpinner from '../../Connect/components/shared/loading_indicator.jsx'
import { SortableList, } from  '../../Shared/index'
import UnitTemplateRow from './unit_template_row'
import getAuthToken from '../components/modules/get_auth_token'

import UnitTemplate from '../components/unit_templates/unit_template.jsx'
import Cms from './Cms.jsx'

const UNIT_TEMPLATES_URL = `${process.env.DEFAULT_URL}/cms/unit_templates.json`
const NO_DATA_FOUND_MESSAGE = "Activity Packs data could not be found. Refresh to try again, or contact the engineering team."


export default class UnitTemplates extends React.Component {

  state = {
    loadingTableData: true,
    flag: '',
    fetchedData: [],
    promptSearchInput: "",
    dataToDownload: []
  };

  shouldComponentUpdate(nextProps, nextState){
    return !(this.state === nextState)
  }

  componentDidMount() {
    this.fetchUnitTemplatesData();
  }

  fetchUnitTemplatesData() {
    this.setState({ loadingTableData: true })
    request.get({
      url: UNIT_TEMPLATES_URL,
    }, (e, r, body) => {
      let newState = {}
      if (e || r.statusCode != 200) {
        console.log("dont got it")
        newState = {
          loadingTableData: false,
          dataResults: [],
        }
      } else {
        console.log("got it")
        const data = JSON.parse(body);
        console.log(data)
        newState = {
          loadingTableData: false,
          fetchedData: data.unit_templates
        };
      }
      this.setState(newState)
    });
  }

  updateOrder = (sortInfo) => {
    console.log("sort info")
    console.log(sortInfo)
    const { fetchedData, } = this.state
    const newOrder = sortInfo.map(item => item.key);
    const newOrderedUnitTemplates = fetchedData.map((ut, i) => {
      const newUnitTemplate = ut
      const newIndex = newOrder.findIndex(key => Number(key) === Number(ut.id))
      if (newIndex !== -1) {
        newUnitTemplate['order_number'] = newIndex
      }
      return newUnitTemplate
    })



    const link = `${process.env.DEFAULT_URL}/cms/unit_templates/update_order_numbers`
      // console.log("updated orders")
      // console.log(unitTemplates)
    const data = new FormData();
    data.append( "unit_templates", JSON.stringify(newOrderedUnitTemplates) );
    fetch(link, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: data,
      headers: {
        'X-CSRF-Token': getAuthToken()
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      alert(`Order for activity packs has been saved.`)
    }).catch((error) => {
      // to do, use Sentry to capture error
    })

    this.setState({fetchedData: newOrderedUnitTemplates});

  };

  orderedUnitTemplates = () => {
    const { fetchedData, } = this.state
    return fetchedData.sort((bp1, bp2) => bp1.order_number - bp2.order_number)
  }

  handleDelete = (id) => {
    const link = `${process.env.DEFAULT_URL}/cms/unit_templates/${id}`
    fetch(link, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      body: {},
      headers: {
        'X-CSRF-Token': getAuthToken()
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      alert(`Activity pack was deleted.`)
      this.fetchUnitTemplatesData();
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  }

  renderTableRow(unitTemplate) {

    const { id, name, diagnostic_names, flag, order_number } = unitTemplate
    return (<UnitTemplateRow
      id={id}
      flag={flag}
      diagnostic_names={diagnostic_names}
      handleDelete={this.handleDelete}
      name={name}
      order_number={order_number}
      key={id}
    />)
  }

  tableOrEmptyMessage() {
    const { fetchedData } = this.state

    let tableOrEmptyMessage

    if (fetchedData) {
      console.log("data is fetched")
      // let dataToUse = this.getFilteredData()
      let dataToUse = this.orderedUnitTemplates()
      const unitTemplateRows = dataToUse.map((ut) => this.renderTableRow(ut))
      tableOrEmptyMessage = (
      <div class="blog-post-table">
        <table>
          {this.renderTableHeader()}
          <SortableList data={unitTemplateRows} sortCallback={this.updateOrder} />
        </table>
      </div>)
    } else {
      tableOrEmptyMessage = NO_DATA_FOUND_MESSAGE
    }
      return (
        <div>
          {tableOrEmptyMessage}
        </div>
      )
  }

  renderTable() {
    const { loadingTableData } = this.state
    if(loadingTableData) {
      return <LoadingSpinner />
    }
    return (this.tableOrEmptyMessage())
  }

  renderTableHeader() {
    return (<tr>
      <th>Name</th>
      <th>Flag</th>
      <th>Diagnostics</th>
      <th>Preview</th>
      <th>Edit</th>
    </tr>)
  }


  render() {


    return (
      <div className="cms-unit-templates">
        <div className="standard-columns">
          <button className='button-green button-top' onClick={() => {window.open(`unit_templates/new`, '_blank')}}>New</button>
          {this.tableOrEmptyMessage()}
        </div>
      </div>

    )
  }
}
