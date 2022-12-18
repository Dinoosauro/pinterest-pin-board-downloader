// -- SCRIPT SETTINGS --
let resolutionDownload = "736x"; // Choose the quality of the downloaded image: from the lowest to the highest, "236x", "474x", "736x", "originals"
let minDownloadDelay = 40; // the mininum time the script should wait before downloading the next image.
let maxDownloadDelay = 250; // the maxinum time the script should wait before downloading the next image.


// -- SCRIPT START --
let itemId = Array(1).fill("");
let stopSet = 0;
let oldSetStop = 0;
var ciao = new Set();
function getCurrentItems() {
    let items = document.querySelectorAll("[loading=auto]");
    for (let i = 0; i < items.length; i++) {
        if ((items[i].src).indexOf("/140x140_RS/") == -1 && (items[i].src).indexOf("/images/user/") == -1) itemId[itemId.length] = (items[i].src).replace("/236x/", "/" + resolutionDownload + "/").replace("/474x/", "/" + resolutionDownload + "/");
    }
    ciao = new Set(itemId);
    if (oldSetStop == ciao.size) {
        stopSet++;
    } else {
        oldSetStop = ciao.size;
        stopSet = 0;
    }

}
let height = 0;
let currentPageHeight = document.body.scrollHeight;
let timeCheck = 0;
function loadPage() {
    if (document.body.innerHTML.indexOf("O-T\"><svg class=\"") == -1) {
        height = height + (Math.random() * 1400 + 400);
        window.scrollTo({top: height, behavior: 'smooth'});
        getCurrentItems();
        console.log("Scrolling webpage...");
        setTimeout(function () {
            if (stopSet != 2 && document.body.innerHTML.indexOf("O-T\"><svg class=\"") == -1) {
                setTimeout(function () {
                    loadPage();
                }, Math.floor(Math.random() * 800 + 400));
            } else {
                setTimeout(function() {
                if (document.body.innerHTML.indexOf("O-T\"><svg class=\"") != -1){
                setTimeout(function () {
                    loadPage()
                }, 1000);
            } else {
                console.log("Starting image downloading...");
                downloadImg(Array.from(ciao), 1);
            }
        }, 150);
        }
        }, 150);
    } else {
        setTimeout(function () {
            loadPage()
        }, 1000);
    }
}
function downloadImg(items, id) {
    setTimeout(function() {
        forceDownload(items[id], items[id].substring(items[id].lastIndexOf("/") + 1));
        if (items.length >= id)  downloadImg(items, id+1);
    }, Math.random() * maxDownloadDelay + minDownloadDelay);
}
function forceDownload(url, fileName) {
    if (url.indexOf("undefined") !== -1) {
        url = url.replace("undefined", "");
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}
loadPage();