require "application_system_test_case"

class UserOptionsTest < ApplicationSystemTestCase
  setup do
    @user_option = user_options(:one)
  end

  test "visiting the index" do
    visit user_options_url
    assert_selector "h1", text: "User options"
  end

  test "should create user options" do
    visit user_options_url
    click_on "New user options"

    check "Always speak text" if @user_option.always_speak_text
    fill_in "Auto duration constant", with: @user_option.auto_duration_constant
    fill_in "Auto duration word rate", with: @user_option.auto_duration_word_rate
    fill_in "Avatar mode", with: @user_option.avatar_mode
    fill_in "Default voice", with: @user_option.default_voice
    check "Immediate save" if @user_option.immediate_save
    check "Pause to riff" if @user_option.pause_to_riff
    check "Play after riff" if @user_option.play_after_riff
    fill_in "User", with: @user_option.user_id
    click_on "Create User options"

    assert_text "User options was successfully created"
    click_on "Back"
  end

  test "should update User options" do
    visit user_option_url(@user_option)
    click_on "Edit this user options", match: :first

    check "Always speak text" if @user_option.always_speak_text
    fill_in "Auto duration constant", with: @user_option.auto_duration_constant
    fill_in "Auto duration word rate", with: @user_option.auto_duration_word_rate
    fill_in "Avatar mode", with: @user_option.avatar_mode
    fill_in "Default voice", with: @user_option.default_voice
    check "Immediate save" if @user_option.immediate_save
    check "Pause to riff" if @user_option.pause_to_riff
    check "Play after riff" if @user_option.play_after_riff
    fill_in "User", with: @user_option.user_id
    click_on "Update User options"

    assert_text "User options was successfully updated"
    click_on "Back"
  end

  test "should destroy User options" do
    visit user_option_url(@user_option)
    click_on "Destroy this user options", match: :first

    assert_text "User options was successfully destroyed"
  end
end
