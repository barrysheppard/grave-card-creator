writeValue = function (ctx, value, pos) {
    var scale = getScalingFactor(getCanvas(), getBackgroundImage());
    pos = { x: pos.x / scale.x, y: pos.y / scale.y };

    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, pos.x, pos.y);
    ctx.restore();
}

function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {

    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            context.fillText(lines[i], x, y + (lineNum * lineHeight));
            lineNum++;
        }
        var words = lines[i].split(' ');
        var idx = 1;
        while (words.length > 0 && idx <= words.length) {
            var str = words.slice(0, idx).join(' ');
            var w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineNum * lineHeight));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            context.fillText(words.join(' '), x, y + (lineNum * lineHeight));
            lineNum++;
        }

    }

}




function drawCardText(value) {
    fighterData = readControls();
    let yStart = 835;
    let xStart = 120;
    let fitWidth = 580;
    let context = getContext();
    textColour = 'white';
    context.textAlign = "left";
    context.textBaseline = "middle";
    let fontSize = document.getElementById("fontSize").value;
    let lineHeight = fontSize;

    let font = 'px Montserrat'
    context.font = `${fontSize}${font}`;
  

    if(fighterData.cardType === 'stargrave_ability' ||
    fighterData.cardType === 'frostgrave_spell'
    ) {
        yStart = 350;
        xStart = 120;
        fitWidth = 580;
    }
    if(fighterData.cardType === 'frostgrave_weapon' ||
    fighterData.cardType === 'frostgrave_soldier'    ) {
        yStart = 710;
        xStart = 300;
        fitWidth = 380;
    }

    if(fighterData.cardType === 'stargrave_weapon' ||
    fighterData.cardType === 'stargrave_soldier'
    ) {
        yStart = 710;
        xStart = 300;
        fitWidth = 380;
    }

    let textLines = splitWordWrap(context, value, fitWidth);

    textLines.forEach((line, index) => {
        let fillStyle = textColour;
        context.font = `${fontSize}${font}`;
        context.fillStyle = fillStyle;
        context.fillText(line, xStart, yStart + index * lineHeight);
    });
}




function splitWordWrap(context, text, fitWidth) {
    // this was modified from the print version to only return the text array
    return_array = [];
    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            return_array.push(lines[i]);
            lineNum++;
        }
        var words = lines[i].split(' ');
        var idx = 1;
        while (words.length > 0 && idx <= words.length) {
            var str = words.slice(0, idx).join(' ');
            var w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                return_array.push(words.slice(0, idx - 1).join(' '));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            return_array.push(words.join(' '));
            lineNum++;
        }

    }
    return return_array;
}



getScalingFactor = function (canvas, warcryCardOne) {
    return {
        x: canvas.width / warcryCardOne.width,
        y: canvas.height / warcryCardOne.height
    };
}

getCanvas = function () {
    return document.getElementById("canvas");
}

getContext = function () {
    return getCanvas().getContext("2d");
}

getBackgroundImage = function () {
    return document.getElementById('bg1');
}

drawBackground = function () {
    getContext().drawImage(
        getBackgroundImage(), 0, 0, getCanvas().width, getCanvas().height);
}

scalePixelPosition = function (pixelPosition) {
    var scalingFactor = getScalingFactor(getCanvas(), getBackgroundImage());
    var scaledPosition = { x: pixelPosition.x * scalingFactor.x, y: pixelPosition.y * scalingFactor.y };
    return scaledPosition;
}

writeScaled = function (value, pixelPos) {
    var scaledPos = scalePixelPosition(pixelPos);
    writeValue(getContext(), value, scaledPos);
}

drawCardElementFromInput = function (inputElement, pixelPosition) {
    var value = inputElement.value;
    writeScaled(value, pixelPosition);
}

drawCardElementFromInputId = function (inputId, pixelPosition) {
    drawCardElementFromInput(document.getElementById(inputId), pixelPosition);
}

drawCardName = function (value) {
    getContext().fillStyle = 'black';
    getContext().textAlign = 'center';
    getContext().textBaseline = 'middle';
    x = 411;
    var selectedValue = document.getElementById("cardType").value;
    if (selectedValue.startsWith('stargrave')) {
        font = 'px Montserrat';
        y = 120;
    } else {
        font = 'px RomanAntique';
        y = 125;
    }
    
    // Set the initial font size
    var fontSize = 50;
    // Calculate the maximum width based on the desired length
    var maxWidth = 570;

    // Calculate the width of the text with the current font size
    getContext().font = fontSize + font;
    var textWidth = getContext().measureText(value).width;

    // Reduce font size if the text width exceeds the maximum width
    while (textWidth > maxWidth && fontSize > 1) {
        fontSize--;
        getContext().font = fontSize + font;
        textWidth = getContext().measureText(value).width;
    }

    getContext().font = fontSize + font;
    writeScaled(value, {x, y});
    

}




function getLabel(element) {
    return $(element).prop("labels")[0];
}

function getImage(element) {
    return $(element).find("img")[0];
}



function drawImage(scaledPosition, scaledSize, image) {
    if (image != null) {
        if (image.complete) {
            getContext().drawImage(image, scaledPosition.x, scaledPosition.y, scaledSize.x, scaledSize.y);
        }
        else {
            image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        }
    }
}

function drawImageSrc(scaledPosition, scaledSize, imageSrc) {
    if (imageSrc != null) {
        var image = new Image();
        image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        image.src = imageSrc;
    }
}


function drawModel(imageUrl, imageProps) {
    if (imageUrl != null) {
        var image = new Image();
        image.onload = function () {
            var position = scalePixelPosition({ x: 590 + imageProps.offsetX, y: imageProps.offsetY });
            var scale = imageProps.scalePercent / 100.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);

            URL.revokeObjectURL(image.src);
        };
        image.src = imageUrl;
    }
}

function getName() {
    //var textInput = $("#saveNameInput")[0];
    return "Grave_Card";
}

function setName(name) {
    //var textInput = $("#saveNameInput")[0];
    //textInput.value = name;
}

function getModelImage() {
    var imageSelect = $("#imageSelect")[0];

    if (imageSelect.files.length > 0) {
        return URL.createObjectURL(imageSelect.files[0]);
    }

    return null;
}

function setModelImage(image) {
    console.log("setModelImage:" + image);
    $("#fighterImageUrl")[0].value = image;

    //  if (image != null) {
    // TODO: Not sure how to do this. It might not even be possible! Leave it for now...
    //    imageSelect.value = image;
    // }
    // else {
    //    imageSelect.value = null;
    // }
}

function getDefaultModelImageProperties() {
    return {
        offsetX: 0,
        offsetY: 0,
        scalePercent: 100
    };
}

function getModelImageProperties() {
    return {
        offsetX: $("#imageOffsetX")[0].valueAsNumber,
        offsetY: $("#imageOffsetY")[0].valueAsNumber,
        scalePercent: $("#imageScalePercent")[0].valueAsNumber
    };
}

function setModelImageProperties(modelImageProperties) {
    $("#imageOffsetX")[0].value = modelImageProperties.offsetX;
    $("#imageOffsetY")[0].value = modelImageProperties.offsetY;
    $("#imageScalePercent")[0].value = modelImageProperties.scalePercent;
}


function readControls() {
    var data = new Object;
    data.name = getName();
    data.imageUrl = getFighterImageUrl();
    data.imageProperties = getModelImageProperties();
    data.cardName = document.getElementById("cardName").value;
    data.cardText = document.getElementById("cardText").value;
    data.fontSize = document.getElementById("fontSize").value;
    data.m = document.getElementById("m").value;
    data.f = document.getElementById("f").value;
    data.s = document.getElementById("s").value;
    data.a = document.getElementById("a").value;
    data.w = document.getElementById("w").value;
    data.h = document.getElementById("h").value;
    data.g = document.getElementById("g").value;
    data.r = document.getElementById("r").value;
    data.d = document.getElementById("d").value;
    data.cost = document.getElementById("cost").value;
    data.act = document.getElementById("act").value;
    data.st = document.getElementById("st").value;
    
    data.cardType = document.getElementById("cardType").value;
    data.spellType = document.getElementById("spellType").value;
    
    return data;
}

function drawCardFrame(fighterData){

    if(fighterData.cardType === 'frostgrave_hero') {
        getContext().drawImage(document.getElementById('frostgrave_hero'), 0, 0, getCanvas().width, getCanvas().height);
    }
    if(fighterData.cardType === 'stargrave_hero') {
        getContext().drawImage(document.getElementById('stargrave_hero'), 0, 0, getCanvas().width, getCanvas().height);
    }
    if(fighterData.cardType === 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('frostgrave_spell'), 0, 0, getCanvas().width, getCanvas().height);
    }
    if(fighterData.cardType === 'stargrave_ability') {
        getContext().drawImage(document.getElementById('stargrave_ability'), 0, 0, getCanvas().width, getCanvas().height);
    }
    if(fighterData.cardType === 'frostgrave_weapon') {
        getContext().drawImage(document.getElementById('frostgrave_weapon'), 0, 0, getCanvas().width, getCanvas().height);
    }
    if(fighterData.cardType === 'stargrave_weapon') {
        getContext().drawImage(document.getElementById('stargrave_weapon'), 0, 0, getCanvas().width, getCanvas().height);
    }
    if(fighterData.cardType === 'frostgrave_soldier') {
        getContext().drawImage(document.getElementById('frostgrave_soldier'), 0, 0, getCanvas().width, getCanvas().height);
    }
    if(fighterData.cardType === 'stargrave_soldier') {
        getContext().drawImage(document.getElementById('stargrave_soldier'), 0, 0, getCanvas().width, getCanvas().height);
    }

    if (fighterData.m != 'NA' 
        &&  fighterData.cardType != 'stargrave_ability'
        && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('m_img'), 0, 0, getCanvas().width, getCanvas().height);
    }
    
    if (fighterData.f != 'NA'
    &&  fighterData.cardType != 'stargrave_ability'
    && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('f_img'), 0, 0, getCanvas().width, getCanvas().height);
    }
    
    if (fighterData.s != 'NA'
    &&  fighterData.cardType != 'stargrave_ability'
    && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('s_img'), 0, 0, getCanvas().width, getCanvas().height);
    }
    
    if (fighterData.a != 'NA'
    &&  fighterData.cardType != 'stargrave_ability'
    && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('a_img'), 0, 0, getCanvas().width, getCanvas().height);
    }
    
    if (fighterData.w != 'NA'
    &&  fighterData.cardType != 'stargrave_ability'
    && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('w_img'), 0, 0, getCanvas().width, getCanvas().height);
    }
    
    if (fighterData.h != 'NA'
    &&  fighterData.cardType != 'stargrave_ability'
    && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('h_img'), 0, 0, getCanvas().width, getCanvas().height);
    }
    
    if (fighterData.g != 'NA'
    &&  fighterData.cardType != 'stargrave_ability'
    && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('g_img'), 0, 0, getCanvas().width, getCanvas().height);
    }

    if (fighterData.r != 'NA'
    &&  fighterData.cardType != 'stargrave_ability'
    && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('r_img'), 0, 0, getCanvas().width, getCanvas().height);
    }
    
    if (fighterData.d != 'NA'
    &&  fighterData.cardType != 'stargrave_ability'
    && fighterData.cardType != 'frostgrave_spell') {
        getContext().drawImage(document.getElementById('d_img'), 0, 0, getCanvas().width, getCanvas().height);
    }

    if (fighterData.cost != 'NA' 
    &&  (fighterData.cardType == 'stargrave_soldier' ||
    fighterData.cardType == 'stargrave_weapon' ||
    fighterData.cardType == 'frostgrave_soldier' ||
    fighterData.cardType == 'frostgrave_weapon')
   ) {
        getContext().drawImage(document.getElementById('cost_img'), 0, 0, getCanvas().width, getCanvas().height);
    }
        
    


    if(!document.getElementById("removeBorder").checked){
        getContext().drawImage(document.getElementById('border'), 0, 0, getCanvas().width, getCanvas().height);
    }

    drawCardName(fighterData.cardName);

    drawCardText(fighterData.cardText);

    x = 132;
    y = 215;
    
// M
if (fighterData.m != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.m, x, y);
}

// F
if (fighterData.f != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.f, x, y + 83);
}

// S
if (fighterData.s != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.s, x, y + 83 * 2);
}

// A
if (fighterData.a != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.a, x, y + 83 * 3);
}

// W
if (fighterData.w != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.w, x, y + 83 * 4);
}

// H
if (fighterData.h != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.h, x, y + 83 * 5);
}

// G
if (fighterData.g != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.g, x, y + 83 * 6);
}

// R
if (fighterData.r != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.r, x, y + 83 * 7);
}

// D
if (fighterData.d != 'NA'
&&  fighterData.cardType != 'stargrave_ability'
&& fighterData.cardType != 'frostgrave_spell') {
    drawNumber(fighterData.d, x, y + 83 * 8);
}


if (fighterData.spellType != 'NA'
&& fighterData.cardType == 'frostgrave_spell') {
    drawSpelltype(fighterData.spellType, 315, 237);
}

// ACT
if (fighterData.act != 'NA') {
    if (fighterData.cardType == 'frostgrave_spell'){
        drawNumber(fighterData.act, 138, 240);
    }
    if (fighterData.cardType == 'stargrave_ability'){
        drawNumber(fighterData.act, 241, 244);
    }
}

// ST
if (fighterData.st != 'NA') {
    if (fighterData.cardType == 'stargrave_ability'){
        drawNumber(fighterData.st, 675, 244);
    }
}

// Cost
if (fighterData.cost != 'NA' 
     &&  (fighterData.cardType == 'stargrave_soldier' ||
     fighterData.cardType == 'stargrave_weapon' ||
     fighterData.cardType == 'frostgrave_soldier' ||
     fighterData.cardType == 'frostgrave_weapon')
    ) {
    drawNumber(fighterData.cost, x+ 38, y + 83 * 9 + 5);
}


}

render = function (fighterData) {
    console.log("Render:");
    console.log(fighterData);
    // First the textured background
    getContext().drawImage(document.getElementById('bg1'), 0, 0, getCanvas().width, getCanvas().height);

    if (fighterData.imageUrl) {
        var image = new Image();
        image.onload = function () {
        var position = scalePixelPosition({ x: 100 + fighterData.imageProperties.offsetX, y: fighterData.imageProperties.offsetY });
        var scale = fighterData.imageProperties.scalePercent / 100.0;
        var width = image.width * scale;
        var height = image.height * scale;
        getContext().drawImage(image, position.x, position.y, width, height);
        drawCardFrame(fighterData);
        };
    image.src = fighterData.imageUrl;
    }
    // next the frame elements

    drawCardFrame(fighterData);

    
}


function drawSpelltype(num, x, y){
    var ctx = getContext(); // Assuming getContext() returns the canvas 2d context

    // Set styles
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black'; // Set border color
    ctx.lineWidth = 2; // Set border width

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // Set the initial font size
    var fontSize = 40;
    ctx.font = fontSize + 'px Montserrat'; // Ensure 'Montserrat' font is available

    var pos = { x: x, y: y };
    writeScaled(num, pos); // Assuming writeScaled() is defined elsewhere

    // Calculate text width
    var textWidth = ctx.measureText(num).width;

    // Draw black border
    ctx.strokeText(num, pos.x, pos.y);

    // Fill the text after drawing the border to prevent overlap
    ctx.fillText(num, pos.x, pos.y);
}
    

function drawNumber(num, x, y){
    var ctx = getContext(); // Assuming getContext() returns the canvas 2d context

    // Set styles
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black'; // Set border color
    ctx.lineWidth = 2; // Set border width

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Set the initial font size
    var fontSize = 50;
    
    // Adjust font size if number of characters is greater than 2
    if (num.length > 2) {
        fontSize = 40; // Set a smaller font size
    }
    ctx.font = fontSize + 'px Montserrat'; // Ensure 'Montserrat' font is available

    var pos = { x: x, y: y };
    writeScaled(num, pos); // Assuming writeScaled() is defined elsewhere

    // Calculate text width
    var textWidth = ctx.measureText(num).width;

    // Draw black border
    ctx.strokeText(num, pos.x, pos.y);

    // Fill the text after drawing the border to prevent overlap
    ctx.fillText(num, pos.x, pos.y);
}
    

async function writeControls(fighterData) {

    // here we check for base64 loaded image and convert it back to imageUrl
    if (fighterData.base64Image != null) {

        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(fighterData.base64Image);
        // then create URL object
        fighterData.imageUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        fighterData.base64Image = null;
    } else {
        fighterData.imageUrl = null;
    }

    setName(fighterData.name);
    setModelImage(fighterData.imageUrl);
    setModelImageProperties(fighterData.imageProperties);
    
    $("#cardName")[0].value = fighterData.cardName;
    $("#m")[0].value = fighterData.m;
    $("#f")[0].value = fighterData.f;
    $("#s")[0].value = fighterData.s;
    $("#a")[0].value = fighterData.a;
    $("#w")[0].value = fighterData.w;
    $("#h")[0].value = fighterData.h;
    $("#g")[0].value = fighterData.g;
    $("#r")[0].value = fighterData.r;
    $("#d")[0].value = fighterData.d;
    $("#st")[0].value = fighterData.st;
    $("#act")[0].value = fighterData.act;
    $("#cost")[0].value = fighterData.cost;
    $("#cardText")[0].value = fighterData.cardText;
    $("#fontSize")[0].value = fighterData.fontSize;
    
    $("#cardType").val(fighterData.cardType); 

    $("#spellType").val(fighterData.spellType); 
    
    // render the updated info
    render(fighterData);
}

function defaultFighterData() {
    var fighterData = new Object;
    fighterData.name = "Grave_Card";
    fighterData.cardName = "Card Name";
    fighterData.cardText = "Body Text";
    fighterData.fontSize = 28;
    
    fighterData.cardType = "stargrave_hero"
    fighterData.spellType = "Elementalist"
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();
    
    fighterData.m = '6"';
    fighterData.f = '+3';
    fighterData.s = '+2';
    fighterData.a = '9';
    fighterData.w = '+3';
    fighterData.h = '16';
    fighterData.g = '6';
    fighterData.r = 'NA';
    fighterData.d = 'NA';
    fighterData.act = 'NA';
    fighterData.st = 'NA';
    fighterData.cost = 'NA';
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();

    return fighterData;
}

function saveFighterDataMap(newMap) {
    window.localStorage.setItem("fighterDataMap", JSON.stringify(newMap));
}

function loadFighterDataMap() {
    var storage = window.localStorage.getItem("fighterDataMap");
    if (storage != null) {
        return JSON.parse(storage);
    }
    // Set up the map.
    var map = new Object;
    map["Grave_Card"] = defaultFighterData();
    saveFighterDataMap(map);
    return map;
}

function loadLatestFighterData() {
    var latestCardName = window.localStorage.getItem("latestCardName");
    if (latestCardName == null) {
        latestCardName = "Grave_Card";
    }

    console.log("Loading '" + latestCardName + "'...");

    var data = loadFighterData(latestCardName);

    if (data) {
        console.log("Loaded data:");
        console.log(data);
    }
    else {
        console.log("Failed to load data, loading defaults.");
        data = defaultFighterData();
    }

    return data;
}

function saveLatestFighterData() {
    var fighterData = readControls();
    if (!fighterData.name) {
        return;
    }

    window.localStorage.setItem("latestCardName", fighterData.name);
    //saveFighterData(fighterData);
}

function loadFighterData(fighterDataName) {
    if (!fighterDataName) {
        return null;
    }

    var map = loadFighterDataMap();
    if (map[fighterDataName]) {
        return map[fighterDataName];
    }

    return null;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

function onload2promise(obj) {
    return new Promise((resolve, reject) => {
        obj.onload = () => resolve(obj);
        obj.onerror = reject;
    });
}

async function getBase64ImgFromUrl(imgUrl) {
    let img = new Image();
    let imgpromise = onload2promise(img); // see comment of T S why you should do it this way.
    img.src = imgUrl;
    await imgpromise;
    var imgData = getBase64Image(img);
    return imgData;
}

async function handleImageUrlFromDisk(imageUrl) {
    if (imageUrl &&
        imageUrl.startsWith("blob:")) {
        // The image was loaded from disk. So we can load it later, we need to stringify it.
        imageUrl = await getBase64ImgFromUrl(imageUrl);
    }

    return imageUrl;
}

async function saveFighterData(fighterData) {
    var finishSaving = function () {
        var map = loadFighterDataMap();
        map[fighterData.name] = fighterData;
        window.localStorage.setItem("fighterDataMap", JSON.stringify(map));
    };

    if (fighterData != null &&
        fighterData.name) {
        // handle images we may have loaded from disk...
        fighterData.imageUrl = await handleImageUrlFromDisk(fighterData.imageUrl);

        finishSaving();
    }
}

function getLatestFighterDataName() {
    return "latestFighterData";
}

window.onload = function () {
    //window.localStorage.clear();
    var fighterData = loadLatestFighterData();
    writeControls(fighterData);
    refreshSaveSlots();
}

onAnyChange = function () {
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}



onWeaponRunemarkFileSelect = function (input, weaponName) {
    var grid = $(input.parentNode).find("#weaponRunemarkSelect")[0];

    for (i = 0; i < input.files.length; i++) {
        addToImageRadioSelector(URL.createObjectURL(input.files[i]), grid, weaponName, "white");
    }
}

function addToImageCheckboxSelector(imgSrc, grid, bgColor) {
    var div = document.createElement('div');
    div.setAttribute('class', 'mr-0');
    div.innerHTML = `
    <label for="checkbox-${imgSrc}">
        <img src="${imgSrc}" width="50" height="50" alt="" style="background-color:${bgColor};">
    </label>
    <input type="checkbox" style="display:none;" id="checkbox-${imgSrc}" onchange="onTagRunemarkSelectionChanged(this, '${bgColor}')">
    `;
    grid.appendChild(div);
    return div;
}

function onClearCache() {
    window.localStorage.clear();
    location.reload();
    return false;
}

function onResetToDefault() {
    var fighterData = defaultFighterData();
    writeControls(fighterData);
}

function refreshSaveSlots() {
    // Remove all
    $('select').children('option').remove();

    var fighterDataName = readControls().name;

    var map = loadFighterDataMap();

    for (let [key, value] of Object.entries(map)) {
        var selected = false;
        if (fighterDataName &&
            key == fighterDataName) {
            selected = true;
        }
        var newOption = new Option(key, key, selected, selected);
        $('#saveSlotsSelect').append(newOption);
    }
}

async function onSaveClicked() {
    data = readControls();
    // temp null while I work out image saving
    console.log(data);
    data.base64Image = await handleImageUrlFromDisk(data.imageUrl)

    // need to be explicit due to sub arrays
    var exportObj = JSON.stringify(data, null, 4);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "grave_card_" + data.cardName.replace(/ /g, "_") + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveCardAsImage() {
    var element = document.createElement('a');
    data = readControls();
    element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
    element.setAttribute('download', "grave_card_" + data.cardName + ".png");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

$(document).ready(function () {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    // ctx.stroke();
});

async function readJSONFile(file) {
    // Function will return a new Promise which will resolve or reject based on whether the JSON file is read and parsed successfully
    return new Promise((resolve, reject) => {
        // Define a FileReader Object to read the file
        let fileReader = new FileReader();
        // Specify what the FileReader should do on the successful read of a file
        fileReader.onload = event => {
            // If successfully read, resolve the Promise with JSON parsed contents of the file
            resolve(JSON.parse(event.target.result))
        };
        // If the file is not successfully read, reject with the error
        fileReader.onerror = error => reject(error);
        // Read from the file, which will kick-off the onload or onerror events defined above based on the outcome
        fileReader.readAsText(file);
    });
}

async function fileChange(file) {
    // Function to be triggered when file input changes
    // As readJSONFile is a promise, it must resolve before the contents can be read
    // in this case logged to the console

    var saveJson = function (json) {
        writeControls(json);
    };

    readJSONFile(file).then(json =>
        saveJson(json)
    );

}

onFighterImageUpload = function () {
    image = getModelImage();
    setModelImage(image);
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}

function getFighterImageUrl() {
    var imageSelect = $("#fighterImageUrl")[0].value;
    // if (imageSelect.files.length > 0) {
    //return URL.createObjectURL(imageSelect.files[0]);
    // }
    return imageSelect;
}