import {assert, fatal} from "@telegram/foundation";
import {TlBool} from "./tl-bool";

export class TlDecoder {
    private offset = 0;
    private intView!: Int32Array;
    private byteView!: Uint8Array;

    constructor(private readonly buffer: ArrayBuffer) {
    }

    public decodeInt(): number {
        if (this.offset >= this.intView.length * 4) {
            throw new Error("Buffer overflow");
        }

        return this.intView[this.offset / 4];
    }

    public decodeDouble(): number {
        const buffer = new ArrayBuffer(8);
        const intView = new Int32Array(buffer);
        const doubleView = new Float64Array(buffer);

        intView[0] = this.decodeInt();
        intView[1] = this.decodeInt();

        return doubleView[0];
    }

    public decodeString(): string {
        let length = this.byteView[this.offset++];

        if (length === 254) {
            length = this.byteView[this.offset++]
                | (this.byteView[this.offset++] << 8)
                | (this.byteView[this.offset++] << 16);
        }

        let sUtf8 = "";

        for (let i = 0; i < length; i++) {
            sUtf8 += String.fromCharCode(this.byteView[this.offset++]);
        }

        while (this.offset % 4) {
            this.offset += 1;
        }

        try {
            return decodeURIComponent(escape(sUtf8));
        } catch (error) {
            return sUtf8;
        }
    }

    public decodeBoolean(): boolean {
        const value = this.decodeInt();
        if (value === TlBool.true) {
            return true;
        } else if (value === TlBool.false) {
            return false;
        } else {
            return fatal(`Failed to read boolean with offset ${this.offset}`);
        }
    }

    public decodeBytes(): Uint8Array {
        let length = this.byteView[this.offset++];

        if (length === 254) {
            length = this.byteView[this.offset++]
                | (this.byteView[this.offset++] << 8)
                | (this.byteView[this.offset++] << 16);
        }

        const bytes = this.byteView.subarray(this.offset, this.offset + length);
        this.offset += length;

        while (this.offset % 4) {
            this.offset += 1;
        }

        return bytes;
    }

    public decodeIntBytes(bits: number) {
        assert(bits % 32 === 0);

        const length = bits / 8;
        const result = this.byteView.subarray(this.offset, this.offset + length);
        this.offset += length;
        return result;
    }

    public decodeRawBytes(length: number): Uint8Array {
        const byteView = new Uint8Array(length);
        byteView.set(this.byteView.subarray(this.offset, this.offset + length));
        this.offset += length;
        return byteView;
    }
}