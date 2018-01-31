import * as THREE from "../libs/three"

let assetpath = "",
    textureassets = [{
            name: 'startbtn',
            url: 'assets/texture/start.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: 'particle',
            url: 'assets/texture/1.jpg',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "cross",
            url: 'assets/texture/2.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding

            }
        },
        {
            name: "prop1",
            url: 'assets/texture/1.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "prop2",
            url: 'assets/texture/3.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "prop3",
            url: 'assets/texture/4.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "prop4",
            url: 'assets/texture/5.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "prop5",
            url: 'assets/texture/6.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "prop6",
            url: 'assets/texture/7.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "prop7",
            url: 'assets/texture/8.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "prop8",
            url: 'assets/texture/logoad.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "tipl",
            url: 'assets/texture/left.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "tipsr",
            url: 'assets/texture/right.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "playerl",
            url: 'assets/texture/playerl.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "playerr",
            url: 'assets/texture/player.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
        {
            name: "shadow",
            url: 'assets/texture/shadow01.png',
            setting: {
                mapping: THREE.UVMapping,
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                anisotropy: 1,
                encoding: THREE.LinearEncoding
            }
        },
    ],
    soundassets = [{
            name: 'bgm',
            url: 'assets/sound/bgm.mp3',
            setting: {
                autoplay: true,
                loop: true,
                volume: 1.0
            }
        },
        {
            name: 'change',
            url: 'assets/sound/change.mp3',
            setting: {
                autoplay: false,
                loop: false,
                volume: 1.0
            }
        },
        {
            name: 'eat',
            url: 'assets/sound/eat.mp3',
            setting: {
                autoplay: false,
                loop: false,
                volume: 1.0
            }
        },
        {
            name: 'hit',
            url: 'assets/sound/hit.mp3',
            setting: {
                autoplay: false,
                loop: false,
                volume: 1.0
            }
        },
        {
            name: 'lose',
            url: 'assets/sound/lose.mp3',
            setting: {
                autoplay: false,
                loop: false,
                volume: 1.0
            }
        }
    ],
    uiassets = [{
            name: "startbtn",
            url: "assets/texture/start.png"
        },
        {
            name: "tipsl",
            url: "assets/texture/left.png"
        },
        {
            name: "tipsr",
            url: "assets/texture/right.png"
        }
    ];


export function preload(onLoad, onProgress, onError) {
    let itesmtotal = 0,
        loaded = 0,
        imageLoader = new THREE.ImageLoader();
    for (let t of textureassets) {
        imageLoader.load(assetpath + t.url, (img) => {
            textureonload(img, t);
            loaded++;
            onProgress(t.url, loaded, itesmtotal);
            if (loaded === itesmtotal) {
                onLoad();
            }
        }, (e) => {

        }, (e) => {
            onError(assetpath + t.url);
        });
        itesmtotal++;
    }

    for (let t of soundassets) {
        let audio = new Audio(assetpath + t.url);

        audio.autoplay = t.setting.autoplay;
        audio.loop = t.setting.loop;

        audio.addEventListener("load", () => {
            soundonload(audio, t);
            loaded++;
            onProgress(t.url, loaded, itesmtotal);
            if (loaded === itesmtotal) {
                onLoad();
            }
        });
        audio.addEventListener("error", (e) => {
            onError(assetpath + t.url);
        });
        itesmtotal++;
    }
}

function textureonload(img, t) {
    let setting = t.setting,
        resource = new THREE.Texture(img, setting.mapping, setting.wrapS, setting.wrapT, setting.magFilter, setting.minFilter, setting.format, setting.type, setting.anisotropy, setting.encoding);
    resource.needsUpdate = true;
    textures.push({ name: t.name, resource: resource });
}

function soundonload(audio, t) {

    sounds.push({ name: t.name, resource: audio });
}

let textures = [];
let sounds = [];
let images = [];
export function getTexture(name) {
    for (let t of textures) {
        if (t.name === name) {
            return t.resource;
        }
    }
}

export function getSound(name) {
    for (let t of sounds) {
        if (t.name === name) {
            return t.resource;
        }
    }
}

export function getImage(name) {
    for (let t of images) {
        if (t.name === name) {
            return t.resource;
        }
    }
}