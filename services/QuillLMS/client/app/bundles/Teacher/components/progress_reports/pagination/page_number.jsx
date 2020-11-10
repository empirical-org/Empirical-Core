import React from 'react'

export default class PageNumber extends React.Component {
 constructor(props) {
   super(props)

   this.state = {isCurrentPage: null, classy: null};
 }

 componentDidMount() {
   this.determineState(this.props);
 }

 UNSAFE_componentWillReceiveProps = (nextProps) => {
   this.determineState(nextProps);
 };

 determineState = (props) => {
   if (props.number === props.currentPage ) {
     this.setState({isCurrentPage: true, classy: 'page_number active'});
   } else {
     this.setState({isCurrentPage: false, classy: 'page_number'});
   }
 };

 clickNumber = () => {
     if (this.state.isCurrentPage === false) {
         this.props.selectPageNumber(this.props.number);
     }
 };

 render() {
     return (
       <li className={this.state.classy} onClick={this.clickNumber}>
         <span>{this.props.number}</span>
       </li>
     );
 }
}
