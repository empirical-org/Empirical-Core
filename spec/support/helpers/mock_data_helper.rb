module MockDataHelper
  # This method can be called in any of our backend tests to generate mockdata
  # for use in our frontend tests. Simply call the method with the response object
  # as a param, and this will automagically save the mock data in a file that
  # matches the request path name.
  # Ex: '/api/v1/cool_path' will be saved as 'api_v1_cool_path.json'
  def save_mock_data(response, condition=nil)
    # If there is no folder for holding our mock data, create it.
    FileUtils.mkdir_p 'client/__mockdata__'
    condition = "_#{condition.downcase.gsub(/[^0-9a-z_]/, '_')}" if condition
    File.write("client/__mockdata__/#{response.request.fullpath.gsub('/', '_')[1..-1]}#{condition}.json", response.body)
  end
end
