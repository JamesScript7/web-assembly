#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <emscripten/emscripten.h>

int main(void)
{
  // srand(time(NULL)) initializes the PRNG (Pseudo-Random Number Generator)
  // (recommended to be done in the main, when app starts.)
  // Seed value generator:
  srand(time(NULL));
  printf("%s\n", "Loaded WebAssembly, the future is here!");
  return 0;
}

// EMSCRIPTEN_KEEPALIVE: So this can be made available in JS whenever we call it.
int EMSCRIPTEN_KEEPALIVE roll_of_a_dice()
{
  return rand() % 6 + 1;
}
