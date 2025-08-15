export default function trim(buffer: Buffer) {
    let pos = 0;

    for (let i = buffer.length - 1; i >= 0; i--) {
        if (buffer[i] !== 0x00) {
            pos = i;
            break;
        }
    }

    return buffer.slice(0, pos + 1);
}
