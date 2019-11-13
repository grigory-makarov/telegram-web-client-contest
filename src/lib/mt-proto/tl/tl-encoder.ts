import {TlBool} from "./tl-bool";
import {fatal} from "@telegram/foundation";
import {TlObjectType} from "./tl-object-type";
import {TlObject} from "./tl-object";

export class TlEncoder {
    private static readonly initialCapacity = 2048;
    private offset = 0;
    private capacity!: number;
    private _buffer!: ArrayBuffer;
    private intView!: Int32Array;
    private byteView!: Uint8Array;

    public get buffer(): ArrayBuffer {
        return this._buffer;
    }

    constructor() {
        this.reserveCapacity(TlEncoder.initialCapacity);
    }

    public encodeInt(value: number) {
        this.requireAvailableSpace(4);
        this.intView[this.offset / 4] = value;
        this.offset += 4;
    }

    public encodeDouble(value: number) {
        const buffer = new ArrayBuffer(8);
        const intView = new Int32Array(buffer);
        const doubleView = new Float64Array(buffer);

        doubleView[0] = value;

        this.encodeInt(intView[0]);
        this.encodeInt(intView[1]);
    }

    public encodeLong(value: bigint) {
        const buffer = new ArrayBuffer(8);
        const intView = new Int32Array(buffer);
        const bigintView = new BigInt64Array(buffer);

        bigintView[0] = value;

        this.encodeInt(intView[0]);
        this.encodeInt(intView[1]);
    }

    public encodeBoolean(value: boolean) {
        this.encodeInt(value ? TlBool.true : TlBool.false);
    }

    public encodeString(value: string) {
        const sUtf8 = unescape(decodeURIComponent(value));
        this.requireAvailableSpace(sUtf8.length + 8);

        if (sUtf8.length < 254) {
            this.byteView[this.offset++] = sUtf8.length;
        } else {
            this.byteView[this.offset++] = 254;
            this.byteView[this.offset++] = sUtf8.length & 0xff;
            this.byteView[this.offset++] = (sUtf8.length & 0xff00) >> 8;
            this.byteView[this.offset++] = (sUtf8.length & 0xff0000) >> 16;
        }

        for (let i = 0; i < sUtf8.length; i++) {
            this.byteView[this.offset++] = sUtf8.charCodeAt(i);
        }

        while (this.offset % 4) {
            this.byteView[this.offset++] = 0;
        }
    }

    public encodeMethod(id: number, params: { value: TlObject, type: TlObjectType }[]) {
        this.encodeInt(id);
        for (const param of params) {
            this.encodeObject(param.value, param.type);
        }
    }

    public encodeObject(value: TlObject, type: TlObjectType) {
        switch (type) {
            case TlObjectType.int:
                this.encodeInt(value as number);
                break;
            case TlObjectType.int128:
            case TlObjectType.int256:
            case TlObjectType.int512:
                this.encodeIntBytes(value as Uint8Array);
                break;
            case TlObjectType.string:
                this.encodeString(value as string);
                break;
            case TlObjectType.double:
                this.encodeDouble(value as number);
                break;
            case TlObjectType.long:
                this.encodeLong(value as bigint);
                break;
            case TlObjectType.bool:
                this.encodeBoolean(value as boolean);
                break;
            case TlObjectType.bytes:
                this.encodeBytes(value as Uint8Array);
                break;
            default:
                fatal("Unknown object type");
        }
    }


    public encodeBytes(value: Uint8Array) {
        this.requireAvailableSpace(value.byteLength + 8);

        if (value.byteLength < 254) {
            this.byteView[this.offset++] = value.byteLength;
        } else {
            this.byteView[this.offset++] = 254;
            this.byteView[this.offset++] = value.byteLength & 0xff;
            this.byteView[this.offset++] = (value.byteLength & 0xff00) >> 8;
            this.byteView[this.offset++] = (value.byteLength & 0xff0000) >> 16;
        }

        this.byteView.set(value, this.offset);
        this.offset += value.byteLength;

        while (this.offset % 4) {
            this.byteView[this.offset++] = 0;
        }
    }

    public encodeIntBytes(value: Uint8Array) {
        this.byteView.set(value, this.offset);
        this.offset += value.length;
    }

    public encodeRawBytes(value: Uint8Array) {
        this.requireAvailableSpace(value.byteLength);
        this.byteView.set(value, this.offset);
        this.offset += value.byteLength;
    }

    private requireAvailableSpace(bytes: number) {
        if (this.offset + bytes >= this.capacity) {
            const nextCapacity = Math.ceil(Math.max(this.capacity * 2, this.offset + bytes + 16) / 4) * 4;
            this.reserveCapacity(nextCapacity);
        }
    }

    private reserveCapacity(value: number) {
        this.capacity = value;

        const prevIntView = this.intView;
        const prevByteView = this.byteView;

        this._buffer = new ArrayBuffer(this.capacity);
        this.intView = new Int32Array(this._buffer);
        this.byteView = new Uint8Array(this._buffer);

        if (prevIntView && prevByteView) {
            this.intView.set(prevIntView);
            this.byteView.set(prevByteView);
        }
    }
}

