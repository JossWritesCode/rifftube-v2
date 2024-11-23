require "test_helper"

class RifftubeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get rifftube_index_url
    assert_response :success
  end
end
