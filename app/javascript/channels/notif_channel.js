import consumer from "./consumer"

console.log("loading notif channel js");

consumer.subscriptions.create({channel: "NotifChannel", video_id: 1}, {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("cable connected");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
  }
});
