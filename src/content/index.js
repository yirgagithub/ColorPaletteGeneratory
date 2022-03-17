
//Workaround for restriction on accessing external styles by using Window.getComputedStyle method - Web API's CSSStyleSheet.cssRules interface restricted by CORS
function getColor(e) {
    var color = window.getComputedStyle(e, null)
        .getPropertyValue('background-color');
    return color;
}

//This filters out default background colors of elements - browser sets default to rgba black with full transparency
function filterBlack(e) {
    if (e !== 'rgba(0, 0, 0, 0)' && 'rgb(0, 0, 0)') {
        return e;
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//Grabs all elements top 5 colors
function pageColors() {
    let pageEls = Array.from(document.querySelectorAll('*'));
    let colorArr = pageEls.map(getColor)
        .filter(filterBlack)
        .sort();
    let cnts = colorArr.reduce(function (obj, val) {
        obj[val] = (obj[val] || 0) + 1;
        return obj;
    }, {});

    let sorted = Object.keys(cnts).sort(function (a, b) {
        return cnts[b] - cnts[a];
    });

    let hexColor = [];
    let topSorted = sorted.slice(0, 5);
    for (let i = 0; i <= 4; i++) {
        let element = topSorted[i]
        let r = parseInt(element.substring(4, element.indexOf(',')));
        let g = parseInt(element.substring(element.indexOf(',') + 1, element.lastIndexOf(',')))
        let b = parseInt(element.substring(element.lastIndexOf(',') + 1, element.length - 1));
        let hexValue = rgbToHex(r, g, b);
        hexColor.push({ index: i, value: hexValue })
    }

    return hexColor;
}

chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if (message.command == 'get_colors') {
        var colors = pageColors();
        response({ type: "got_the_colors", status: 'success', message: colors });
        return true;
    }
});