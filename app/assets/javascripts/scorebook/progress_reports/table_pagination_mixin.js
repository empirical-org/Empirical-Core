EC.TablePaginationMixin = {
  getDefaultProps: function() {
    // These appear to be static numbers, so they belong in properties.
    return {
      maxPageNumber: 4,
      resultsPerPage: 25
    }
  },

  getInitialState: function() {
    return {
      currentPage: 1
    };
  },

  applyPagination: function(results, page) {
    // Ported from Stage1.determineCurrentPageSearchResults
    var start = (this.state.currentPage - 1) * this.props.resultsPerPage;
    var end = this.state.currentPage * this.props.resultsPerPage;
    return results.slice(start, end);
  },

  calculateNumberOfPages: function(visibleResults) {
    var numPages = Math.ceil(visibleResults.length / this.props.resultsPerPage);
    return numPages;
  },

  goToPage: function(page) {
    var newState = {
      currentPage: page,
    }
    this.setState(newState);
  },

  resetPagination: function(next) {
    this.setState({currentPage: 1}, next);
  },
};