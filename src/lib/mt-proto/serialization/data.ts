import {assert, List} from "@telegram/foundation";

export class Data {
    constructor(private buffer: ArrayBuffer) {
        this._bytes = new Uint8Array(this.buffer);

        if (this.capacity % 4 !== 0) {
            this.extendCapacity(4 - this.capacity % 4);
        }
    }

    public static bytesFromString(value: string): Uint8Array {
        const bytes = new Uint8Array(value.length / 2);
        let byteIndex = 0;

        for (let i = 0; i < value.length; i += 2) {
            bytes[byteIndex] = parseInt(value.substr(i, 2), 16);
            byteIndex += 1;
        }

        return bytes;
    }

    public static stringFromBytes(value: Uint8Array): string {
        let result = "";

        for (let i = 0; i < value.length; i++) {
            const byte = value[i];
            result += (byte < 16 ? "0" : "") + byte.toString(16);
        }

        return result;
    }

    private _offset = 0;

    public get offset(): number {
        return this._offset;
    }

    private _bytes: Uint8Array;

    public get bytes(): Uint8Array {
        return this._bytes;
    }

    public get capacity(): number {
        return this.buffer.byteLength;
    }

    public static allocate({initialCapacity}: { initialCapacity: number }): Data {
        return new Data(new ArrayBuffer(initialCapacity));
    }

    public writeBytes(value: Uint8Array) {
        this.requireCapacityForNextBytes(value.byteLength + 8);

        if (value.byteLength < 254) {
            this.bytes[this._offset++] = value.byteLength;
        } else {
            this.bytes[this._offset++] = 254;
            this.bytes[this._offset++] = value.byteLength & 0xff;
            this.bytes[this._offset++] = (value.byteLength & 0xff00) >> 8;
            this.bytes[this._offset++] = (value.byteLength & 0xff0000) >> 16;
        }

        this.bytes.set(value, this._offset);
        this._offset += value.byteLength;

        while (this._offset % 4) {
            this.bytes[this._offset++] = 0;
        }
    }

    public writeByteString(value: string) {
        const bytes = Data.bytesFromString(value);
        this.writeBytes(bytes);
    }

    public writeByte(value: number) {
        this.bytes[this._offset++] = value;
    }

    public readBytes(): Uint8Array {
        let size = this.bytes[this._offset++];
        this.assertCapacityForNextBytes(size);

        if (size === 254) {
            size = this.bytes[this._offset++]
                | (this.bytes[this._offset++] << 8)
                | (this.bytes[this._offset++] << 16);
        }

        const result = this.bytes.subarray(this._offset, this._offset + size);
        this._offset += size;

        while (this._offset % 4) {
            this._offset += 1;
        }

        return result;
    }

    public writeInt32(value: number) {
        const sizeInBytes = 4;
        this.requireCapacityForNextBytes(sizeInBytes);
        const view = new Int32Array(this.buffer);
        view[this._offset / sizeInBytes] = value;
        this._offset += sizeInBytes;
    }

    public writeUint32(value: number) {
        const sizeInBytes = 4;
        this.requireCapacityForNextBytes(sizeInBytes);
        const view = new Uint32Array(this.buffer);
        view[this._offset / sizeInBytes] = value;
        this._offset += sizeInBytes;
    }

    public readInt32(): number {
        const sizeInBytes = 4;
        this.assertCapacityForNextBytes(sizeInBytes);
        const view = new Int32Array(this.buffer);
        const value = view[this._offset / sizeInBytes];
        this._offset += sizeInBytes;
        return value;
    }

    public readUint32(): number {
        const sizeInBytes = 4;
        this.assertCapacityForNextBytes(sizeInBytes);
        const view = new Uint32Array(this.buffer);
        const value = view[this._offset / sizeInBytes];
        this._offset += sizeInBytes;
        return value;
    }

    public writeFloat64(value: number) {
        const sizeInBytes = 8;
        this.requireCapacityForNextBytes(sizeInBytes);
        const view = new Float64Array(this.buffer);
        view[this._offset / sizeInBytes] = value;
        this._offset += sizeInBytes;
    }

    public readFloat64(): number {
        const sizeInBytes = 8;
        this.assertCapacityForNextBytes(sizeInBytes);
        const view = new Float64Array(this.buffer);
        const value = view[this._offset / sizeInBytes];
        this._offset += sizeInBytes;
        return value;
    }

    public writeBigInt({value, sizeInBits}: { value: bigint, sizeInBits: number }) {
        assert(sizeInBits % 32 === 0, "Invalid BigInt size");
        const sizeInBytes = sizeInBits / 8;
        let current = value;
        const finalOffset = this._offset + sizeInBytes;

        for (let i = this._offset; i < finalOffset; i++) {
            this.bytes[this._offset++] = Number(current % 256n);
            current = current / 256n;
        }
    }

    public readBigInt({sizeInBits}: { sizeInBits: number }): bigint {
        assert(sizeInBits % 32 === 0, "Invalid BigInt size");
        const sizeInBytes = sizeInBits / 8;
        let result = 0n;
        let base = 1n;

        const finalOffset = this._offset + sizeInBytes;

        for (let i = this._offset; i < finalOffset; i++) {
            result += (base * BigInt(this.bytes[i]));
            base *= 256n;
        }

        this._offset = finalOffset;

        return result;
    }

    public appending(...buffers: Data[]): Data {
        const totalSize = List.from(buffers).sumBy(it => it.capacity) + this.capacity;
        const newBuffer = Data.allocate({initialCapacity: totalSize});

        newBuffer.bytes.set(this.bytes);

        let offset = this.capacity;

        for (const buffer of buffers) {
            newBuffer.bytes.set(buffer.bytes, offset);
            offset += buffer.capacity;
        }

        return newBuffer;
    }

    public select(start: number, end: number): Data {
        assert(end > start);
        const newBytes = new Uint8Array(end - start);

        for (let i = 0; i < end; i++) {
            newBytes[i] = this.bytes[i];
        }

        return new Data(newBytes);
    }

    public resetPointer() {
        this._offset = 0;
    }

    private requireCapacityForNextBytes(count: number) {
        if (this._offset + count > this.capacity) {
            const nextCapacity = Math.ceil(Math.max(this.capacity * 2, this._offset + count + 16) / 4) * 4;
            this.extendCapacity(nextCapacity - this.capacity);
        }
    }

    private assertCapacityForNextBytes(count: number) {
        assert(this._offset + count <= this.capacity, "Reading value that is larger than buffer size!");
    }

    private extendCapacity(extraCapacity: number) {
        const prevBytes = this.bytes;
        this.buffer = new ArrayBuffer(this.capacity + extraCapacity);
        this._bytes = new Uint8Array(this.buffer);
        this.bytes.set(prevBytes);
    }
}
