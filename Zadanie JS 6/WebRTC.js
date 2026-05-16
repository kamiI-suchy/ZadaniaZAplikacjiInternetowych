document.addEventListener("DOMContentLoaded", onReady)

function onReady() {

    const
        aVideoLocalA = document.getElementById("idVideoLocalA"),
        aVideoRemoteB = document.getElementById("idVideoRemoteB"),
        aVideoLocalB = document.getElementById("idVideoLocalB"),
        aVideoRemoteA = document.getElementById("idVideoRemoteA"),
        aButtonStart = document.getElementById("idButtonStart"),
        aButtonCall = document.getElementById("idButtonCall"),
        aButtonHangUp = document.getElementById("idButtonHangup");

    aButtonStart.onclick = () => {
        start()
    }
    aButtonCall.onclick = () => {
        callToUser()
    }
    aButtonHangup.onclick = () => {
        hangUpCall()
    }


    let aMediaStreamLocalA,
        aRTCPeerConnection_ComputerA,
        aRTCPeerConnection_ComputerB;


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

    function callToUser() {
        if (!aMediaStreamLocalA) {
            console.error("callToUser:!aMediaStreamLocalA")
            return
        }
        aButtonCall.disabled = true
        aButtonHangup.disabled = false

        const
            avVideoTracks = aMediaStreamLocalA.getVideoTracks(),
            avAudioTracks = aMediaStreamLocalA.getAudioTracks();
        
        if (0 < avVideoTracks.length) {
            console.log('Using video device: ${avVideoTracks[0].label}')
        }
        if (0 < avAudioTracks.length) {
            console.log('Using audio device: ${avAudioTracks[0].label}')
        }

        createPeerConnection_ComputerA()

        console.log("ComputerA add Transceivers for RTCPeerConnection")
        const avTracks = aMediaStreamLocalA.getTracks();
        avTracks.forEach(aTrack => {
            aRTCPeerConnection_ComputerA.addTransceiver(aTrack, { streams: [aMediaStreamLocalA] })
        })
    }

    function createPeerConnection_ComputerA() {
        console.log("ComputerA create RTCPeerConnection")
        aRTCPeerConnection_ComputerA = new RTCPeerConnection()
        aRTCPeerConnection_ComputerA.onnegotiationneeded = cbNegotiationNeeded_ComputerA
        aRTCPeerConnection_ComputerA.onicecandidate = cbICECandidate_ComputerA
        aRTCPeerConnection_ComputerA.ontrack = cbTrack_ComputerA
        aRTCPeerConnection_ComputerA.oniceconnectionstatechange = cbICEConnectionStateChange_ComputerA
        aRTCPeerConnection_ComputerA.onicegatheringstatechange = cbICEGatheringStateChange_ComputerA
        aRTCPeerConnection_ComputerA.onsignalingstatechange = cbSignalingStateChange_ComputerA
        aRTCPeerConnection_ComputerA.onconnectionstatechange = cbConnectionStateChange_ComputerA
    }

    function createPeerConnection_ComputerB() {
        console.log("ComputerB create RTCPeerConnection")
        aRTCPeerConnection_ComputerB = new RTCPeerConnection()
        //aRTCPeerConnection_ComputerB.onnegotiationneeded = cbNegotiationNeeded_ComputerB
        aRTCPeerConnection_ComputerB.onicecandidate = cbICECandidate_ComputerB
        aRTCPeerConnection_ComputerB.ontrack = cbTrack_ComputerB
        aRTCPeerConnection_ComputerB.oniceconnectionstatechange = cbICEConnectionStateChange_ComputerB
        aRTCPeerConnection_ComputerB.onicegatheringstatechange = cbICEGatheringStateChange_ComputerB
        aRTCPeerConnection_ComputerB.onsignalingstatechange = cbSignalingStateChange_ComputerB
        aRTCPeerConnection_ComputerB.onconnectionstatechange = cbConnectionStateChange_ComputerB
    }

    function cbICECandidate_ComputerA(event) {
        sendICECandidateToComputerB(event.candidate)
    }
    function cbICECandidate_ComputerB(event) {
        sendICECandidateToComputerA(event.candidate)
    }

    function cbNegotiationNeeded_ComputerA() {
        console.log("ComputerA createOffer")
        aRTCPeerConnection_ComputerA.createOffer()
            .then(offer => aRTCPeerConnection_ComputerA.setLocalDescription(offer))
            .then(() => {
                sendOfferToComputerB(aRTCPeerConnection_ComputerA.localDescription)
            })
            .catch(err => {
                console.error("cbNegotiationNeeded_ComputerA:err=", err)
            })
    }

    function cbTrack_ComputerA(event) {
        console.log("ComputerA received remote stream from ComputerB")
        const aMediaStream = event.streams[0];
        if (aVideoRemoteB.srcObject !== aMediaStream) {
            aVideoRemoteB.srcObject = aMediaStream
        }
    }
    function cbTrack_ComputerB(event) {
        console.log("ComputerB received remote stream from ComputerA")
        const aMediaStream = event.streams[0];
        if (aVideoRemoteA.srcObject !== aMediaStream) {
            aVideoRemoteA.srcObject = aMediaStream
        }
    }

    function cbICEConnectionStateChange_ComputerA() {
        console.log("ComputerA ICEConnectionState=" + aRTCPeerConnection_ComputerA.iceConnectionState)
    }
    function cbICEConnectionStateChange_ComputerB() {
        console.log("ComputerB ICEConnectionState=" + aRTCPeerConnection_ComputerB.iceConnectionState)
    }

    function cbICEGatheringStateChange_ComputerA() {
        console.log("ComputerA ICEGatheringState=" + aRTCPeerConnection_ComputerA.iceGatheringState)
    }
    function cbICEGatheringStateChange_ComputerB() {
        console.log("ComputerB ICEGatheringState=" + aRTCPeerConnection_ComputerB.iceGatheringState)
    }

    function cbSignalingStateChange_ComputerA() {
        console.log("ComputerA SignalingState=" + aRTCPeerConnection_ComputerA.signalingState)
    }
    function cbSignalingStateChange_ComputerB() {
        console.log("ComputerB SignalingState=" + aRTCPeerConnection_ComputerB.signalingState)
    }

    function cbConnectionStateChange_ComputerA() {
        console.log("ComputerA ConnectionState=" + aRTCPeerConnection_ComputerA.connectionState)
    }
    function cbConnectionStateChange_ComputerB() {
        console.log("ComputerB ConnectionState=" + aRTCPeerConnection_ComputerB.connectionState)
    }

    function sendICECandidateToComputerB(aRTCIceCandidate) {
        console.log("ComputerA send ICECandidate to ComputerB")
        //console.log(aRTCIceCandidate)
        if (!aRTCPeerConnection_ComputerB) {
            console.error("sendICECandidateToComputerB:!aRTCPeerConnection_ComputerB")
            return
        }
        aRTCPeerConnection_ComputerB.addIceCandidate(aRTCIceCandidate)
            .then(() => {
                console.log("ComputerB addICECandidate")
            })
            .catch(err => {
                console.error("sendICECandidateToComputerB:err=", err)
            })
    }
    function sendICECandidateToComputerA(aRTCIceCandidate) {
        console.log("ComputerB send ICECandidate to ComputerA")
        if (!aRTCPeerConnection_ComputerA) {
            console.error("sendICECandidateToComputerA:!aRTCPeerConnection_ComputerA")
            return
        }
        aRTCPeerConnection_ComputerA.addIceCandidate(aRTCIceCandidate)
            .then(() => {
                console.log("ComputerA addICECandidate")
            })
            .catch(err => {
                console.error("sendICECandidateToComputerA:err=", err)
            })
    }

    function sendOfferToComputerB(aRTCSessionDescription) {
        console.log("ComputerA sendOffer to ComputerB")
        //console.log(aRTCSessionDescription)

        if (!aRTCPeerConnection_ComputerB) {
            createPeerConnection_ComputerB()
        }

        aRTCPeerConnection_ComputerB.setRemoteDescription(aRTCSessionDescription)
            .then(() => {
                console.log("ComputerB createAnswer")
                return aRTCPeerConnection_ComputerB.createAnswer()
            })
            .then(answer => aRTCPeerConnection_ComputerB.setLocalDescription(answer))
            .then(() => {
                sendAnswerToComputerA(aRTCPeerConnection_ComputerB.localDescription)
            })
            .catch(err => {
                console.error("sendOfferToComputerB:err=", err)
            })
    }

    function sendAnswerToComputerA(aRTCSessionDescription) {
        console.log("ComputerB sendAnswer to ComputerA")
        if (!aRTCPeerConnection_ComputerA) {
            console.error("sendAnswerToComputerA:!aRTCPeerConnection_ComputerA")
            return
        }
        aRTCPeerConnection_ComputerA.setRemoteDescription(aRTCSessionDescription)
    }

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
        aButtonHangUp.disabled = true
    }
}