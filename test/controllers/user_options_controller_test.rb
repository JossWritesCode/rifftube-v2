require "test_helper"

class UserOptionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_option = user_options(:one)
  end

  test "should get index" do
    get user_options_index_url
    assert_response :success
  end

  test "should get new" do
    get new_user_option_url
    assert_response :success
  end

  test "should create user_option" do
    assert_difference("UserOptions.count") do
      post user_options_index_url, params: { user_option: { always_speak_text: @user_option.always_speak_text, auto_duration_constant: @user_option.auto_duration_constant, auto_duration_word_rate: @user_option.auto_duration_word_rate, avatar_mode: @user_option.avatar_mode, default_voice: @user_option.default_voice, immediate_save: @user_option.immediate_save, pause_to_riff: @user_option.pause_to_riff, play_after_riff: @user_option.play_after_riff, user_id: @user_option.user_id } }
    end

    assert_redirected_to user_option_url(UserOptions.last)
  end

  test "should show user_option" do
    get user_option_url(@user_option)
    assert_response :success
  end

  test "should get edit" do
    get edit_user_option_url(@user_option)
    assert_response :success
  end

  test "should update user_option" do
    patch user_option_url(@user_option), params: { user_option: { always_speak_text: @user_option.always_speak_text, auto_duration_constant: @user_option.auto_duration_constant, auto_duration_word_rate: @user_option.auto_duration_word_rate, avatar_mode: @user_option.avatar_mode, default_voice: @user_option.default_voice, immediate_save: @user_option.immediate_save, pause_to_riff: @user_option.pause_to_riff, play_after_riff: @user_option.play_after_riff, user_id: @user_option.user_id } }
    assert_redirected_to user_option_url(@user_option)
  end

  test "should destroy user_option" do
    assert_difference("UserOptions.count", -1) do
      delete user_option_url(@user_option)
    end

    assert_redirected_to user_options_index_url
  end
end
