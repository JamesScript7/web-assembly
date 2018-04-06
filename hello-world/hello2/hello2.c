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
emcc hello2.c -s WASM=1 -o hello2.html --shell-file ../html_template/shell_minimal.html -s NO_EXIT_RUNTIME=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]'

--shell-file ../html_template/shell_minimal.html
-s NO_EXIT_RUNTIME=1
// In order to use Module.ccall and/or Module.cwrap
-s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]'

HTML:
<!-- START: Pass value into C function! -->
<input type="text" id="txtValue">
<input type="button" value="Pass Value" onclick="PassValue();">
<!-- END: Pass value into C function! -->

SCRIPT:
function PassValue(){
	//ccall method:
	Module.ccall(
		'myFunction', // Name of C function
		null,         // Return type
		['number'],   // Argument types
		[ parseInt(document.getElementById("txtValue").value,10) ]
	);

	// cwrap method:
	let cwrapMethod = Module.cwrap(
		'myFunction',
		null,
		['number']
	);
	cwrapMethod(10);
}
*/
