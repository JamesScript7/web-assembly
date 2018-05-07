'use strict';
// window.onload because it is most supported.
window.onload = function() {
  const select = document.getElementById('number-of-dice');
  const diceContainer = document.getElementById('dice-container');
  let gameMode = false;

  let state = {
    points: []
  };

  // Check if shake is supported or not.
  if (!("ondevicemotion" in window)) {
    alert("Shake Not Supported");
    // shakeEvent.stop();
  } else {
    // Listen to shake event
    var shakeEvent = new Shake({threshold: 5});
    shakeEvent.start();
  }

  // Limit options to 2 if on mobile.
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    generateOptions(2);
  } else {
    generateOptions(20);
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
      const faceNum = parseInt(arr[i].id.split("-")[1]);
      const faceNode = document.getElementById(`${[arr[i].id]}`);
      if (x === faceNum) {
        faceNode.style.display = 'flex';
        faceNode.parentElement.setAttribute('value', x);
      }
      else {
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
      mainDiv.setAttribute('value', 1);
      mainDiv.setAttribute('style',`background-color: ${colorArr[randColor]}`);

      // Create the 6 dice faces.
      for (let i = 1; i <= 6; i++) {
        // Six dice faces.
        let subDiv = document.createElement('div');
        subDiv.id = `face${count}-${i}`;

        // Add dice face group HTML to specific face number.
        switch(i) {
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

        // GAME MODE:
        if (gameMode) {
          gameFunction(diceFace[i].getAttribute('value'));
        }

        // Change color after click
        randColor = _random_color();
        diceFace[i].setAttribute('style',`background-color: ${colorArr[randColor]}`);

        // Bounce effect
        diceFace[i].style.animation = 'bounce 0.4s';

        let timer = setInterval(function() {
          const fate = _dice_roll();
          toggleOffExcept(fate, childNodeArray);
          if (count >= 4) {
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
    const numOfDice = parseInt(select[index].value);

    // GAME MODE:
    const rightDiv = document.getElementById('right');
    const legend = document.getElementById('legend');
    const title = document.querySelector('h1');

    if (numOfDice === 16) {
      gameMode = true;
      rightDiv.style.display = 'flex';
      legend.style.display = 'block';
      title.innerText = 'Secret Dice Mini-Game!';
      console.log("G-G-G-Game Mode Initialized!");
    } else {
      gameMode = false;
      rightDiv.style.display = 'none';
      legend.style.display = 'none';
      title.innerText = 'Roll The Dice!';
    }

    diceContainer.innerHTML = '';
    // Function that refreshes the number of dice.
    init(numOfDice);
  }, {passive: true});

  // EVENT LISTENER ON SHAKE-SHAKE-SHAKE
  window.addEventListener('shake', function() {
    diceContainer.childNodes.forEach(function(el, i) {
      diceContainer.childNodes[i].click();
    });
  }, false);

  // TEMPORARY MINI GAME MODE WHEN 16 is selected.
  function gameFunction(num) {
    console.log(num, 'selected');
  }

  // Initializer(s).
  init(1);
}
