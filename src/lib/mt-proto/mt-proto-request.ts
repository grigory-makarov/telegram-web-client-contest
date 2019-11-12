import {TlEncoder} from "./tl/tl-encoder";
import {TlObjectType} from "./tl/tl-object-type";

export class MtProtoRequest {
    private readonly encoder = new TlEncoder();

    private constructor() {
        this.encodeMetadata();
    }

    public static sendCode(phoneNumber: string): MtProtoRequest {
        const request = new MtProtoRequest();

        request.encoder.encodeMethod(1502141361, [
            {type: TlObjectType.string, value: phoneNumber},
            {type: TlObjectType.int, value: 84522},
            {type: TlObjectType.string, value: "34cc5f386132788141e95356cb0153db"}
        ]);

        const http = new XMLHttpRequest();
        http.responseType = "arraybuffer";
        http.onloadend = () => console.log(http.response);
        http.onerror = error => console.error(error);
        http.open("POST", "http://149.154.167.40");
        http.send(request.encoder.encodedBytes);

        return request;
    }

    private encodeMetadata() {
        this.encoder.encodeInt(0xda9b0d0d); // invokeWithLayer
        this.encoder.encodeInt(74); // layer
        this.encoder.encodeInt(0xc7481da6); // initConnection
        this.encoder.encodeInt(84522); // api_id
        this.encoder.encodeString(navigator.userAgent || "Unknown UserAgent"); // device_model
        this.encoder.encodeString("0.0.1"); // app_version
        this.encoder.encodeString(navigator.language || "en"); // system_lang_code
        this.encoder.encodeString(""); // lang_pack
        this.encoder.encodeString(navigator.language || "en"); // lang_code
    }
}
