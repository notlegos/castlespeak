function digitsClear () {
    digits = Connected.tm1637Create(Connected.DigitalRJPin.J5)
    digits.clear()
}
function awaitPlayer () {
    radioSay("Intro", "30", true)
    Connected.showUserNumber(3, Connected.readColor())
    while (thePlayer == "") {
        thisColor = Math.round(Connected.readColor())
        colorReads.push(thisColor)
        if (thisColor == colorReads.removeAt(0)) {
            if (isNearly(96.5, thisColor, 1)) {
                Connected.showUserText(5, "" + thisColor + "red")
                thePlayer = "Mario"
            } else if (isNearly(98, thisColor, 1)) {
                Connected.showUserText(5, "" + thisColor + "tan")
                thePlayer = "Wario"
            } else if (isNearly(0, thisColor, 0.5)) {
                Connected.showUserText(5, "" + thisColor + "green")
                thePlayer = "Luigi"
            } else if (isNearly(72, thisColor, 1)) {
                Connected.showUserText(5, "" + thisColor + "pink")
                thePlayer = "Princess"
            } else if (isNearly(133.5, thisColor, 1)) {
                Connected.showUserText(5, "" + thisColor + "brown")
                thePlayer = "Toad"
            }
        }
        basic.pause(300)
    }
    readyInstructions = false
    thePlayer = thePlayer
    Connected.showUserText(4, thePlayer)
    radioSay("Intro", "31", true)
    basic.pause(1000)
    startGame()
}
function isNearly (reference: number, reading: number, tolerance: number) {
    if (reading >= reference - tolerance && reading <= reference + tolerance) {
        return true
    } else {
        return false
    }
}
function tryFinalRow (startPosition: string, minePosition: string) {
    Connected.showUserText(1, "start " + startPosition)
    Connected.showUserText(2, "mine " + minePosition)
    if (minePosition == "H") {
    	
    } else {
    	
    }
    finalRowCountdown = 6
    thisPosition = startPosition
    beginCountdown = input.runningTime()
    endCountdown = beginCountdown + finalRowCountdown * 1000
    digits = Connected.tm1637Create(Connected.DigitalRJPin.J5)
    while (input.runningTime() < endCountdown) {
        digits.showNumber(Math.round((endCountdown - input.runningTime()) / 1000 * 2))
        basic.pause(20)
        laserBreaks2 = laserScan()
        if (laserBreaks2[1]) {
            if (thisPosition == "H") {
                thisPosition = "I"
                radioSay("I", "Step", true)
            } else {
                thisPosition = "H"
                radioSay("H", "Step", true)
            }
            basic.pause(1000)
        }
    }
    winner = false
    if (thisPosition == minePosition) {
        if (thisPosition == "H") {
            radioSay("H", "Mine", true)
        } else {
            radioSay("I", "Mine", true)
        }
    } else {
        winner = true
        if (thisPosition == "H") {
            radioSay("H", "Win", true)
        } else {
            radioSay("I", "Win", true)
        }
    }
    return winner
}
function runIntro () {
    pins.digitalWritePin(DigitalPin.P5, 1)
    basic.pause(500)
    theIntro = notLegos.getSoundString("Music", "Intro")
    introLength = parseFloat(theIntro.split("_")[3]) * 1000
    radioSay("Intro", convertToText(introLength), true)
    basic.pause(500)
    basic.pause(notLegos.playsFor(theIntro))
    politeVoice("0", true)
    politeVoice("1", true)
    politeVoice("2", true)
    radioSay("Intro", "4", true)
    readyInstructions = true
}
function readyToGo () {
    radioSay("Intro", "32", true)
    Connected.setVolume(0)
    if (firstRun) {
        Connected.folderPlay("05", "020")
        basic.pause(2000)
        firstRun = false
    } else {
        Connected.folderPlay("05", "023")
        basic.pause(2000)
    }
    radioSay("Intro", "33", true)
    basic.pause(2000)
    while (Connected.ultrasoundSensor(Connected.DigitalRJPin.P8, Connected.Distance_Unit_List.Distance_Unit_cm) >= 10) {
        Connected.showUserText(6, "waiting")
        basic.pause(400)
    }
    Connected.showUserText(6, "")
    radioSay("Intro", "34", true)
    return true
}
function stepOnD (theMines: string) {
    if (theMines.indexOf("D") >= 0) {
        passed = false
        radioSay("D", "Mine", true)
    } else {
        radioSay("D", "Step", true)
        awaitingStep = true
        basic.pause(1000)
        while (awaitingStep) {
            basic.pause(20)
            laserBreaks3 = laserScan()
            if (laserBreaks3[2]) {
                awaitingStep = false
                stepOnF(theMines)
            } else if (laserBreaks3[1]) {
                awaitingStep = false
                stepOnE(theMines)
            }
        }
    }
}
function gestureGo () {
    if (readyInstructions) {
        readyInstructions = false
        runInstructions()
    }
}
Connected.onGesture(Connected.GestureType.Forward, function () {
    Connected.showUserText(2, "gesture forward")
    gestureGo()
})
function runInstructions () {
    introGo = true
    readyInstructions = false
    voiceNo = 5
    for (let index = 0; index < 5; index++) {
        politeVoice("abc", true)
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "10", true)
        basic.pause(Math.min(0, notLegos.playsFor(notLegos.getSoundString("Voice", "10"))))
        digits = Connected.tm1637Create(Connected.DigitalRJPin.J5)
        for (let index4 = 0; index4 <= 4; index4++) {
            digits.showNumber(index4)
            basic.pause(60)
        }
        basic.pause(1000)
        for (let index42 = 0; index42 <= 4; index42++) {
            basic.pause(150)
            digits.showNumber(4 - index42)
            basic.pause(150)
        }
        basic.pause(0)
        digits.clear()
        basic.pause(1300)
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "11", true)
        basic.pause(Math.min(0, notLegos.playsFor(notLegos.getSoundString("Voice", "11"))))
        scoreCircle.clear()
        scoreCircle.setPixelColor(0, Connected.colors(Connected.NeoPixelColors.Red))
        scoreCircle.setPixelColor(1, theOrange)
        scoreCircle.setPixelColor(2, theYellow)
        scoreCircle.setPixelColor(3, Connected.colors(Connected.NeoPixelColors.Green))
        scoreCircle.show()
        for (let index = 0; index < 10; index++) {
            basic.pause(370)
            scoreCircle.rotate(1)
            scoreCircle.show()
        }
        scoreCircle.clear()
        scoreCircle.show()
        basic.pause(200)
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "12", true)
        scoreCircle.setPixelColor(4, Connected.colors(Connected.NeoPixelColors.Green))
        scoreCircle.show()
        basic.pause(notLegos.playsFor(notLegos.getSoundString("Voice", "12")))
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "13", true)
        scoreCircle.setPixelColor(5, theYellow)
        scoreCircle.show()
        basic.pause(notLegos.playsFor(notLegos.getSoundString("Voice", "13")))
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "14", true)
        scoreCircle.setPixelColor(6, theOrange)
        scoreCircle.show()
        basic.pause(notLegos.playsFor(notLegos.getSoundString("Voice", "14")))
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "15", true)
        scoreCircle.setPixelColor(7, Connected.colors(Connected.NeoPixelColors.Red))
        scoreCircle.show()
        basic.pause(notLegos.playsFor(notLegos.getSoundString("Voice", "15")))
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "16", true)
        basic.pause(notLegos.playsFor(notLegos.getSoundString("Voice", "16")))
        scoreCircle.showColor(Connected.colors(Connected.NeoPixelColors.Red))
        scoreCircle.show()
        basic.pause(2700)
        scoreCircle.clear()
        scoreCircle.show()
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "17", true)
        basic.pause(notLegos.playsFor(notLegos.getSoundString("Voice", "17")))
    }
    if (checkNoPlayer()) {
        radioSay("Intro", "18", true)
        basic.pause(notLegos.playsFor(notLegos.getSoundString("Voice", "18")))
        readyInstructions = true
    }
    radioSay("Intro", "19", true)
}
function printArray (toPrint: any[]) {
    lineCount = toPrint.length
    Connected.oledClear()
    Connected.showUserNumber(8, lineCount)
    if (lineCount > 0) {
        for (let thisLine = 0; thisLine <= lineCount - 1; thisLine++) {
            Connected.showUserText(thisLine + 1, toPrint[thisLine])
        }
    } else {
        Connected.showUserText(1, "[Empty]")
    }
}
function startGame () {
    firstRun = true
    listenAbort = false
    listenGo = false
    listenIntro = false
    listenStart = false
    Connected.oledClear()
    gameOver = false
    minefields2 = generateMinefields()
    fieldScores = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
    for (let minefieldIndex = 0; minefieldIndex <= 7; minefieldIndex++) {
        showScoreCircle(fieldScores)
        if (debug) {
            Connected.showUserText(1, "mines: " + minefields2[minefieldIndex])
        }
        radioSay("m" + minefields2[minefieldIndex], convertToText(minefieldIndex), true)
        if (!(gameOver)) {
            fieldScores[minefieldIndex] = runField(minefields2[minefieldIndex])
        }
        if (fieldScores[minefieldIndex] == 0) {
            gameOver = true
        }
    }
    showScoreCircle(fieldScores)
    if (gameOver) {
        lostSequence(fieldScores)
    } else {
        wonSequence(fieldScores)
    }
}
function tryField (theMines: string) {
    passed = true
    reachedFinalRow = false
    stepOnA(theMines)
    return passed
}
function politeVoice (trackNo: string, doPause: boolean) {
    if (checkNoPlayer()) {
        radioSay("Intro", trackNo, true)
        if (doPause) {
            basic.pause(notLegos.playsFor(notLegos.getSoundString("Voice", trackNo)))
        } else {
            basic.pause(Math.min(0, notLegos.playsFor(notLegos.getSoundString("Voice", trackNo))))
        }
    }
}
function radioSay (Space: string, Effect: string, Debug: boolean) {
    sendString = "" + btToken + Space
    if (Space.length == 1) {
        if (Effect == "Step") {
            sendValue = 1
        } else if (Effect == "Indicate") {
            sendValue = 2
        } else if (Effect == "Mine") {
            sendValue = 3
        } else if (Effect == "Win") {
            sendValue = 4
        } else {
        	
        }
    } else {
        sendValue = parseFloat(Effect)
    }
    radio.sendValue(sendString, sendValue)
    if (Debug) {
        Connected.showUserText(8, "" + Space + Effect)
    } else {
        basic.pause(30)
    }
}
function stepOnA (theMines: string) {
    radioSay("A", "Step", true)
    awaitingStep = readyToGo()
    basic.pause(500)
    while (awaitingStep) {
        basic.pause(20)
        laserBreaks4 = laserScan()
        if (laserBreaks4[2]) {
            awaitingStep = false
            stepOnC(theMines)
        } else if (laserBreaks4[0]) {
            awaitingStep = false
            stepOnB(theMines)
        }
    }
}
function stepOnB (theMines: string) {
    if (theMines.indexOf("B") >= 0) {
        passed = false
        radioSay("B", "Mine", true)
    } else {
        radioSay("B", "Step", true)
        awaitingStep = true
        basic.pause(1000)
        while (awaitingStep) {
            basic.pause(20)
            laserBreaks5 = laserScan()
            if (laserBreaks5[2]) {
                awaitingStep = false
                stepOnD(theMines)
            }
        }
    }
}
Connected.onGesture(Connected.GestureType.Backward, function () {
    Connected.showUserText(2, "gesture back")
    gestureGo()
})
function generateMinefields () {
    masterAvoidList2 = "CEH_CEI_CFH_CFI_BDH_BDI_BGH_BGI".split("_")
    listOut2 = ["temp"]
    while (masterAvoidList2.length > 0) {
        thisItem = masterAvoidList2._pickRandom()
        listOut2.push(thisItem)
        masterAvoidList2.removeAt(masterAvoidList2.indexOf(thisItem))
    }
    listOut2.shift()
    return listOut2
}
function stepOnE (theMines: string) {
    if (theMines.indexOf("E") >= 0) {
        passed = false
        radioSay("E", "Mine", true)
    } else {
        radioSay("E", "Step", true)
        awaitingStep = true
        basic.pause(1000)
        while (awaitingStep) {
            basic.pause(20)
            laserBreaks6 = laserScan()
            if (laserBreaks6[1]) {
                awaitingStep = false
                stepOnD(theMines)
            } else if (laserBreaks6[0]) {
                awaitingStep = false
                stepOnG(theMines)
            }
        }
    }
}
function wonSequence (fieldScores: any[]) {
    digitsClear()
    readyInstructions = false
    radioSay("Won", "0", true)
    Connected.oledClear()
    Connected.showUserText(1, "WINNER!")
}
function stepOnG (theMines: string) {
    if (theMines.indexOf("G") >= 0) {
        passed = false
        radioSay("G", "Mine", true)
    } else {
        radioSay("G", "Step", true)
        awaitingStep = true
        basic.pause(1000)
        while (awaitingStep) {
            basic.pause(20)
            laserBreaks7 = laserScan()
            if (laserBreaks7[2]) {
                awaitingStep = false
                radioSay("I", "Step", true)
                passed = tryFinalRow("I", theMines.charAt(2))
            }
        }
    }
}
function stepOnC (theMines: string) {
    if (theMines.indexOf("C") >= 0) {
        passed = false
        radioSay("C", "Mine", true)
    } else {
        radioSay("C", "Step", true)
        awaitingStep = true
        basic.pause(1000)
        while (awaitingStep) {
            basic.pause(20)
            laserBreaks8 = laserScan()
            if (laserBreaks8[0]) {
                awaitingStep = false
                stepOnE(theMines)
            }
        }
    }
}
function stepOnF (theMines: string) {
    if (theMines.indexOf("F") >= 0) {
        passed = false
        radioSay("F", "Mine", true)
    } else {
        radioSay("F", "Step", true)
        awaitingStep = true
        basic.pause(1000)
        while (awaitingStep) {
            basic.pause(20)
            laserBreaks9 = laserScan()
            if (laserBreaks9[0]) {
                awaitingStep = false
                radioSay("H", "Step", true)
                passed = tryFinalRow("H", theMines.charAt(2))
            }
        }
    }
}
Connected.onGesture(Connected.GestureType.Left, function () {
    Connected.showUserText(2, "gesture left")
    gestureGo()
})
radio.onReceivedValue(function (name, value) {
    if (name.substr(0, btToken.length) == btToken) {
        instruction = name.substr(btToken.length, name.length - btToken.length)
        if (instruction == "Intro") {
            if (value == 1) {
            	
            } else if (value == 2) {
            	
            }
        }
    }
})
Connected.onGesture(Connected.GestureType.Up, function () {
    Connected.showUserText(2, "gesture up")
    gestureGo()
})
function runField (theMines: string) {
    passed4 = false
    tries = 4
    digits = Connected.tm1637Create(Connected.DigitalRJPin.J5)
    while (!(passed4) && tries > 0) {
        digits.showNumber(tries)
        passed4 = tryField(theMines)
        if (!(passed4)) {
            tries = tries - 1
        }
        basic.pause(500)
    }
    digits.showNumber(tries)
    return tries
}
function laserScan () {
    laserL = pins.analogReadPin(AnalogReadWritePin.P1)
    laserR = pins.analogReadPin(AnalogReadWritePin.P0)
    laserC = pins.analogReadPin(AnalogReadWritePin.P2)
    if (debug) {
        Connected.showUserText(8, "L" + laserL + ("C" + laserC) + ("R" + laserR))
    }
    return [laserL < limitL, laserC < limitC, laserR < limitR]
}
function lostSequence (fieldScores: any[]) {
    radioSay("Lost", "0", true)
    scoreCircle.clear()
    scoreCircle.show()
    digitsClear()
    readyInstructions = false
    Connected.oledClear()
    Connected.showUserText(1, "GAME OVER")
}
Connected.onGesture(Connected.GestureType.Right, function () {
    Connected.showUserText(2, "gesture right")
    gestureGo()
})
function showScoreCircle (fieldScores: number[]) {
    scoreColors = []
    for (let scoreIndex2 = 0; scoreIndex2 <= 7; scoreIndex2++) {
        if (fieldScores[scoreIndex2] == 0) {
            scoreColors.push(Connected.colors(Connected.NeoPixelColors.Black))
        } else if (fieldScores[scoreIndex2] == 1) {
            scoreColors.push(Connected.colors(Connected.NeoPixelColors.Red))
        } else if (fieldScores[scoreIndex2] == 2) {
            scoreColors.push(theOrange)
        } else if (fieldScores[scoreIndex2] == 3) {
            scoreColors.push(theYellow)
        } else if (fieldScores[scoreIndex2] == 4) {
            scoreColors.push(Connected.colors(Connected.NeoPixelColors.Green))
        }
    }
    scoreCircle.setPixelColor(4, scoreColors[0])
    scoreCircle.setPixelColor(5, scoreColors[1])
    scoreCircle.setPixelColor(6, scoreColors[2])
    scoreCircle.setPixelColor(7, scoreColors[3])
    scoreCircle.setPixelColor(0, scoreColors[4])
    scoreCircle.setPixelColor(1, scoreColors[5])
    scoreCircle.setPixelColor(2, scoreColors[6])
    scoreCircle.setPixelColor(3, scoreColors[7])
    scoreCircle.show()
}
Connected.onGesture(Connected.GestureType.Down, function () {
    Connected.showUserText(2, "gesture down")
    gestureGo()
})
function checkNoPlayer () {
    Connected.showUserNumber(3, Connected.readColor())
    return isNearly(backgroundColor, Math.round(Connected.readColor()), 2)
}
let lastRead = 0
let thisRead = 0
let scoreColors: number[] = []
let laserC = 0
let laserR = 0
let laserL = 0
let tries = 0
let passed4 = false
let instruction = ""
let laserBreaks9: boolean[] = []
let laserBreaks8: boolean[] = []
let laserBreaks7: boolean[] = []
let laserBreaks6: boolean[] = []
let thisItem = ""
let listOut2: string[] = []
let masterAvoidList2: string[] = []
let laserBreaks5: boolean[] = []
let laserBreaks4: boolean[] = []
let sendValue = 0
let sendString = ""
let reachedFinalRow = false
let fieldScores: number[] = []
let minefields2: string[] = []
let gameOver = false
let listenStart = false
let listenIntro = false
let listenGo = false
let listenAbort = false
let lineCount = 0
let voiceNo = 0
let introGo = false
let laserBreaks3: boolean[] = []
let awaitingStep = false
let passed = false
let firstRun = false
let introLength = 0
let theIntro = ""
let winner = false
let laserBreaks2: boolean[] = []
let endCountdown = 0
let beginCountdown = 0
let thisPosition = ""
let finalRowCountdown = 0
let readyInstructions = false
let thisColor = 0
let thePlayer = ""
let digits: Connected.TM1637LEDs = null
let backgroundColor = 0
let colorReads: number[] = []
let scoreCircle: Connected.Strip = null
let theYellow = 0
let theOrange = 0
let debug = false
let limitL = 0
let limitR = 0
let limitC = 0
let btToken = ""
let listOut: number[] = []
let masterAvoidList: number[] = []
let minefields: number[] = []
let thisLength = ""
let thisVolume = ""
let thisFile = ""
let thisFolder = ""
let laserBreaks: number[] = []
let musicToPlay = ""
let soundToPlay = ""
let theSeries = ""
let fieldIndex2 = 0
let introRunning = false
let buttonBlock = false
let isReady = false
led.enable(false)
pins.setAudioPinEnabled(false)
pins.digitalWritePin(DigitalPin.P5, 0)
Connected.MP3SetPort(Connected.DigitalRJPin.P14)
Connected.execute(Connected.playType.Stop)
Connected.MP3SetPort(Connected.DigitalRJPin.P15)
Connected.execute(Connected.playType.Stop)
Connected.MP3SetPort(Connected.DigitalRJPin.P16)
Connected.execute(Connected.playType.Stop)
notLegos.potSet(AnalogPin.P10)
notLegos.mp3setPorts(SerialPin.P14)
notLegos.mp3setPorts(SerialPin.P15)
notLegos.mp3setPorts(SerialPin.P16)
notLegos.setSounds("Mario")
btToken = "KC$"
limitC = 80
limitR = 80
limitL = 90
debug = true
let awaitingPlayer = true
let btGroup = 171
theOrange = Connected.rgb(255, 80, 0)
theYellow = Connected.rgb(139, 128, 0)
radio.setGroup(btGroup)
scoreCircle = Connected.create(Connected.DigitalRJPin.P13, 8, Connected.NeoPixelMode.RGB)
scoreCircle.clear()
scoreCircle.show()
digitsClear()
colorReads = [0, 0]
backgroundColor = 135
Connected.oledClear()
for (let index = 0; index < 0; index++) {
    while (true) {
        Connected.showUserNumber(5, Connected.readColor())
        basic.pause(100)
    }
}
for (let index = 0; index < 0; index++) {
    runInstructions()
}
for (let index = 0; index < 1; index++) {
    runIntro()
    awaitPlayer()
}
loops.everyInterval(250, function () {
    thisRead = notLegos.potRead()
    if (!(isNearly(lastRead, thisRead, 0.005))) {
        notLegos.updateVolume()
    }
    lastRead = thisRead
})
