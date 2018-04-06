#include <stdio.h>
#include "../emscripten/emscripten.h"

int main()
{
	printf("Hello, world!\n");
	return 0;
}

void EMSCRIPTEN_KEEPALIVE myFunction(int val)
{
	printf("myFunction in C: with val %i, passed in.\n", val);
}

/*
TERMINAL:
emcc hello2.c -s WASM=1 -o hello2.html --shell-file ../html_template/shell_minimal.html -s NO_EXIT_RUNTIME=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall"]'

HTML:
<!-- START: Pass value into C function! -->
<input type="text" id="txtValue">
<input type="button" value="Pass Value" onclick="PassValue();">
<!-- END: Pass value into C function! -->

SCRIPT:
function PassValue(){
	Module.ccall(
		'myFunction', // Name of C function
		null,         // Return type
		['number'],   // Argument types
		[ parseInt(document.getElementById("txtValue").value,10) ]
	);
}
*/
