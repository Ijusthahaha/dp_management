<script lang="ts" setup>
import {Avatar, Headset, UserFilled} from "@element-plus/icons-vue";
import {getTopDpStudents, getTopDpTeachers} from "~/utils/fetch";
import * as PIXI from 'pixi.js'
import {Assets, Container, Graphics, Sprite} from 'pixi.js'
import {ElMessageBox} from "element-plus";

const store = useUserStore()
const isIconAnimation = ref(false)
const isGamePlay = ref(false)

const segmentedOptions = [
  {value: "Student", label: "Student", icon: UserFilled},
  {value: "Teacher", label: "Teacher", icon: Avatar}
]
const segmentedValue = ref('Student')
const leaderboardTable = ref()
const isGameFirstLoad = ref(true)

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  watch(segmentedValue, () => {
    if (segmentedValue.value === "Student") {
      getTopDpStudents(store.jwt).then(d => {
        leaderboardTable.value = d.data.data
      })
    } else {
      getTopDpTeachers(store.jwt).then(d => {
        leaderboardTable.value = d.data.data
      })
    }
  }, {immediate: true})

  checkCollisions();
  requestAnimationFrame(checkKeyPress);
})

const gameContainer = ref<HTMLDivElement>()
let _BLUE_GROUP: Container | null = null;
let _RED_GROUP: Container | null = null;
let _BLUE_PENCIL: Container | null = null;
let _RED_PENCIL: Container | null = null;
let _BLUE_HEART_TEXT: PIXI.Text | null = null;
let _RED_HEART_TEXT: PIXI.Text | null = null;
let _APP_WIDTH: number = 0;
let isBlueJumping = false;
let isRedJumping = false;
let isGameStarted = false

interface KeysPressed {
  [key: string]: boolean;
}

const keysPressed: KeysPressed = {
  KeyA: false,
  KeyD: false,
  Space: false,
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ShiftLeft: false,
  ShiftRight: false,
};
const handleKeyDown = (event: KeyboardEvent) => {
  if (isGamePlay.value) {
    if (keysPressed.hasOwnProperty(event.code)) {
      keysPressed[event.code] = true;
    }
    if (event.code === 'ShiftLeft') {
      brandishPencil('blue');
    }
    if (event.code === 'ShiftRight') {
      brandishPencil('red');
    }
  }
};
const handleKeyUp = (event: KeyboardEvent) => {
  if (keysPressed.hasOwnProperty(event.code)) {
    keysPressed[event.code] = false;
  }
};
const checkKeyPress = () => {
  handleKeyPress();
  requestAnimationFrame(checkKeyPress);
}

let isBrandishingBlue = false;
let isBrandishingRed = false;
const brandishPencil = (color: 'blue' | 'red') => {
  const pencil = color === 'blue' ? _BLUE_PENCIL : _RED_PENCIL;
  const rotationAngle = Math.PI / 6; // Adjust the rotation angle as needed
  const brandishDuration = 200; // Duration of the brandish animation in milliseconds
  const brandishSteps = 10; // Number of steps in the animation

  if ((color === 'blue' && isBrandishingBlue) || (color === 'red' && isBrandishingRed)) {
    return;
  }

  if (pencil) {
    const originalRotation = pencil.rotation;
    let step = 0;

    const brandishInterval = setInterval(() => {
      let currentRotation;
      if (color === 'blue') {
        currentRotation = originalRotation + rotationAngle * Math.sin(step / brandishSteps * Math.PI);
      } else {
        currentRotation = originalRotation - rotationAngle * Math.sin(step / brandishSteps * Math.PI);
      }
      pencil.rotation = currentRotation;

      step++;
      if (step >= brandishSteps) {
        clearInterval(brandishInterval);
        pencil.rotation = originalRotation; // Reset rotation to original after brandish
        if (color === 'blue') {
          isBrandishingBlue = false;
        } else {
          isBrandishingRed = false;
        }
      }
    }, brandishDuration / brandishSteps);

    // Set brandishing flag to true for the respective color
    if (color === 'blue') {
      isBrandishingBlue = true;
    } else {
      isBrandishingRed = true;
    }
  }
};
const CHARACTER_SIZE = {
  width: 660,
  height: 540
}
const HEART_SIZE = {
  width: 420,
  height: 660
}
const PENCIL_SIZE = {
  width: 180,
  height: 480
}
const HEART_TEXT = {
  blue: 200,
  red: 200
}
const handleKeyPress = () => {
  if (isGamePlay.value) {
    if (keysPressed['KeyA']) {
      moveCharacter('left');
    }
    if (keysPressed['KeyD']) {
      moveCharacter('right');
    }
    if (keysPressed['Space']) {
      jump("blue");
    }
    if (keysPressed['ArrowLeft']) {
      moveRedGroup('left');
    }
    if (keysPressed['ArrowRight']) {
      moveRedGroup('right');
    }
    if (keysPressed['ArrowUp']) {
      jump("red");
    }
  }
};

const moveCharacter = (direction: string) => {
  const step = 10; // Adjust this value for the desired movement speed
  if (_BLUE_GROUP) {
    if (direction === 'left') {
      if (_BLUE_GROUP.x - step < 0) return
      _BLUE_GROUP.x -= step;
    } else {
      if (_BLUE_GROUP.x + step > _APP_WIDTH) return
      _BLUE_GROUP.x += step;
    }
  }
};

const moveRedGroup = (direction: string) => {
  const step = 10; // Adjust this value for the desired movement speed
  if (_RED_GROUP) {
    if (direction === 'left') {
      if (_RED_GROUP.x - step < 0) return
      _RED_GROUP.x -= step;
    } else {
      if (_RED_GROUP.x + step > _APP_WIDTH) return
      _RED_GROUP.x += step;
    }
  }
};

const jump = (color: "blue" | "red") => {
  const jumpHeight = 100; // Adjust this value for the desired jump height

  if (color === "blue" && _BLUE_GROUP && !isBlueJumping) {
    isBlueJumping = true;
    const originalY = _BLUE_GROUP.y;
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
      _BLUE_GROUP!.y -= 10;
      jumpCount += 10;
      if (jumpCount >= jumpHeight) {
        clearInterval(jumpInterval);
        const fallInterval = setInterval(() => {
          _BLUE_GROUP!.y += 10;
          if (_BLUE_GROUP!.y >= originalY) {
            _BLUE_GROUP!.y = originalY;
            clearInterval(fallInterval);
            isBlueJumping = false;
          }
        }, 30);
      }
    }, 30);
  } else if (color === "red" && _RED_GROUP && !isRedJumping) {
    isRedJumping = true;
    const originalY = _RED_GROUP.y;
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
      _RED_GROUP!.y -= 10;
      jumpCount += 10;
      if (jumpCount >= jumpHeight) {
        clearInterval(jumpInterval);
        const fallInterval = setInterval(() => {
          _RED_GROUP!.y += 10;
          if (_RED_GROUP!.y >= originalY) {
            _RED_GROUP!.y = originalY;
            clearInterval(fallInterval);
            isRedJumping = false;
          }
        }, 30);
      }
    }, 30);
  }
};

const updateHeartText = (color: "red" | "blue", text: number) => {
  if (HEART_TEXT.blue <= 0 || HEART_TEXT.red <= 0) {
    if (HEART_TEXT.blue <= 0) {
      ElMessageBox.alert("Congratulation!", "Red Won!", {
        confirmButtonText: "Again"
      })
    } else {
      ElMessageBox.alert("Congratulation!", "Blue Won!", {
        confirmButtonText: "Again"
      })
    }
    HEART_TEXT.blue = 200
    HEART_TEXT.red = 200
    isGameStarted = false
    return
  }

  if (!isGameStarted) return
  if (color === "blue") {
    HEART_TEXT.blue = HEART_TEXT.blue + text
    if (_BLUE_HEART_TEXT) {
      _BLUE_HEART_TEXT.text = HEART_TEXT.blue.toString()
    }
    if (text < 0 && _BLUE_GROUP) {
      const originalX = _BLUE_GROUP.x;
      let knockbackDistance = 50; // Adjust the knockback distance as needed
      let startTime: number | null = null;

      const animateKnockback = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        let newPosition = originalX - Math.sin(progress / 100) * knockbackDistance;
        const minX = 0;
        const maxX = _APP_WIDTH - CHARACTER_SIZE.width / 6;
        newPosition = Math.max(minX, Math.min(newPosition, maxX));
        if (_BLUE_GROUP) {
          _BLUE_GROUP.x = newPosition;

          if (progress < 200) { // Adjust the duration of the knockback animation
            requestAnimationFrame(animateKnockback);
          }
        }
      }
      requestAnimationFrame(animateKnockback);
    }
  } else {
    HEART_TEXT.red = HEART_TEXT.red + text
    if (_RED_HEART_TEXT) {
      _RED_HEART_TEXT.text = HEART_TEXT.red.toString()
    }
    if (text < 0 && _RED_GROUP) {
      const originalX = _RED_GROUP.x;
      let knockbackDistance = 50; // Adjust the knockback distance as needed
      let startTime: number | null = null;

      const animateKnockback = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        let newPosition = originalX + Math.sin(progress / 100) * knockbackDistance;
        const minX = 0;
        const maxX = _APP_WIDTH - CHARACTER_SIZE.width / 6;
        newPosition = Math.max(minX, Math.min(newPosition, maxX));
        if (_RED_GROUP) {

          _RED_GROUP.x = newPosition;

          if (progress < 200) { // Adjust the duration of the knockback animation
            requestAnimationFrame(animateKnockback);
          }
        }
      };

      requestAnimationFrame(animateKnockback);
    }
  }
}
const detectCollision = () => {
  if (!_BLUE_PENCIL || !_BLUE_GROUP || !_RED_PENCIL || !_RED_GROUP) return
  const bluePencilBounds = _BLUE_PENCIL.getBounds();
  const redCharacterBounds = _RED_GROUP.getBounds();
  const redPencilBounds = _RED_PENCIL.getBounds();
  const blueCharacterBounds = _BLUE_GROUP.getBounds();

  if (
      isBrandishingBlue &&
      bluePencilBounds.x + bluePencilBounds.width >= redCharacterBounds.x &&
      bluePencilBounds.x <= redCharacterBounds.x + redCharacterBounds.width &&
      bluePencilBounds.y + bluePencilBounds.height >= redCharacterBounds.y &&
      bluePencilBounds.y <= redCharacterBounds.y + redCharacterBounds.height
  ) {
    updateHeartText("red", -1)
  }

  if (
      isBrandishingRed &&
      redPencilBounds.x + redPencilBounds.width >= blueCharacterBounds.x &&
      redPencilBounds.x <= blueCharacterBounds.x + blueCharacterBounds.width &&
      redPencilBounds.y + redPencilBounds.height >= blueCharacterBounds.y &&
      redPencilBounds.y <= blueCharacterBounds.y + blueCharacterBounds.height
  ) {
    updateHeartText("blue", -1)
  }
};

const checkCollisions = () => {
  detectCollision();
  requestAnimationFrame(checkCollisions);
};

const drawCanvas = async () => {
  const app = new PIXI.Application()
  await app.init({backgroundAlpha: 0, resizeTo: gameContainer.value})
  gameContainer.value?.appendChild(app.canvas)

  app.renderer.clear()
  // !IMPORTANT: Images by dotown.maeda-design-room.net

  if (isGameFirstLoad.value) {
    Assets.addBundle('BLUE_PNG', {
      BLUE_CHARACTER_PNG: "images/blue_character.png",
      BLUE_HEART_PNG: "images/blue_heart.png",
      BLUE_PENCIL_PNG: "images/blue_pencil.png"
    })
    Assets.addBundle("RED_PNG", {
      RED_CHARACTER_PNG: "images/red_character.png",
      RED_HEART_PNG: "images/red_heart.png",
      RED_PENCIL_PNG: "images/red_pencil.png",
    })
    isGameFirstLoad.value = false
  }

  const BLUE_PNG_LOADER = await Assets.loadBundle("BLUE_PNG")
  const RED_PNG_LOADER = await Assets.loadBundle("RED_PNG")

  const BASIC_LINE_HEIGHT = app.screen.height - 100
  const BLUE_GROUP = new Container()
  const RED_GROUP = new Container()

  app.stage.addChild(BLUE_GROUP)
  app.stage.addChild(RED_GROUP)

  _BLUE_GROUP = BLUE_GROUP
  _RED_GROUP = RED_GROUP
  _APP_WIDTH = app.screen.width - CHARACTER_SIZE.width / 6

  const BLUE_CHARACTER_PNG = Sprite.from(BLUE_PNG_LOADER.BLUE_CHARACTER_PNG)
  BLUE_CHARACTER_PNG.setSize(CHARACTER_SIZE.width / 6, CHARACTER_SIZE.height / 6)
  BLUE_CHARACTER_PNG.anchor.set(0, 1)
  BLUE_GROUP.addChild(BLUE_CHARACTER_PNG)

  const BLUE_HEART_PNG = Sprite.from(BLUE_PNG_LOADER.BLUE_HEART_PNG)
  BLUE_HEART_PNG.setSize(HEART_SIZE.width / 12, HEART_SIZE.height / 12)
  BLUE_HEART_PNG.anchor.set(0, 1)
  BLUE_HEART_PNG.y = -(CHARACTER_SIZE.height / 6)
  BLUE_GROUP.addChild(BLUE_HEART_PNG)

  const BLUE_HEART_TEXT = new PIXI.Text({
    text: HEART_TEXT.blue,
    style: {
      fontSize: 30,
      fill: 0xffffff
    }
  })
  BLUE_HEART_TEXT.anchor.set(0, 1)
  BLUE_HEART_TEXT.x = (BLUE_HEART_PNG.width)
  BLUE_HEART_TEXT.y = -(CHARACTER_SIZE.height / 6)
  BLUE_GROUP.addChild(BLUE_HEART_TEXT)

  const BLUE_PENCIL = Sprite.from(BLUE_PNG_LOADER.BLUE_PENCIL_PNG)
  BLUE_PENCIL.setSize(PENCIL_SIZE.width / 6, PENCIL_SIZE.height / 6)
  BLUE_PENCIL.anchor.set(0, 1)
  BLUE_PENCIL.x = (BLUE_CHARACTER_PNG.width - PENCIL_SIZE.width / 6)
  BLUE_PENCIL.skew.set(-0.25)
  BLUE_GROUP.addChild(BLUE_PENCIL)

  BLUE_GROUP.x = 0
  BLUE_GROUP.y = BASIC_LINE_HEIGHT

  const RED_CHARACTER_PNG = Sprite.from(RED_PNG_LOADER.RED_CHARACTER_PNG)
  RED_CHARACTER_PNG.setSize(CHARACTER_SIZE.width / 6, CHARACTER_SIZE.height / 6)
  RED_CHARACTER_PNG.anchor.set(0, 1)
  RED_GROUP.addChild(RED_CHARACTER_PNG)

  const RED_HEART_PNG = Sprite.from(RED_PNG_LOADER.RED_HEART_PNG)
  RED_HEART_PNG.setSize(HEART_SIZE.width / 12, HEART_SIZE.height / 12)
  RED_HEART_PNG.anchor.set(0, 1)
  RED_HEART_PNG.y = -(CHARACTER_SIZE.height / 6)
  RED_GROUP.addChild(RED_HEART_PNG)

  const RED_HEART_TEXT = new PIXI.Text({
    text: HEART_TEXT.red,
    style: {
      fontSize: 30,
      fill: 0xffffff
    }
  })
  RED_HEART_TEXT.anchor.set(0, 1)
  RED_HEART_TEXT.x = (RED_HEART_PNG.width)
  RED_HEART_TEXT.y = -(CHARACTER_SIZE.height / 6)
  RED_GROUP.addChild(RED_HEART_TEXT)

  const RED_PENCIL = Sprite.from(RED_PNG_LOADER.RED_PENCIL_PNG)
  RED_PENCIL.setSize(PENCIL_SIZE.width / 6, PENCIL_SIZE.height / 6)
  RED_PENCIL.anchor.set(0, 1)
  RED_PENCIL.x = 0
  RED_PENCIL.skew.set(0.25)
  RED_GROUP.addChild(RED_PENCIL)

  RED_GROUP.x = app.screen.width - 100
  RED_GROUP.y = BASIC_LINE_HEIGHT

  _BLUE_PENCIL = BLUE_PENCIL
  _RED_PENCIL = RED_PENCIL
  _RED_HEART_TEXT = RED_HEART_TEXT
  _BLUE_HEART_TEXT = BLUE_HEART_TEXT

  const BASIC_LINE = new Graphics()
      .moveTo(0, BASIC_LINE_HEIGHT)
      .lineTo(app.screen.width, BASIC_LINE_HEIGHT)
      .stroke({width: 4, color: 0xffffff})
  app.stage.addChild(BASIC_LINE)

  isGameStarted = true
}
watch(isGamePlay, () => {
  if (isGamePlay.value) nextTick(() => {
    drawCanvas()
  })
})
</script>

<template>
  <div>
    <div class="container">
      <div class="title">
        <h1>DP Leaderboard</h1>
        <el-text size="large">Display the teachers who dispatched the most DPs to students and the students who were
          given
          the most DPs.
        </el-text>
      </div>
      <div v-if="!isGamePlay">
        <el-segmented v-model="segmentedValue" :options="segmentedOptions" size="large">
          <template #default="{ item }">
            <div class="segmentedItem">
              <el-icon size="20">
                <component :is="item.icon"/>
              </el-icon>
              <div>{{ item.label }}</div>
            </div>
          </template>
        </el-segmented>
        <div class="leaderboard">
          <el-table :data="leaderboardTable" style="width: 100%">
            <el-table-column label="Ranking" type="index" width="100"/>
            <el-table-column label="Name" property="name"/>
            <el-table-column label="Total DP" property="total_dp"/>
          </el-table>
        </div>
      </div>

      <div v-else ref="gameContainer" class="gameContainer">

      </div>
    </div>

    <div class="offsetButton">
      <el-icon :class="isIconAnimation? 'is-loading' : ''" color="#409efc" size="40" title="Play a game!"
               @click="isGamePlay = !isGamePlay" @mouseenter="isIconAnimation = true"
               @mouseleave="isIconAnimation = false">
        <Headset/>
      </el-icon>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  overflow-y: hidden;
}

.segmentedItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.title, .title * {
  margin-bottom: 16px;
}

.leaderboard {
  margin-top: 16px;
  border: 1px solid white;
  border-radius: 8px;
  width: 100%;
  padding: 16px;
}

.offsetButton {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 75px;
  width: 75px;
  background-color: #303030;
  border: 4px solid white;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);
  z-index: 100;
  cursor: pointer;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gameContainer {
  width: 100%;
  height: 95%;
}
</style>