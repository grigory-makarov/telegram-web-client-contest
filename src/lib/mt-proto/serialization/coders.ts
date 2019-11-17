import {Data} from "./data";
import {assert, fatal} from "@telegram/foundation";

export abstract class Coder<TValue> {
    public abstract encode(value: TValue, data: Data): void;

    public abstract decode(data: Data): TValue;
}

export class IntCoder extends Coder<number> {
    public static readonly shared = new IntCoder();

    public encode(value: number, data: Data): void {
        data.writeInt32(value);
    }

    public decode(data: Data): number {
        return data.readInt32();
    }
}

export class FloatCoder extends Coder<number> {
    public static readonly shared = new FloatCoder();

    public encode(value: number, data: Data): void {
        data.writeFloat64(value);
    }

    public decode(data: Data): number {
        return data.readFloat64();
    }
}

export class Int64Coder extends Coder<bigint> {
    public static readonly shared = new Int64Coder();

    public encode(value: bigint, data: Data): void {
        data.writeBigInt({value, sizeInBits: 64});
    }

    public decode(data: Data): bigint {
        return data.readBigInt({sizeInBits: 64});
    }
}

export class Int128Coder extends Coder<bigint> {
    public static readonly shared = new Int128Coder();

    public encode(value: bigint, data: Data): void {
        data.writeBigInt({value, sizeInBits: 128});
    }

    public decode(data: Data): bigint {
        return data.readBigInt({sizeInBits: 128});
    }
}

export class Int256Coder extends Coder<bigint> {
    public static readonly shared = new Int256Coder();

    public encode(value: bigint, data: Data): void {
        data.writeBigInt({value, sizeInBits: 256});
    }

    public decode(data: Data): bigint {
        return data.readBigInt({sizeInBits: 256});
    }
}

export class Int512Coder extends Coder<bigint> {
    public static readonly shared = new Int512Coder();

    public encode(value: bigint, data: Data): void {
        data.writeBigInt({value, sizeInBits: 512});
    }

    public decode(data: Data): bigint {
        return data.readBigInt({sizeInBits: 512});
    }
}

export class StringCoder extends Coder<string> {
    public static readonly shared = new StringCoder();

    public encode(value: string, data: Data): void {
        // const source = unescape(decodeURIComponent(value));
        // const arrayBuffer = new ArrayBuffer(value.length);
        // const view = new Uint8Array(arrayBuffer);
        //
        // for (let i = 0; i < source.length; i++) {
        //     view[i] = source.charCodeAt(i);
        // }
        //
        // data.writeBytes(view);

    }

    public decode(data: Data): string {
        const byteArray = data.readBytes();
        let result = "";

        for (let i = 0; i < byteArray.length; i++) {
            result += String.fromCharCode(byteArray[i]);
        }

        try {
            return decodeURIComponent(escape(result));
        } catch (error) {
            return result;
        }
    }
}

export class BoolCoder extends Coder<boolean> {
    public static readonly shared = new BoolCoder();
    private static readonly true = 0x997275b5;
    private static readonly false = 0xbc799737;

    public encode(value: boolean, data: Data): void {
        data.writeUint32(value ? BoolCoder.true : BoolCoder.false);
    }

    public decode(data: Data): boolean {
        switch (data.readUint32()) {
            case BoolCoder.true:
                return true;
            case BoolCoder.false:
                return false;
            default:
                return fatal("Decoded int32 is neither true of false value");
        }
    }
}

export class VectorCoder<TElement> extends Coder<TElement[]> {
    private static readonly plainVector = 0x1cb5c415;
    private static readonly gzippedVector = 0x3072cfa1;


    constructor(public elementCoder: Coder<TElement>) {
        super();
    }

    public encode(value: TElement[], data: Data): void {
        data.writeInt32(VectorCoder.plainVector);
        data.writeInt32(value.length);

        for (let i = 0; i < value.length; i++) {
            this.elementCoder.encode(value[i], data);
        }
    }

    public decode(data: Data): TElement[] {
        const typeId = data.readInt32();

        assert(typeId === VectorCoder.plainVector, "Failed to decode vector");

        const count = data.readInt32();
        const result: TElement[] = [];

        for (let i = 0; i < count; i++) {
            result.push(this.elementCoder.decode(data));
        }

        return result;
    }
}
