'use strict';
// window.onload because it is most supported.
window.onload = function() {
  const select = document.getElementById('number-of-dice');
  const diceContainer = document.getElementById('dice-container');

/*== GAME MODE START ==*/
  let state = {
    gameMode: false,
    master: [],
    current: [],
    currentColor: [],
    score: 0,
    movesLeft: 20,
    numberCombo: 3,
    colorCombo: 1,
    multiplier: 1,
    colorMultiplier: 1
  };
/*== GAME MODE END ==*/

  // Limit options to 2 if on mobile.
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    generateOptions(2);
  } else {
    generateOptions(16);
  }

  // Check if shake is supported or not.
  if (!("ondevicemotion" in window)) {
    alert("Shake Not Supported");
    // shakeEvent.stop();
  } else {
    // Listen to shake event.
    var shakeEvent = new Shake({threshold: 4});
    shakeEvent.start();
  }

  // FUNCTIONS init, generateOptions, toggleOffExcept, generateDice:
  function init(x) {
    generateDice(x);
  }

  function generateOptions(num) {
    for (let i = 1; i <= num; i++) {
      const optionDiv = document.createElement('option');
      optionDiv.setAttribute('value', i);
      optionDiv.innerText = i;
      select.appendChild(optionDiv);
    }
  }

  function toggleOffExcept(x, arr) {
    for (let i = 0; i < arr.length; i++) {
      const faceNum = parseInt(arr[i].id.split("-")[1], 10);
      const faceNode = document.getElementById(`${[arr[i].id]}`);

      if (x === faceNum) {
        faceNode.style.display = 'flex';
        faceNode.parentElement.setAttribute('value', x);
      } else {
        faceNode.style.display = 'none';
      }
    }
  }

  function generateDice(num) {
    const colorArr = ['crimson', 'forestgreen', 'mediumblue', 'darkviolet', 'orangered', 'orange'];
    let
      add = 1,
      count = 1,
      randColor = 0;

    // Create 'x' number of dice from the user input.
    for (let i = 1; i <= num; i++) {
      if (i > 1) add += 6;
      randColor = Math.floor((Math.random() * 10) % 7);

      // 'x' number of dice.
      let mainDiv = document.createElement('div');
      mainDiv.id = `dice-${add}`;
      mainDiv.className = 'dice';
      mainDiv.setAttribute('style',`background-color: ${colorArr[randColor]}`);
      mainDiv.setAttribute('value', 1);

      // Create the 6 dice faces.
      for (let j = 1; j <= 6; j++) {
        // Six dice faces.
        let subDiv = document.createElement('div');
        subDiv.id = `face${count}-${j}`;

        // Add dice face group HTML to specific face number.
        switch(j) {
          case 1:
            subDiv.className = 'one';
            subDiv.innerHTML = (`
              <div class="dot"></div>`);
            break;
          case 2:
            subDiv.className = 'two';
            subDiv.innerHTML = (`
              <div class="dot"></div>
              <div class="dot last"></div>`);
            break;
          case 3:
            subDiv.className = 'three';
            subDiv.innerHTML = (`
              <div class="dot"></div>
              <div class="dot mid"></div>
              <div class="dot last"></div>`);
            break;
          case 4:
            subDiv.className = 'four';
            subDiv.innerHTML = (`
              <div class="col1">
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              <div class="col2">
                <div class="dot"></div>
                <div class="dot"></div>
              </div>`);
            break;
          case 5:
            subDiv.className = 'five';
            subDiv.innerHTML = (`
              <div class="col1">
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              <div class="col2">
                <div class="dot"></div>
              </div>
              <div class="col3">
                <div class="dot"></div>
                <div class="dot"></div>
              </div>`);
            break;
          case 6:
            subDiv.className = 'six';
            subDiv.innerHTML = (`
              <div class="col1">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              <div class="col2">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>`);
            break;
          default:
            console.error('Error in generateDice function.');
            break;
        }
        // Append dice face group to dice iteration.
        mainDiv.appendChild(subDiv);
      }
      // Append 'x' dices to dice container.
      diceContainer.appendChild(mainDiv);
      count++;
    }

    const diceFace = diceContainer.childNodes;
    // Attach Event Listeners for each child dice in dice-container:
    diceFace.forEach(function(el, i) {
      diceFace[i].addEventListener('click', function(e) {
        const diceId = e.target.id;
        const childNodeArray = e.target.childNodes;
        let count = 0;

/*== GAME MODE START ==*/
        if (state.gameMode) {
          let value = diceFace[i].getAttribute('value');
          let color = diceFace[i].style.backgroundColor || 'crimson';

          let currentState = {
            value: value,
            color: color
          }

          gameFunction(currentState);
        }
/*== GAME MODE END ==*/

        // Change color after click
        randColor = _random_color();
        diceFace[i].setAttribute('style',`background-color: ${colorArr[randColor]}`);

        // Bounce effect
        diceFace[i].style.animation = 'bounce 0.4s';

        let timer = setInterval(function() {
          const fate = _dice_roll();
          toggleOffExcept(fate, childNodeArray);
          if (count >= 5) {
            clearInterval(timer);
            diceFace[i].style.animation = 'none';
          }
          count++;
        }, 25);

        // *** For C function _dice_roll(); and _random_color();
        // Another way of writing it provided that
        // you compiled the C script with:
        // -s NO_EXIT_RUNTIME=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall"]'
        // let res = Module.ccall(
        //   'dice_roll', // name of C function
        //   'number',         // return type
        //   null,             // argument type
        //   null              // arguments
        // );
      });
    });
  } // End of generateDice()

  // EVENT LISTENER ON <select>:
  select.addEventListener('change', function(e) {
    const index = e.target.selectedIndex;
    const numOfDice = parseInt(select[index].value, 10);

    diceContainer.innerHTML = '';
    // Function that refreshes the number of dice.
    init(numOfDice);

/*== GAME MODE START ==*/
    const rightDiv = document.getElementById('right');
    const legend = document.getElementById('legend');
    const title = document.querySelector('h1');

    if (numOfDice === 16) {
      title.innerText = 'Dice Mini-Game!';
      legend.style.display = 'block';
      rightDiv.style.display = 'flex';

      // Randomize each dice:
      diceContainer.childNodes.forEach(function(el) { el.click(); });
      state.gameMode = true;
    } else {
      title.innerText = 'Roll The Dice!';
      legend.style.display = 'none';
      rightDiv.style.display = 'none';
      state.gameMode = false;
    }
/*== GAME MODE END ==*/
  }, {passive: true});

  // EVENT LISTENER ON SHAKE-SHAKE-SHAKE
  window.addEventListener('shake', function() {
    diceContainer.childNodes.forEach(function(el, i) {
      diceContainer.childNodes[i].click();
    });
  }, false);

/*== GAME MODE START ==*/
  // TEMPORARY MINI GAME MODE WHEN 16 is selected.
  function gameFunction(num) {
    const movesLeft = document.getElementById('moves-left-value');
    const selectedValue = document.getElementById('selected-value');
    const comboZone = document.getElementById('combo-zone');
    const colorCombo = document.getElementById('color-combo');

    const currentVal = parseInt(num.value, 10);
    state.master.push(num);

    if (state.movesLeft <= 0) {
      // Game Over!
      diceContainer.childNodes.forEach(function(el) {
        el.removeEventListener('click', function() {
        }, false);
      });
      console.log("Game Over!\n Your Score is: ", state.score);
    } else if (state.current.length === 0) {

      state.current.push(num);
      state.currentColor.push(num.color);
      selectedValue.innerText = currentVal + ' ';

    } else if (currentVal === parseInt(state.current[state.current.length - 1].value, 10)) {

      console.log('Match on ' + num.value);
      selectedValue.innerText += currentVal + ' ';

      // Color checker:
      if (state.currentColor[state.currentColor.length - 1] === num.color) {
        state.currentColor.push(num.color);
        console.log(state.currentColor);

        if (state.currentColor.length > state.colorCombo) {
          state.colorMultiplier = 4;
          colorCombo.innerText = 'x4';
        } else {
          state.colorMultiplier = 1;
          colorCombo.innerText = 'x1';
        }

      } else {
        state.colorMultiplier = 1;
        colorCombo.innerText = 'x1';
        state.currentColor = [];
        state.currentColor.push(num.color);
      }

      // Number checker:
      if (state.current.length >= 1) {
        if (state.current.length >= state.numberCombo) {
          state.multiplier = 2;
          state.score = state.score + ( 1 * (state.multiplier * state.colorMultiplier));
          comboZone.innerText = 'x2';
        } else {
          state.multiplier = 1;
          state.score++;
          comboZone.innerText = 'x1';
        }
        document.getElementById('score-value').innerText = state.score;
      }

      state.current.push(num);

    } else if (currentVal !== parseInt(state.current[state.current.length - 1].value, 10)) {

      console.log('Match broken :(\nStarting again at ', num.value);
      selectedValue.innerText = '';
      selectedValue.innerText = currentVal + ' ';

      state.current = [];
      state.current.push(num);
      state.movesLeft--;
      movesLeft.innerText = state.movesLeft;
    }

    // Master and Current State:
    // console.log("state.current", state.current);
    // console.log("state.master", state.master);
  }
/*== GAME MODE END ==*/

  // Initializer(s).
  init(1);
}
