export default {
  "sampleCode" : `// Junk robot PXT JS code...
let robot: junkrobot.Robot = null
robot = junkrobot.createRobot(junkrobot.createMotor(
    DigitalPin.P1,
    DigitalPin.P7,
    DigitalPin.P6,
    DigitalPin.P0
), junkrobot.createMotor(
        DigitalPin.P2,
        DigitalPin.P13,
        DigitalPin.P14,
        DigitalPin.P15
    ))

let sideSensor = junkrobot.ping(DigitalPin.P12, DigitalPin.P16)
let frontSensor = junkrobot.ping(DigitalPin.P8, DigitalPin.P9)
let sideThreshold = 36
let frontThreshold = 26

// Type or Paste code here
`,
    }
}
