export default {
  "sampleCode" : `// Junk robot PXT JS code...
let robot: junkrobot.Robot = null
let sideSensor = junkrobot.ping(DigitalPin.P16, DigitalPin.P19)
let frontSensor = junkrobot.ping(DigitalPin.P5, DigitalPin.P20)
let sideThreshold = 36
let frontThreshold = 26
robot = junkrobot.createRobot(junkrobot.createMotor(
    DigitalPin.P8,
    DigitalPin.P9,
    DigitalPin.P10,
    DigitalPin.P11
), junkrobot.createMotor(
        DigitalPin.P12,
        DigitalPin.P13,
        DigitalPin.P14,
        DigitalPin.P15
    ))

while (true) {
  if(sideSensor > sideThreshold) {
    robot.turnRight()
    robot.moveForward(150)
  } else if(sideSensor < sideThreshold && frontSensor > frontThreshold){
    robot.moveForward(150)
  } else if(sideSensor < sideThreshold && frontSensor < frontThreshold){
    robot.turnLeft()
  }
}

for(let i = 0; i < 4; i++){
    robot.turnRight()
    robot.moveForward(300)
    robot.turnLeft()
    robot.moveForward(150)
    robot.turnLeft()
    robot.moveForward(300)
    robot.turnRight()
    robot.moveForward(300)
    robot.turnRight()
    robot.moveForward(600)
    robot.turnRight()
    robot.moveForward(450)
    robot.turnLeft()
    robot.moveForward(150)
    robot.turnLeft()
    robot.moveForward(450)
    robot.turnRight()
    robot.turnRight()
    robot.moveForward(450)
    robot.turnRight()
    robot.moveForward(150)
    robot.turnRight()
    robot.moveForward(450)
    robot.turnLeft()
    robot.moveForward(600)
    robot.turnLeft()
    robot.moveForward(300)
    robot.turnLeft()
    robot.moveForward(300)
    robot.turnRight()
    robot.moveForward(150)
    robot.turnRight()
    robot.moveForward(300)
    robot.turnRight()
  }
}
`;

    }
}