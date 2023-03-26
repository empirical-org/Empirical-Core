import * as React from 'react';

class ResponseToggleFields extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.toggleFieldAndResetPage = this.toggleFieldAndResetPage.bind(this)
    this.renderToggleField = this.renderToggleField.bind(this)
  }

  renderToggleField(status: string, index: number) {
    let tagClass = 'tag';
    let addColorToTag = false;
    if (this.props.visibleStatuses[status]) addColorToTag = true;

    if (addColorToTag) {
      switch (status) {
        case 'Human Optimal':
          tagClass += ' is-success';
          break;

        case 'Human Sub-Optimal':
          tagClass += ' is-warning';
          break;

        case 'Algorithm Optimal':
          tagClass += ' is-success is-algo-optimal';
          break;

        case 'Algorithm Sub-Optimal':
          tagClass += ' is-info';
          break;

        case 'Unmatched':
          tagClass += ' is-danger';
          break;

        default:
          tagClass += ' is-dark';
      }
    }

    return (
      <label className="panel-checkbox toggle" key={index}>
        <span className={tagClass} onClick={this.toggleFieldAndResetPage.bind(null, status)}>{status.replace(' Hint', '')}</span>
      </label>
    );
  }

  toggleFieldAndResetPage(status: string) {
    this.props.resetPageNumber();
    this.props.toggleField(status);
  }

  render() {
    return (
      <div>
        <div style={{ margin: '10 0', }}>
          {this.props.qualityLabels.map((label: string, i: number) => this.renderToggleField(label, i))}
        </div>
        <div style={{ margin: '10 0 0 0', display: 'flex', flexWrap: 'wrap', }}>
          {this.props.labels.map((label: string, i: number) => this.renderToggleField(label, i))}
        </div>
        <div style={{ margin: '10 0', display: 'flex', flexWrap: 'wrap', }}>
          {this.props.regexLabels.map((label: string, i: number) => this.renderToggleField(label, i))}
        </div>
      </div>
    );
  }
}

export { ResponseToggleFields };

