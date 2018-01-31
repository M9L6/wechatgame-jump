export function createSplash() {

}

export function onProgress(url, loaded, itesmtotal) {
    console.log(url + "  " + loaded + "/" + itesmtotal);
}

export function onLoad() {
    console.log('load ok ');
}
export function onError(url) {
    console.log(url + "  error");
}