'use strict';
// window.onload because it is most supported.
window.onload = () => {
  const dice = document.getElementById('dice');

  // EVENT LISTENERS:
  dice.addEventListener('click', () => {
    // You can write it simple like this:
    let fate = _roll_of_a_dice();
    console.log('one: ',fate);

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

}
