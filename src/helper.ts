export const decodeSubmitSignatureCall = (inp: string): string => {
	// "0x":2 chars, methodID: 8 chars, signatureOffset: 64 chars
	let MSG_OFFSET_START = 2 + 8 + 64;

	let msgOffset = parseInt(inp.substr(MSG_OFFSET_START, 64), 16) as i32;
	let msgLen = parseInt(inp.substr(msgOffset * 2, 64), 16) as i32;

	let MSG_START = msgOffset * 2 + 64;

	let msg = inp.substr(MSG_START, msgLen * 2);

	return msg;
}

export const getIdFromMessage = (message: string): string =>{
	return message.substr(64, 64);
}