# RiffTube

## The basic idea:

Riff over YouTube videos. Share a special link for viewing the video with riffing.

A riff is usually some audio, ideally (but not necessarily) with accompanying text; or just text, without audio.

You can record the audio yourself, or have the computer-generated voice speak it for you.

## The (New) Riffing Interface

To start recording a riff, press and hold the R key to record an audio riff. You can also press and hold, or tap and hold, on the red button at the upper left.

You can also hold down T to insert a text riff for the specified length of time.

After you release the key, or mouse button, the edit dialog will remain open (*) allowing you to record another take, add text, or change your mind and press cancel. When recording additional takes, you can use the R key, or press and hold the Record button.

## Riffing Options

These are found by going to your account page, which is found under the user menu (circle on the far right of the navigation bar). To change these options, click the Edit button.

Pause to riff: Pause the video immediately when you start a new riff?

Play after riff: Automatically start the video playing after adding a riff.

Immediate save: (*) This option will immediately save an audio riff after you finish recording it. Has no effect if you pressed T to create a riff; the riff dialog remains open so that you can enter the text.

Note: Even if "Pause to riff" is not selected, the video will still pause once you finish recording your riff, unless "Immediate save" is selected.

## View Options

As a user, you can choose to have a computer-generated voice speak all riffs that don't have recorded audio, but do have text. If you want this, you select the voice.

## Technical

Example Riff Object:
{
    "id": 679,
    "duration": 3.15,
    "start": 31.5,
    "text": "",
    "rating": null,
    "isText": false,
    "user_id": 17,
    "video_id": 22,
    "speak": false,
    "showText": true,
    "autoDuration": true,
    "voice": "{\"name\":\"Alex\",\"lang\":\"en-US\",\"pitch\":1,\"rate\":1}",
    "riff_kind": 1,
    "name": "Pax Torgo",
    "payload": null,
    "type": "audio"
}

Example User Options:
{
    "id": 1,
    "user_id": 17,
    "auto_duration_word_rate": 0.4,
    "auto_duration_constant": 0.5,
    "avatar_mode": 1,
    "always_speak_text": false,
    "default_voice": "{\"name\":\"Juan\",\"lang\":\"es-MX\",\"pitch\":\"0.5\",\"rate\":\"1\"}",
    "pause_to_riff": true,
    "play_after_riff": false,
    "immediate_save": false,
    "created_at": "2024-11-28T07:18:19.769Z",
    "updated_at": "2025-01-05T09:20:23.907Z",
    "threshold_mode": 0,
    "threshold_options": null
}