
import { loadHTMLContent } from "./my-js/control-page/change-page.js";
import { SingleTon } from "./my-js/call/singleton/singleton.js";
import { CallStreamManager } from "./my-js/call/singleton/call-stream.js";

const queryCredential = new URLSearchParams(window.location.search);
var integrationMode = queryCredential.get("integrationMode");

var _bandwidth = "";
var _video_size = "";
// Khai báo các sự kiện của Phone
export var PhoneEvent = {
  // Đăng ký SIP bằng Public và Private Identity
  RegisterByPublicPrivate(displayName, withPrivateIdentity, withPassword, withRealm, withPublicIdentity) {
    initiateSIPRegister();
  },

  // Gọi điện thoại
  MakeCall(PhoneNumber) {
    console.log("MakeCall called:");
    console.log(`PhoneNumber: ${PhoneNumber}`);
    sipCall("call-audio", PhoneNumber);
  },

  // Đang gọi điện thoại
  Dialing(OrtherPartyNumber) {
    var originNumber = OrtherPartyNumber;
    console.log("Dialing called:");
    console.log(`OriginNumber: ${originNumber}`);

    if (OrtherPartyNumber.includes("+")) {
      originNumber = OrtherPartyNumber.split("+")[0];
      console.log(`Modified Number: ${originNumber}`);
    }

    postToParent("Dialing", originNumber);
  },

  // Đang đổ chuông
  Ringing(OrtherPartyNumber) {
    console.log("Ringing called:");
    console.log(`OrtherPartyNumber: ${OrtherPartyNumber}`);
    postToParent("Ringing", OrtherPartyNumber);
    loadHTMLContent("/pages/call/incoming.html");
  },

  // Cuộc gọi kết thúc
  Ended(OrtherPartyNumber) {
    var originNumber = OrtherPartyNumber;
    console.log("Ended called:");
    console.log(`OriginNumber: ${originNumber}`);

    if (OrtherPartyNumber.includes("+")) {
      originNumber = OrtherPartyNumber.split("+")[0];
      console.log(`Modified Number: ${originNumber}`);
    }

    postToParent("Ended", originNumber);
  },

  // Cuộc gọi kết nối qua dialing
  ConnectedByDialing(OrtherPartyNumber) {
    var originNumber = OrtherPartyNumber;
    console.log("ConnectedByDialing called:");
    console.log(`OriginNumber: ${originNumber}`);

    if (OrtherPartyNumber.includes("+")) {
      originNumber = OrtherPartyNumber.split("+")[0];
      console.log(`Modified Number: ${originNumber}`);
    }

    postToParent("ConnectedByDialing", originNumber);
  },

  // Cuộc gọi kết nối qua ringing
  ConnectedByRinging(OrtherPartyNumber) {
    console.log("ConnectedByRinging called:");
    console.log(`OrtherPartyNumber: ${OrtherPartyNumber}`);
    postToParent("ConnectedByRinging", OrtherPartyNumber);
    sipCall('call-audio', null); //bắt máy và call luôn
  },

  // Cuộc gọi đã hủy đăng ký
  Unregistered() {
    console.log("Unregistered called.");
    postToParent("Unregistered", null);
  },

  // Đăng ký thành công
  RegisteredSuccess() {
    console.log("RegisteredSuccess called.");
    postToParent("RegisteredSuccess", null);
  },
};

// Hàm gửi thông tin sự kiện đến parent
function postToParent(event, message) {
  parent.postMessage(
    {
      event: event,
      message: message,
    },
    "*"
  );
}

// Lắng nghe sự kiện từ parent
window.addEventListener(
  "message",
  (event) => {
    if (event.data.event == "MakeCall") {
      PhoneEvent.MakeCall(event.data.message);
    }
    if (event.data.event == "ChangeContactName") {
      if (event.data.message) {
        SetContactName(event.data.message);
      }
    }
    if (event.data.event == "RegisterByPublicPrivate") {
      if (event.data.message.private && event.data.message.password) {
        sipUnRegister();
        PhoneEvent.RegisterByPublicPrivate(event.data.message.private, event.data.message.password);
      }
    }
    if (event.data.func == "innerClickToCall") {
      innerClickToCall(event.data.message);
    }
  },
  false
);

window.onload = function () {
  //   HideAll();
  audioRemote = document.getElementById("audio_remote");

  SIPml.setDebugLevel("error");
  //   if (PrivateIdentity.length > 2) {
  //     PhoneEvent.RegisterByPublicPrivate(PrivateIdentity, Password);
  //   }
};

// Thiết lập các âm thanh liên quan đến cuộc gọi
var ringbacktone = new Audio("sounds/CanhBaoCuocGoiDen.wav");
var ringtone = new Audio("sounds/ringtone.wav");
var dtmfTone = new Audio("sounds/dtmf.wav");

dtmfTone.loop = true;
ringtone.loop = true;
var canhBaoAudio = new Audio("sounds/CanhBaoCuocGoiDen.wav");

export function startRingTone() {
  try {
    ringtone.play();
  } catch (e) {
    console.error('Failed to play ringtone:', e);
  }
}

export function stopRingTone() {
  try {
    ringtone.pause();
  } catch (e) { }
}

export function startRingbackTone() {
  try {
    ringbacktone.play();
  } catch (e) { }
}

function stopRingbackTone() {
  try {
    ringbacktone.pause();
  } catch (e) { }
}

async function startCanhBao() {
  try {
    canhBaoAudio.play();
  } catch (e) { }
}

/*
 * event config
 */
var oSipStack, oSipSessionRegister, oSipSessionCall, oSipSessionTransferCall;

/*
 *  SIP config parameter
 */
var videoRemote, videoLocal, audioRemote;
var viewVideoLocal, viewVideoRemote, viewLocalScreencast;
var oConfigCall = {
  audio_remote: audioRemote,
  video_local: viewVideoLocal,
  video_remote: viewVideoRemote,
  screencast_window_id: 0x00000000, // entire desktop
  bandwidth: { audio: undefined, video: undefined },
  video_size: { minWidth: undefined, minHeight: undefined, maxWidth: undefined, maxHeight: undefined },
  events_listener: { events: '*', listener: onSipEventSession },
  sip_caps: [
    { name: '+g.oma.sip-im' },
    { name: 'language', value: '\"en,fr\"' }
  ]
};

export function initiateSIPRegister() {
  // initiateSIPConfig("3CX-audio");
  // if (!(withRealm && withPrivateIdentity && withPublicIdentity && withPassword && displayName)) {
  //   return;
  // }
  try {
    // create SIP stack
    oSipStack = new SIPml.Stack({
      realm: "3cx01.idb.com.vn",
      impi: "60000",
      impu: `sip:60000@3cx01.idb.com.vn`,
      password: "Abc@1234",
      display_name: "60000",
      websocket_proxy_url: "wss://3cx01.idb.com.vn:8089/ws",
      outbound_proxy_url: "",
      ice_servers: "[]",
      enable_rtcweb_breaker: false,
      /**/ events_listener: { events: "*", listener: onSipEventStack },
      enable_early_ims: true, // Must be true unless you're using a real IMS network
      enable_media_stream_cache: true,
      bandwidth: "", // could be redefined a session-level
      video_size: "", // could be redefined a session-level
      sip_headers: [
        { name: "User-Agent", value: "IM-client/OMA1.0 sipML5-v1.2016.03.04" },
        { name: "Organization", value: "IDB" },
      ],
    });
    if (oSipStack.start() != 0) {
      // HideAll();
    } else return;
  } catch (e) {
    alert("Lỗi:" + e);
  }
}
// Hàm huỷ đăng ký SIP
function sipUnRegister() {
  if (oSipStack) {
    oSipStack.stop();
  }
}

// Sự kiện SIP stack, quá trình thiết lập và quản lý kết nối SIP (như khởi tạo, đăng ký, dừng kết nối)
function onSipEventStack(e /*SIPml.Stack.Event*/) {
  console.log("onSipEvent Stack ===> ", e.type);  // Log toàn bộ sự kiện khi nhận

  // Log tất cả các trường hợp trong switch
  switch (e.type) {
    case "started": {
      console.log("SIP Stack started");
      try {
        oSipSessionRegister = this.newSession("register", {
          expires: 5,
          events_listener: { events: "*", listener: onSipEventSession },
          sip_caps: [
            { name: "+g.oma.sip-im", value: null },
            { name: "+audio", value: null },
            { name: "language", value: '"en,fr"' },
          ],
        });
        oSipSessionRegister.register();
        PhoneEvent.RegisteredSuccess();
        console.log("Register session created and registered:", oSipSessionRegister);
      } catch (err) {
        console.error("Error during register event stack:", err);
      }
      break;
    }
    case "stopping":
      console.log("SIP Stack stopping:");
      break;
    case "stopped":
      console.log("SIP Stack stopped");
      break;
    case "failed_to_start":
      console.log("SIP Stack failed to start");
      break;
    case "failed_to_stop":
      console.log("SIP Stack failed to stop");
      break;
    case "i_new_call": {
      console.log("New incoming call event: ", e);
      const storedTime = localStorage.getItem("incomingCallTimeOutbound");

      if (storedTime) {
        console.log("=== cuộc gọi outbound ===");
        oSipSessionCall = e.newSession;
        sipCall("call-audio", null);
        break;
      }

      if (oSipSessionCall) {
        console.log("Already in call, rejecting incoming call.");
        e.newSession.hangup();  // Reject incoming call if already in call
      } else {
        oSipSessionCall = e.newSession;
        oSipSessionCall.setConfiguration(oConfigCall);
        beginRinging(oSipSessionCall.getRemoteFriendlyName() || "unknown");
        console.log("New call session accepted:", oSipSessionCall);
      }
      break;
    }
    case "m_permission_requested":
      console.log("Permission requested");
      break;
    case "m_permission_accepted":
      console.log("Permission accepted");
      break;
    case "m_permission_refused":
      console.log("Permission refused");
      break;
    case "starting":
      console.log("SIP Stack is starting");
      break;
    default:
      console.log("Unhandled event in onSipEventStack");
      break;
  }
}

//onSipEventSession: Xử lý các sự kiện liên quan đến cuộc gọi SIP đang được thực hiện,
// như cuộc gọi bắt đầu, đổ chuông, kết thúc hoặc bị lỗi.
function onSipEventSession(e /* SIPml.Session.Event */) {
  console.log("onSipEvent Session ===> ", e.type);  // Log toàn bộ sự kiện khi nhận

  // Log tất cả các trường hợp trong switch
  switch (e.type) {
    case "connecting":
      console.log("Session connecting");
      break;
    case "connected":
      console.log("Session connected");
      var bConnected = e.type == "connected";
      if (e.session == oSipSessionRegister) {
        console.log("Registration session connected");
      } else if (e.session == oSipSessionCall) {
        if (window.btnBFCP) window.btnBFCP.disabled = false;

        if (bConnected) {
          beginConnected();
          if (e.o_event.o_session.b_local) {
            dialConnected();
          } else {
            ringingConnected();
          }
        }
      }
      break;
    case "terminating":
      console.log("Session terminating");
      break;
    case "terminated":
      console.log("Session terminated:", e);
      if (e.description === "Request Cancelled") {
        // Thực hiện các thao tác cần thiết khi cuộc gọi bị hủy
        endCall(false);
      } else if (e.description === "Call terminated") {
        endCall(true);
      } else if (e.description === "Call Rejected") {
        endCall(false);
      }

      break;
    case "m_stream_video_local_added":
      console.log("Local video stream added");
      break;
    case "m_stream_video_local_removed":
      console.log("Local video stream removed");
      break;
    case "m_stream_video_remote_added":
      console.log("Remote video stream added");
      break;
    case "m_stream_video_remote_removed":
      console.log("Remote video stream removed");
      break;
    case "i_ect_new_call":
      console.log("Incoming call transfer request");
      oSipSessionTransferCall = e.session;
      break;
    case "i_ao_request":
      console.log("Authentication or permission request");
      var iSipResponseCode = e.getSipResponseCode();
      console.log("Received SIP response code:", iSipResponseCode);
      if (iSipResponseCode == 180 || iSipResponseCode == 183) {
        startRingbackTone();
        progressDial();
      }
      break;
    case "m_early_media":
      console.log("Early media event");
      stopRingbackTone();
      stopRingTone();
      break;
    case "m_local_hold_ok":
      console.log("Local hold successful");
      break;
    case "m_local_hold_nok":
      console.log("Local hold failed");
      break;
    case "m_local_resume_ok":
      console.log("Local resume successful");
      break;
    case "m_local_resume_nok":
      console.log("Local resume failed");
      break;
    case "m_remote_hold":
      console.log("Remote party put on hold");
      break;
    case "m_remote_resume":
      console.log("Remote party taken off hold");
      break;
    case "o_ect_trying":
      console.log("Call transfer in progress");
      break;
    case "o_ect_accepted":
      console.log("Call transfer accepted");
      break;
    case "o_ect_completed":
      console.log("Call transfer completed");
      break;
    case "i_ect_completed":
      console.log("Incoming call transfer completed");
      break;
    case "o_ect_failed":
      console.log("Call transfer failed");
      break;
    case "i_ect_failed":
      console.log("Incoming call transfer failed");
      break;
    case "o_ect_notify":
      console.log("Call transfer notification");
      break;
    case "i_ect_notify":
      console.log("Incoming call transfer notification");
      break;
    case "i_ect_requested":
      console.log("Call transfer requested");
      var s_message =
        "Do you accept call transfer to [" +
        e.getTransferDestinationFriendlyName() +
        "]?";
      if (confirm(s_message)) {
        txtCallStatus.innerHTML = "<i>Call transfer in progress...</i>";
        oSipSessionCall.acceptTransfer();
      } else {
        oSipSessionCall.rejectTransfer();
      }
      break;
    default:
      console.log("Unhandled session event");
      // oSipSessionCall = null;
      break;
  }
}

//gọi và bắt máy
function sipCall(s_type, phoneNum) {
  if (oSipStack && !oSipSessionCall && !tsk_string_is_null_or_empty(phoneNum)) {
    if (s_type == "call-screenshare") {
      if (!SIPml.isScreenShareSupported()) {
        alert("Screen sharing not supported. Are you using chrome 26+?");
        return;
      }
      if (!location.protocol.match("https")) {
        if (
          confirm(
            "Screen sharing requires https://. Do you want to be redirected?"
          )
        ) {
          sipUnRegister();
          // HideAll();
          window.location = "https://ns313841.ovh.net/call.htm";
        }
        return;
      }
    }

    if (_bandwidth) {
      oConfigCall.bandwidth = tsk_string_to_object(_bandwidth);
    }
    if (_video_size) {
      oConfigCall.video_size = tsk_string_to_object(_video_size);
    }

    // create call session
    oSipSessionCall = oSipStack.newSession(s_type, oConfigCall);

    // make call
    if (oSipSessionCall.call(phoneNum) != 0) {
      oSipSessionCall = null;
      alert("Failed to make call");
      return;
    } else {
      tryingDial(phoneNum);
    }
  } else if (oSipSessionCall) {
    console.log("===> accept <====");
    oSipSessionCall.accept(oConfigCall);
  }
}


export function sipHangUp() {
  console.log("End call");
  if (oSipSessionCall) {
    oSipSessionCall.hangup({
      events_listener: { events: "*", listener: onSipEventSession },
    });
  }
}

var isInbound = false;
// Event

function tryingDial(phoneNum) {
  // HideAll();
  // ShowTalkingPhone();
  // StartTalkingWatch();
  var originNumber = phoneNum;

  if (phoneNum.includes("+")) {
    originNumber = phoneNum.split("+")[0];
  }
  // SetTalkingPhoneInfo("Call is in progress...", originNumber);
  if (integrationMode == "external") {
    PhoneEvent.Dialing(oSipSessionCall.getRemoteFriendlyName());
  } else {
    // WebRTC.Event.Dialing(oSipSessionCall.getRemoteFriendlyName());
    console.log("tryingDial");
    PhoneEvent.Dialing(oSipSessionCall.getRemoteFriendlyName());
  }
}

function progressDial() { }

function beginConnected() {
  console.log("in call");

  loadHTMLContent("/pages/call/outbound/outbound-incall.html");

  stopRingbackTone();
  stopRingTone();

  // StartTalkingWatch();
  // HideAll();
  // ShowTalkingPhone();
  // SetTalkingPhoneInfo(
  //   "Đã kết nối",
  //   oSipSessionCall.getRemoteFriendlyName() || "unknown"
  // );
  // StartTalkingWatch();
}

function endCall(type) {
  if (integrationMode == "external") {
    PhoneEvent.Ended(oSipSessionCall.getRemoteFriendlyName());
  } else {
    console.log("end2");
    localStorage.removeItem("inCallTime");
    localStorage.removeItem("incomingCallTimeOutbound");
    localStorage.removeItem("incomingCallTime");
    localStorage.removeItem("afterCallTime");

    const singleTon = SingleTon.getInstance();
    singleTon.stopTimer();

    const callStreamManager = CallStreamManager.getInstance();
    callStreamManager.setCallStream(null);
  }

  oSipSessionCall = null;
  stopRingbackTone();
  stopRingTone();

  // if (isInbound) {
  //   sipCall("call-audio", "callmarkdone");
  //   isInbound = false;
  // }
  if (type) {
    loadHTMLContent("/pages/call/aftercall.html");
  } else {
    loadHTMLContent("/pages/call/reject.html");
  }
}

function beginRinging(phoneNum_toShow) {
  startRingTone();
  // HideAll();
  // ShowIncommingPhone();
  // SetIncommingCallPhoneInfo("", "", phoneNum_toShow);

  // sipCall("call-audio", null);
  startCanhBao();
  if (integrationMode == "external") {
    PhoneEvent.Ringing(oSipSessionCall.getRemoteFriendlyName());
  } else {
    console.log("integrationMode của hàm beginRinging is " + integrationMode);
    PhoneEvent.Ringing(oSipSessionCall.getRemoteFriendlyName());
    // WebRTC.Event.Ringing(oSipSessionCall.getRemoteFriendlyName());
  }
}


export function ringingConnected() {
  if (integrationMode == "external") {
    PhoneEvent.ConnectedByRinging(oSipSessionCall.getRemoteFriendlyName());
  } else {
    console.log("integrationMode của hàm ringingConnected is: " + oSipSessionCall.getRemoteFriendlyName());
    PhoneEvent.ConnectedByRinging(oSipSessionCall.getRemoteFriendlyName());
  }
  isInbound = true;
}

function dialConnected() {
  if (integrationMode == "external") {
    PhoneEvent.ConnectedByDialing(oSipSessionCall.getRemoteFriendlyName());
  } else {
    console.log("dialConnected");
    PhoneEvent.ConnectedByDialing(oSipSessionCall.getRemoteFriendlyName());
    // WebRTC.Event.ConnectedByDialing(oSipSessionCall.getRemoteFriendlyName());
  }
}

function innerClickToCall(phone, name) {
  sipCall("call-audio", phone);
}


export function sipToggleMute(callback) {
  if (oSipSessionCall) {
    var i_ret;
    var bMute = !oSipSessionCall.bMute;
    i_ret = oSipSessionCall.mute("audio" /*could be 'video'*/, bMute);
    if (i_ret != 0) {
      alert("Unmute failed");
      return;
    }
    console.log(oSipSessionCall.bMute);
    console.log(i_ret);

    oSipSessionCall.bMute = bMute;
    callback(oSipSessionCall.bMute);
  }
}

export function sipToggleHoldResume(callback) {
  if (oSipSessionCall) {
    console.log("current hold status!!", oSipSessionCall.bHeld);
    var i_ret;
    i_ret = oSipSessionCall.bHeld ? oSipSessionCall.resume() : oSipSessionCall.hold();
    if (i_ret != 0) {
      alert("Hold / Resume failed");
      return;
    }
    oSipSessionCall.bHeld = !oSipSessionCall.bHeld;
    callback(oSipSessionCall.bHeld);
  }
}

