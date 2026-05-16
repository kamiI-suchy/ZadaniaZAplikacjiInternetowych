# Wytłumaczenie kodu – Zadanie JS 6 (WebRTC)

Zadanie pokazuje pełny proces zestawienia połączenia WebRTC w jednej stronie:
- **Computer A** przechwytuje lokalne audio/wideo,
- **Computer B** odbiera offer i odpowiada answer,
- obie strony wymieniają ICE candidate,
- strumień jest wyświetlany w elementach `<video>`.

---

## Plik: `WebRTC.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>WebRTC</title>

    <script src="WebRTC.js"></script>
    <!-- Ładuje logikę JavaScript odpowiedzialną za WebRTC -->

    <style>
        video {
            border: 1px solid black;
            max-width: 120px;
            max-height: 80px;
        }
    </style>
</head>
<body>
    Computer A
    <video id="idVideoLocalA" muted autoplay></video>
    <video id="idVideoRemoteB" muted autoplay></video>

    <input type="button" id="idButtonStart" value="Start" />
    <input type="button" id="idButtonCall" value="Call" disabled="disabled" />
    <input type="button" id="idButtonHangup" value="Hang Up" disabled="disabled" />

    Computer B
    <video id="idVideoLocalB" muted autoplay></video>
    <video id="idVideoRemoteA" muted autoplay></video>
</body>
</html>
```

Najważniejsze elementy:
- 4 elementy `<video>` reprezentują streamy lokalne i zdalne dla obu stron symulacji.
- `muted autoplay` zapobiega sprzężeniu i pozwala natychmiast odtwarzać stream.
- Przycisk **Start** pobiera media, **Call** uruchamia negocjację, **Hang Up** zamyka połączenie.

---

## Plik: `WebRTC.js`

```javascript
document.addEventListener("DOMContentLoaded", onReady)
```
- Kod startuje dopiero po załadowaniu struktury HTML.

### 1) Inicjalizacja i obsługa przycisków

```javascript
function onReady() {
    const
        aVideoLocalA = document.getElementById("idVideoLocalA"),
        aVideoRemoteB = document.getElementById("idVideoRemoteB"),
        aVideoLocalB = document.getElementById("idVideoLocalB"),
        aVideoRemoteA = document.getElementById("idVideoRemoteA"),
        aButtonStart = document.getElementById("idButtonStart"),
        aButtonCall = document.getElementById("idButtonCall"),
        aButtonHangUp = document.getElementById("idButtonHangup");
```
- Pobranie referencji do elementów DOM.

```javascript
    aButtonStart.onclick = () => { start() }
    aButtonCall.onclick = () => { callToUser() }
    aButtonHangup.onclick = () => { hangUpCall() }
```
- Przypisanie zdarzeń kliknięcia do funkcji logiki.

```javascript
    let aMediaStreamLocalA,
        aRTCPeerConnection_ComputerA,
        aRTCPeerConnection_ComputerB;
```
- Zmienne stanu: lokalny stream A oraz dwa obiekty `RTCPeerConnection`.

### 2) Start – pobranie strumienia lokalnego

```javascript
function start() {
    aButtonStart.disabled = true

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(aMediaStream => {
            aVideoLocalA.srcObject = aMediaStream
            aMediaStreamLocalA = aMediaStream
            aButtonCall.disabled = false
        })
        .catch(err => {
            console.error("start:err=", err)
        })
}
```
- `getUserMedia` pyta użytkownika o dostęp do kamery i mikrofonu.
- Po sukcesie stream trafia do `idVideoLocalA` i odblokowuje przycisk **Call**.

### 3) Call – utworzenie połączenia i dodanie tracków

```javascript
function callToUser() {
    if (!aMediaStreamLocalA) {
        console.error("callToUser:!aMediaStreamLocalA")
        return
    }
    aButtonCall.disabled = true
    aButtonHangup.disabled = false
```
- Walidacja, że media są gotowe.
- Zmiana stanu przycisków na „trwa połączenie”.

```javascript
    const
        avVideoTracks = aMediaStreamLocalA.getVideoTracks(),
        avAudioTracks = aMediaStreamLocalA.getAudioTracks();

    if (0 < avVideoTracks.length) {
        console.log(`Using video device: ${avVideoTracks[0].label}`)
    }
    if (0 < avAudioTracks.length) {
        console.log(`Using audio device: ${avAudioTracks[0].label}`)
    }
```
- Odczyt i logowanie urządzeń audio/wideo.

```javascript
    createPeerConnection_ComputerA()

    console.log("ComputerA add Transceivers for RTCPeerConnection")
    const avTracks = aMediaStreamLocalA.getTracks();
    avTracks.forEach(aTrack => {
        aRTCPeerConnection_ComputerA.addTransceiver(aTrack, { streams: [aMediaStreamLocalA] })
    })
}
```
- Tworzenie PeerConnection A i dodanie transceiverów z lokalnymi trackami.

### 4) Tworzenie peerów i callbacków

```javascript
function createPeerConnection_ComputerA() {
    aRTCPeerConnection_ComputerA = new RTCPeerConnection()
    aRTCPeerConnection_ComputerA.onnegotiationneeded = cbNegotiationNeeded_ComputerA
    aRTCPeerConnection_ComputerA.onicecandidate = cbICECandidate_ComputerA
    aRTCPeerConnection_ComputerA.ontrack = cbTrack_ComputerA
    ...
}
```
- Konfiguracja eventów po stronie A.

```javascript
function createPeerConnection_ComputerB() {
    aRTCPeerConnection_ComputerB = new RTCPeerConnection()
    aRTCPeerConnection_ComputerB.onicecandidate = cbICECandidate_ComputerB
    aRTCPeerConnection_ComputerB.ontrack = cbTrack_ComputerB
    ...
}
```
- Konfiguracja eventów po stronie B.

### 5) Negocjacja SDP (offer/answer)

```javascript
function cbNegotiationNeeded_ComputerA() {
    aRTCPeerConnection_ComputerA.createOffer()
        .then(offer => aRTCPeerConnection_ComputerA.setLocalDescription(offer))
        .then(() => {
            sendOfferToComputerB(aRTCPeerConnection_ComputerA.localDescription)
        })
        .catch(err => {
            console.error("cbNegotiationNeeded_ComputerA:err=", err)
        })
}
```
- A tworzy offer i ustawia je jako `localDescription`, potem przekazuje do B.

```javascript
function sendOfferToComputerB(aRTCSessionDescription) {
    if (!aRTCPeerConnection_ComputerB) {
        createPeerConnection_ComputerB()
    }

    aRTCPeerConnection_ComputerB.setRemoteDescription(aRTCSessionDescription)
        .then(() => aRTCPeerConnection_ComputerB.createAnswer())
        .then(answer => aRTCPeerConnection_ComputerB.setLocalDescription(answer))
        .then(() => {
            sendAnswerToComputerA(aRTCPeerConnection_ComputerB.localDescription)
        })
}
```
- B ustawia offer jako zdalny opis, tworzy answer, ustawia lokalny opis i odsyła answer.

```javascript
function sendAnswerToComputerA(aRTCSessionDescription) {
    aRTCPeerConnection_ComputerA.setRemoteDescription(aRTCSessionDescription)
}
```
- A ustawia answer jako zdalny opis.

### 6) Wymiana ICE candidate

```javascript
function cbICECandidate_ComputerA(event) {
    if (!event.candidate) {
        console.log("ComputerA ICECandidate gathering complete")
        return
    }
    sendICECandidateToComputerB(event.candidate)
}
```
- Każdy nowy kandydat ICE z A jest przesyłany do B.

```javascript
function cbICECandidate_ComputerB(event) {
    if (!event.candidate) {
        console.log("ComputerB ICECandidate gathering complete")
        return
    }
    sendICECandidateToComputerA(event.candidate)
}
```
- Analogicznie z B do A.

```javascript
aRTCPeerConnection_ComputerB.addIceCandidate(aRTCIceCandidate)
aRTCPeerConnection_ComputerA.addIceCandidate(aRTCIceCandidate)
```
- Dodanie kandydatów do przeciwnej strony połączenia.

### 7) Odbiór strumieni i stany połączenia

```javascript
function cbTrack_ComputerA(event) {
    const aMediaStream = event.streams[0];
    if (aVideoRemoteB.srcObject !== aMediaStream) {
        aVideoRemoteB.srcObject = aMediaStream
    }
}
```
- Gdy A odbierze stream zdalny, podpinany jest do `idVideoRemoteB`.

```javascript
function cbTrack_ComputerB(event) {
    const aMediaStream = event.streams[0];
    if (aVideoLocalB.srcObject !== aMediaStream) {
        aVideoLocalB.srcObject = aMediaStream
    }
    if (aVideoRemoteA.srcObject !== aMediaStream) {
        aVideoRemoteA.srcObject = aMediaStream
    }
}
```
- B wyświetla odebrany stream w dwóch oknach podglądu.

Dodatkowe callbacki logują diagnostycznie stany:
- `iceConnectionState`,
- `iceGatheringState`,
- `signalingState`,
- `connectionState`.

### 8) Zakończenie połączenia

```javascript
function hangUpCall() {
    if (aRTCPeerConnection_ComputerA) {
        aRTCPeerConnection_ComputerA.close()
        aRTCPeerConnection_ComputerA = null
    }
    if (aRTCPeerConnection_ComputerB) {
        aRTCPeerConnection_ComputerB.close()
        aRTCPeerConnection_ComputerB = null
    }
    aButtonCall.disabled = false
    aButtonHangup.disabled = true
}
```
- Zamknięcie obu PeerConnection i przywrócenie stanu przycisków.

---

## Podsumowanie
Kod realizuje kompletny lokalny przepływ WebRTC:
1. pozyskanie mediów,
2. offer/answer,
3. wymianę ICE,
4. odbiór streamu,
5. zakończenie połączenia.
