'use strict';
// window.onload because it is most supported.
window.onload = () => {
  const select = document.getElementById('numberOfDice');
  const diceContainer = document.getElementById('dice-container');

  // FUNCTIONS:
  function init(x) {
    generateDice(x);
  }

  function generateDice(num) {
    const colorArr = ['crimson', 'forestgreen', 'mediumblue', 'darkviolet', 'orangered', 'orange'];
    let add = 1, count = 1;
    let randColor;

    // Create 'x' number of dice from the user input.
    for (let i = 1; i <= num; i++) {
      if (i > 1) add += 6;
      randColor = Math.floor((Math.random() * 10) % 7);

      // 'x' number of dice.
      let mainDiv = document.createElement('div');
      mainDiv.id = `dice-${add}`;
      mainDiv.className = 'dice';
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

    // Attach Event Listeners for each child dice in dice-container:
    const diceFace = diceContainer.childNodes;

    diceFace.forEach(function(el, i) {
      diceFace[i].addEventListener('click', function(e) {
        const diceId = e.target.id;
        const childNodeArray = e.target.childNodes;
        let count = 0;

        let timer = setInterval(function() {
          const fate = _dice_roll();
          toggleOffExcept(fate, childNodeArray);
          count++;
          if (count >= 10) clearInterval(timer);
        }, 80);

        // *** For C function _dice_roll()
        // Another way of writing it provided that
        // you compiled the C script with:
        // -s NO_EXIT_RUNTIME=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall"]'
        // let res = Module.ccall(
        //   'roll_of_a_dice', // name of C function
        //   'number',         // return type
        //   null,             // argument type
        //   null              // arguments
        // );
      });
    });
  }

  function toggleOffExcept(x, arr) {
    for (let i = 0; i < arr.length; i++) {
      const faceNum = parseInt(arr[i].id.split("-")[1]);
      if (x === faceNum)
        document.getElementById(`${[arr[i].id]}`).style.display = 'flex';
      else
        document.getElementById(`${[arr[i].id]}`).style.display = 'none';
    }
  }

  // EVENT LISTENER ON <select>:
  select.addEventListener('change', (e) => {
    const index = e.target.selectedIndex;
    const numOfDice = select[index].value;

    diceContainer.innerHTML = '';
    // Function that refreshes the number of dice.
    init(numOfDice);
  }, {passive: true});

  // Initializers.
  init(1);
}
