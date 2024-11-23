# React + Vite

rake start




to deploy

npm run build
npm run deploy

then

git push heroku blah lbah






TODO:

1. Finish Grade UI and merge branch

- display text riffs

- where should cable files live? Maybe need to set up a copy when run (from the rails to react dir)
    - works ok on production, not at all on dev

- Fix bug re: pressing cancel!!!!!
    - this is fixed I believe





An attempt at documentation:

------

User Options table columns:

t.float "auto_duration_word_rate", default: 0.4
    When auto-determining the duration to display a riff, how many seconds should be allocated per word.
t.float "auto_duration_constant", default: 0.5
    When auto-determining the duration to display a riff, a constant number of seconds to add.
t.integer "avatar_mode", default: 1
    0: No avatars displayed
    1: Avatars pop up as the riff plays
    2: "Theater mode", the avatars are all visible the whole time.
t.boolean "always_speak_text", default: false
    n/t
t.string "default_voice"
    Default speech voice (JSON containing voice, rate, and pitch)
t.boolean "pause_to_riff", default: true
    Pause the video when starting to riff?
t.boolean "play_after_riff", default: true
    Play the video upon closing riff dialog?
    (Only applicable if pause_to_riff is true)
t.boolean "immediate_save", default: false
    Automatically saves the riff and closes the riff dialog upong releaseing the key
    This may seem odd, but might be used by people who want to riff quickly and then go back and tweak things
t.integer "threshold_mode"
    TODO: Add default (0)
    0: Only users who meet the requirements'* riffs play/display
    1: All users' riffs play/display
    2: Special options (wait to implement)
t.string "threshold_options"
    JSON containing special theshold options (TBD_)
t.datetime "created_at", null: false
t.datetime "updated_at", null: false

* Requirements:
    A ratio of *at least* 5 follows to every 1 block.
    This is arbitrary and may change.
    
  Riff Flags table columns:
    t.bigint "user_id", null: false
    t.bigint "riff_id", null: false
    t.string "type"
    t.string "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false

------

isText means "is text only" (i.e. no recorded audio)

edit riff form:

use audio:          isText  speak
- recorded          false   false
- synthesized       true    true 
- no                true    false

show text?          show = t/f

duration (under advanced):  auto-duration = t/f
- custom
- auto (synthesized audio duration)

"use recorded [or synthesized] audio" (isText = false [or speak = true]) will set auto-duration = true

if "use no audio" is chosen (i.e. radio button clicked, or 't' is pressed instead of 'r'), then "show text" (showText) will be set to true (though it can be de-selected)

isText = false -> auto-duration = true, speak = false (show = t/f)
isText = true, speak = false -> show = true (auto-duration = t/f)
isText = true, speak = true -> auto-duration = true (show = t/f)




To restore the db from a dump:

heroku pg:backups:restore 'https://paxfeline.github.io/raw/db63fc3e-c55d-4d62-a107-23b665821579' DATABASE_URL --app rifftube2 --confirm rifftube2

heroku pg:backups:restore 'https://github.com/paxfeline/paxfeline.github.io/raw/master/db-backup' DATABASE_URL --app rifftube2 --confirm rifftube2


process:

psql:
\c rifftube
drop database rifftube;
create database rifftube;

shorter:
rake db:drop db:create

pg_restore -O -d rifftube /Users/davidnewberry/Downloads/052f5925-6965-4c43-af03-27a54c07f8fa 
rake db:migrate

short long:
rake db:drop db:create && pg_restore -O -d rifftube /Users/davidnewberry/Downloads/052f5925-6965-4c43-af03-27a54c07f8fa  && rake db:migrate

(no longer needed! :)
    psql:
    \c rifftube
    alter table users drop constraint users_email_unique;





ffmpeg command to concat two files w/ 5s of silence between

ffmpeg -i riff530.mp3 -i riff531.mp3 -filter_complex "aevalsrc=exprs=0:d=5[silence], [0:a] [silence] [1:a] concat=n=3:v=0:a=1[outa]" -map [outa] out.mp3



current node v

v12.16.2











api endpoints


server.get('/api-status', (req, res) => {
res.status(200).json({ api: 'running', updated: '5.29' });

    /

// return given riff's audio data
server.get('/load-riff/:id', (req, res) => {
    res.status(200).send(aud.audio);

    Change to: /riffs/:id

// delete riff
server.delete('/riff-remove/:id', (req, res) => {
    res.status(204).end();

    Change to: /riffs/:id

// sets the "riffer name" for a given user
server.post('/set-name', (req, res) => {
      data: { newName },
        res.status(200).json({ status: 'ok', name: body.newName, user_id })

    Change to: PATCH /user/:id/name
        newName to name

// returns the riffs of a current user for a given video
server.post('/get-riffs/:videoID', (req, res) => {
        res.status(200).json({
            status: 'ok', // meaningless (to computers)
            body: riffList,
            name,
            user_id: uID,
        });

    Change to: GET /riffs?video_id=xxx&user_id=self
        "self" or some other constant can refer to the logged in user

// update riff time.
server.post('/update-riff-time', (req, res) => {
    .then(() => res.status(200).json({ status: 'ok', type: 'edit' }))

    Change to: PATCH /riffs/:id[?fields=start]

// save riff does as it name suggests.
server.post('/save-riff', upload.single('blob'), (req, res) => {
        .then(() => res.status(200).json({ status: 'ok', type: 'edit' }))

    Change to: POST/PATCH /riffs[/:id]

// get view riffs essentially returns riff meta for a video.
server.get('/get-view-riffs/:videoID', (req, res) => {
    res.status(200).json({
    status: 'ok',
    body: riffList.map((el) => ({ ...el, video_id: videoID })),
    timestamp: Date.now(),
    });

    Change to: GET /riffs?video_id=xxx
        No user_id means return all riffs

// get info for account page
server.get('/get-user-data/:token', (req, res) => {
    res.status(200).json({
        status: 'ok',
        userid,
        name: riffer,
        body,
    });

    Implemented

    Returns:
        Status 200:
        {
            "body" => riffs,
            "status" => "ok",
            "user_id" -- Depricating
        }
        Status: 401 Unauthorized

    Change to: GET /users/self

// get info for public profile
server.get('/get-user-data-by-id/:id', (req, res) =>
res.status(200).json({
    status: 'ok',
    name,
    body
});

    Change to: /users/:id

// get global video list
server.get('/get-global-video-list', (req, res) =>
res.status(200).json({
    status: 'ok',
    body
});

    Implemented

    Returns:
        Status 200:
        {
            "body": Array of riff metadata
            "status": "ok"
            "user_id" -- Depricating
        }

// get riffer pic
const default_pic = fs.readFileSync(path.join(__dirname, 'default_pic.png'));
server.get('/get-riffer-pic/:id', (req, res) =>
    if (pic === null)
    res.status(200).send(default_pic);
    else
    res.status(200).send(pic);

    Implemented
    TODO: send default pic

// save pic does as it name suggests.
server.post('/save-pic', upload.single('image'), (req, res) =>
        res.status(200).json({ status: 'ok', user_id })





May 2 - Considering using iframe for riff editing
The extension can't load external code, but can load an iframe with an external site
Can't pass in audio recorder object, but maybe able to allow recording in iframe using allow attribute



Welcome letter:

Thanks for signing up for RiffTube!

Your participation is what RiffTube is all about. As a fan of Mystery Science Theater 3000 and RiffTrax -- which RiffTube is 100% not affiliated with -- I always dreamed of adding my voice to the choir.  And there is so much out there just begging to be riffed! So I hope you add your voice and humor, wit, wisdom, or "other".

You retain complete ownership and control over the riffs, and all other content, you may create. You can choose to remove or edit your riffs on RiffTube at any time, and RiffTube will never sell your work or personal information.

Because of how RiffTube works, it is possible for a person to download any riff (much like anyone can download images from the web), though RiffTube provides no convenient method to do so.

I hope you enjoy using RiffTube. I look forward to see what we all create together.

See you out there!
-David Newberry
 Benevolent Dictator for Life

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
