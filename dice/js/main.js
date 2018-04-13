'use strict';
// window.onload because it is most supported.
window.onload = () => {
  const dice = document.getElementById('dice');

  // DICE FACES:
  const face1 = document.getElementById('one');
  const face2 = document.getElementById('two');
  const face3 = document.getElementById('three');
  const face4 = document.getElementById('four');
  const face5 = document.getElementById('five');
  const face6 = document.getElementById('six');
  const faceArr = [face1, face2, face3, face4, face5, face6];

  // FUNCTIONS:
  function toggleOffExcept(x) {
    for (let i = 0; i < faceArr.length; i++) {
      if (x === faceArr[i].id)
        document.getElementById(`${[faceArr[i].id]}`).style.display = 'flex';
      else
        document.getElementById(`${[faceArr[i].id]}`).style.display = 'none';
    }
  }

  // EVENT LISTENERS:
  dice.addEventListener('click', (e) => {
    // You can write it simple like this:
    let fate = _dice_roll();

    // Another way of writing it provided that
    // you compiled the C script with:
    // -s NO_EXIT_RUNTIME=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall"]'
    // let res = Module.ccall(
    //   'roll_of_a_dice', // name of C function
    //   'number',         // return type
    //   null,             // argument type
    //   null              // arguments
    // );

    switch(fate) {
      case 1:
        toggleOffExcept('one');
        break;
      case 2:
        toggleOffExcept('two');
        break;
      case 3:
        toggleOffExcept('three');
        break;
      case 4:
        toggleOffExcept('four');
        break;
      case 5:
        toggleOffExcept('five');
        break;
      case 6:
        toggleOffExcept('six');
        break;
      default:
        console.error('error');
    }

    console.log('_dice_roll: ',fate);
  });

}
