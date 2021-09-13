
//pixijsのcanvas初期設定
var app = new PIXI.Application({view : document.getElementById("canvas1"),backgroundColor : 0xeeeeee,resolution: window.devicePixelRatio || 1,autoResize: true});
document.body.appendChild(app.view);
app.stage.sortableChildren = true;
app.stage.on('pointermove', (ev)=>{
    const newPosition = ev.data.getLocalPosition(app.stage);
    let mouseX= gridsize*Math.trunc(newPosition.x/gridsize);
    let mouseY= gridsize*Math.trunc(newPosition.y/gridsize);
    if(mouseX < 0){
        mouseX=0;
    }
    if(mouseY < 0){
        mouseY=0;
    }
    MouseCoord.innerText=mouseX + " " +mouseY;
});
//初期データ~~~~~~~~~~~~~~~~~~~~~~~~~
var canvasWidth_mm = 500;
var canvasHeight_mm = canvasWidth_mm * 0.4;
var selectElement;


var KeyTypes=["cherryMX_hotswap"];
var computerTypes=["pro_micro"];


var canvas_w,canvas_h
var keyWidth_mm =15.6;
var keyHeight_mm = 15.6;
var keyContainers = [];
var keyContainerId = 0;


var computerHeight_mm=34.798
var computerWidth_mm=17.8
var usbHeight_mm = 7.5;
var usbWidth_mm  = 6;
var ComputerContainer = new PIXI.Container();

var colorOutline = 0xffa500;
var AllElement= [];
var DragPointArray = [];
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//windowのevent
window.addEventListener('load',canvas_resize,false);
window.addEventListener('load',drawGrid,false);

//HTML要素の読み込み&初期設定
var InputGridsize = document.getElementById('gridsize');
var SwitchShowGrid = document.getElementById('SwitchShowGrid');
var MouseCoord = document.getElementById("mousecoord");
var selectedFile = document.getElementById('file-input');

var InputKeyCoordX = document.getElementById("input_coord_x");
var InputKeyCoordY = document.getElementById("input_coord_y");
var InputKeyAngle = document.getElementById("input_degree");

InputGridsize.addEventListener('change',drawGrid);
SwitchShowGrid.addEventListener('change',drawGrid);
InputKeyCoordX.addEventListener('change',changeElementInfo);
InputKeyCoordY.addEventListener('change',changeElementInfo);
InputKeyAngle.addEventListener('change',changeElementInfo);
gridsize = Number(InputGridsize.value);


function canvas_resize(){
    //KeysResize()
// ブラウザのウインドウサイズを取得する
app.renderer.autoResize = true;
app.stage.interactive = true;
canvas_w = window.innerWidth;
canvas_h = window.innerHeight;
app.renderer.resize(canvas_w,canvas_w*0.4);
console.log(canvas_w);
console.log(canvas_h);

};

//file系の処理~~~~~~~~~~~~~~~~~~~~~


//layerFileの読み込み
selectedFile.addEventListener("change",function(evt){

    var file = evt.target.files;
  
    //FileReaderの作成
    var reader = new FileReader();
    //テキスト形式で読み込む
    reader.readAsText(file[0]);

    var inputfile
    reader.onload = function(ev){
        inputfile = reader.result;
        console.log(inputfile)
        drawElement(inputfile)
      }
    
  },false);

function drawElement(file){
    elements = convertCsvtoArray(file);
    for(element of elements){
        let type = element[element.length - 1];
        if(type == "outline"){
            Draw_Outline(element);
        }else if(computerTypes.includes(type)){
            addComputer(element);
        }else if(KeyTypes.includes(type)){
            addKey(element);
        }
    }
}

function Exportfile(){
    let elementsdata = AllElement
    console.log("element data :  " +  elementsdata)
    let StringElementData =""
    for(let elementdata of elementsdata){
        if(elementdata.elementType == "outline"){
            let coords = elementdata.children[0].graphicsData[1].points;
            console.log(elementdata);
            StringElementData += "1" + "," + String(convert_PXtoMM(coords[0])) + "," + String(convert_PXtoMM(coords[1])) + "," + String(convert_PXtoMM(coords[2])) + "," + String(convert_PXtoMM(coords[3])) + "," + String(elementdata.angle) + "," + String(elementdata.name) + "\n";
        }else if(elementdata.elementType == "key" || elementdata.elementType == "computer"){
            StringElementData += "1" + "," + String(convert_PXtoMM(elementdata.x)) + "," + String(convert_PXtoMM(elementdata.y)) + "," + String(elementdata.angle) + "," + String(elementdata.name) + "\n";
        }

    }
    console.log(StringElementData)
    let blob = new Blob([StringElementData],{type:"text/plan"});
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'layout.csv';
    link.click();
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//canvas処理系~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function addKey(data){
    KeyType = "cherryMX_hotswap"
    let x=convert_MMtoPX(canvasWidth_mm/2);
    let y=convert_MMtoPX(0);
    let angle=0;
    if(data != null){
        x=convert_MMtoPX(data[1]);
        y=convert_MMtoPX(data[2]);
        angle=data[3]
        ComputerType = data[4];
    }
    keyContainerId++;
    var keyContainer = new PIXI.Container();
    keyContainer.interactive = true;
    keyContainer.buttonMode = true;
    app.stage.addChild(keyContainer);

    let key_width = convert_MMtoPX(keyWidth_mm);
    let key_height = convert_MMtoPX(keyHeight_mm);
    let centerX =key_width/2;
    let centerY =key_height/2;
    let key_lefttopX = centerX - key_width/2;
    let key_lefttopY = centerY - key_height/2;
    let key_rightbottomX = centerX + key_width/2;
    let key_rightbottomY = centerY + key_height/2;

    let key = new PIXI.Graphics()
    .lineStyle(2,393E46)
    .beginFill(0xffffff)
    .drawRoundedRect(-centerX,-centerY,key_width,key_height,2)
    .endFill()
    

    key.align='center'

    keyContainer.addChild(key);
    


    keyContainer
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)

    //keyContainersInfo = [keyContainerId,keyContainer,KeyType];
    keyContainer.name = KeyType;
    keyContainer.elementType = "key";
    AllElement.push(keyContainer);


    keyContainer.pivot.x=0.5;
    keyContainer.pivot.y=0.5;
    keyContainer.x= x;
    keyContainer.y =y ;
    keyContainer.angle=angle;
    keyContainer.zIndex=10;

}

function addComputer(data){
    ComputerContainer.destroy();
    computerType = "pro_micro";
    let x=convert_MMtoPX(canvasWidth_mm/2);
    let y=convert_MMtoPX(0);
    let angle=0;
    if(data != null){
        x=convert_MMtoPX(data[1]);
        y=convert_MMtoPX(data[2]);
        angle=data[3]
        ComputerType = data[4];
    }
    
    console.log("called addcomputer")
    ComputerContainer = new PIXI.Container();
    ComputerContainer.interactive = true;
    ComputerContainer.buttonMode = true;
    app.stage.addChild(ComputerContainer);

    let computerWidth = convert_MMtoPX(computerWidth_mm);
    let computerHeight = convert_MMtoPX(computerHeight_mm);
    let centerX =computerWidth/2;
    let centerY =computerHeight/2;


    let computer = new PIXI.Graphics()
    .lineStyle(3,393E46)
    .beginFill(0xffffff)
    .drawRoundedRect(-centerX,-centerY,computerWidth,computerHeight,1)
    .endFill()


    let usbHeight = convert_MMtoPX(usbHeight_mm);
    let usbWidth = convert_MMtoPX(usbWidth_mm); 
    let usb = new PIXI.Graphics()
    .lineStyle(3,393E46)
    .beginFill(0x000000)
    .drawRoundedRect(convert_MMtoPX((computerWidth_mm-usbWidth_mm)/2)-centerX,0-centerY,usbWidth,usbHeight,0)
    .endFill()
    

    computer.align='center'

    ComputerContainer
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)


        




    /*const keybind_text = new PIXI.Text("a");
    keybind_text.align = "center";
    keybind_text.style.fill = "#393E46";
    keybind_text.x = key.width/2-10;
    keybind_text.y = key.height/2-20;

    keyContainer.addChild(keybind_text);
    */
    ComputerContainer.pivot.x=0.5;
    ComputerContainer.pivot.y=0.5;
    ComputerContainer.x= x;
    ComputerContainer.y =y ;
    ComputerContainer.angle=angle;
    ComputerContainer.zIndex=10;
    //keyContainer.rotation=Math.pi/4*0;
    ComputerContainer.addChild(computer);
    ComputerContainer.addChild(usb);
    ComputerInfo=[1,ComputerContainer,computerType];
    ComputerContainer.name = computerType;
    ComputerContainer.elementType = "computer";

    AllElement.push(ComputerContainer);

}

function Draw_Outline(data){//基板外形の描画処理
    let startX = convert_MMtoPX(10);
    let startY = convert_MMtoPX(10);
    let endX = convert_MMtoPX(100);
    let endY = convert_MMtoPX(100);
    let HitAreaWidth = 10;

    if(data != null){
        startX=convert_MMtoPX(data[1]);
        startY=convert_MMtoPX(data[2]);
        endX=convert_MMtoPX(data[3]);
        endY=convert_MMtoPX(data[4]);
    }

    var outlineContainer = new PIXI.Container();
    outlineContainer.interactive = true;
    let outline = new PIXI.Graphics()

    outline.interactive = true;
    outline.buttonMode = true;


    let HitArea = new PIXI.Polygon(startX-2,startY-2,
                        startX+2,startY-2,
                        endX+2,endY-2,
                        endX-2,endY+2);
    
    outline.beginFill(0xffffff, 0); //ヒットエリアは透明
    outline.drawShape(HitArea);
    outline.endFill();
    outline
        .lineStyle(2,colorOutline)
        .moveTo(startX,startY)
        .lineTo(endX,endY);


    outline.hitArea = HitArea;

    outline.container = outlineContainer;


    outline.on('pointerdown', generateDragPoint);
    outline.generatedPoint = false;
    //console.log("setting outline event");
    outlineContainer.addChild(outline);
    //console.log(outlineContainer);
    app.stage.addChild(outlineContainer);
    outlineContainer.zIndex = 10;
    
    outlineContainer.name = "outline";
    outlineContainer.elementType = "outline";
    AllElement.push(outlineContainer);


}

//canvas操作~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function setSelectElement(targetElement){
    console.log("selected ElementName is "+targetElement.elementType);

    console.log(selectElement)
    if(targetElement.elementType == "key" || targetElement.elementType == "computer"){
        InputKeyCoordX.value = convert_PXtoMM(targetElement.x)
        InputKeyCoordY.value = convert_PXtoMM(targetElement.y)
        InputKeyAngle.value = targetElement.angle   
    }else if(targetElement.elementType == "outline"){
    }else if(targetElement.elementType =="outline_dot"){
        console.log("called");
        clearTimeout(targetElement.timer);
        let deleteDragPoint_id= setTimeout(deleteDragPoint,3000,[targetElement,targetElement.pare]);
        targetElement.timer = deleteDragPoint_id;
        InputKeyCoordX.value = convert_PXtoMM(targetElement.x)
        InputKeyCoordY.value = convert_PXtoMM(targetElement.y)
        InputKeyAngle.value = targetElement.angle
    }

}
function deleteElement(){
    if(AllElement.includes(selectElement)){
        let ArrayIndex = 0;
        for(let element of AllElement){
            if(element == selectElement){
                AllElement.splice(ArrayIndex,1);
                app.stage.removeChild(selectElement);
            }
            ArrayIndex++;
        }
    }else{
        console.log("no matching!!!!!!!!!!!");
    }
    console.log(AllElement);
}

var GridContainer = new PIXI.Container();
function drawGrid(e){
    gridsize = Number(document.getElementById("gridsize").value);
    GridContainer.destroy({children:true, texture:true, baseTexture:true});
    if(gridsize <= 2){
        SwitchShowGrid.checked=false;
    }
    if(SwitchShowGrid.checked){
        //console.log("call drawGrid!! is"+gridsize)
        
        GridContainer = new PIXI.Container();
        let rowmax = convert_MMtoPX(canvasWidth_mm/gridsize)
        let columnmax = convert_MMtoPX(canvasHeight_mm/gridsize)

        for(let row=0;row < rowmax;row++){
            for(let column=0; column < columnmax; column++){
                let dot = new PIXI.Graphics()
                    .beginFill(0xffffff)
                    .drawCircle(0,0,2)
                    .endFill();
                //dot.zIndex = 0;

                GridContainer.addChild(dot)

                dot.x=convert_MMtoPX(gridsize*row);
                dot.y=convert_MMtoPX(gridsize*column)
            }
        }
        app.stage.addChild(GridContainer)    
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//outlineの処理系~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function generateDragPoint(){
    selectElement = null//outlineの移動機能は実装しないため、outlineclick時にはnullにする。
    if(!this.generatedPoint){
        this.generatedPoint = true;
        let dotColor = 0x777777;
        console.log("clicked line!!!");
        coord = this.graphicsData[1].points;
        console.log(this);

        let startDot = new PIXI.Graphics()
                        .beginFill(dotColor)
                        .drawCircle(0,0,4)
                        .endFill();

        startDot.x = coord[0];
        startDot.y = coord[1];
        startDot.interactive =true;
        startDot.buttonMode =true;
        let endDot = new PIXI.Graphics()
                        .beginFill(dotColor)
                        .drawCircle(0,0,4)
                        .endFill();
        endDot.x = coord[2];
        endDot.y = coord[3];
        endDot.interactive =true;
        endDot.buttonMode =true;

        startDot
            .on('pointerdown', onDragStart_outline)
            .on('pointerup', onDragEnd_outline)
            .on('pointerupoutside', onDragEnd_outline)
            .on('pointermove', onDragMove_outline_startDot)


        endDot
            .on('pointerdown', onDragStart_outline)
            .on('pointerup', onDragEnd_outline)
            .on('pointerupoutside', onDragEnd_outline)
            .on('pointermove', onDragMove_outline_endDot)
        
        this.container.addChild(startDot);
        this.container.addChild(endDot);

        endDot.elementType="outline_dot"
        startDot.elementType="outline_dot"

        startDot.pare = endDot;
        endDot.pare = startDot;
        
        startDot.container = this.container;
        endDot.container = this.container;
        startDot.outline = this;
        endDot.outline = this;
        //DragPointArray.push([startDot,endDot]);
        let deleteDragPoint_id= setTimeout(deleteDragPoint,3000,[startDot,endDot]);
        startDot.timer = deleteDragPoint_id;
        endDot.timer = deleteDragPoint_id;
    }
}

function deleteDragPoint(DragPoint){
    console.log(DragPoint)
    DragPoint[0].outline.generatedPoint = false;
    DragPoint[1].outline.generatedPoint = false;

    let container = DragPoint[0].container;
    console.log(container);
    container.removeChild(DragPoint[0]);
    container.removeChild(DragPoint[1]);
}

function changeElementInfo(){
    console.log(selectElement.elementType)
    if(selectElement.elementType != "outline"){
        let X= convert_MMtoPX(InputKeyCoordX.value);
        let Y= convert_MMtoPX(InputKeyCoordY.value);
        let Angle= InputKeyAngle.value;
        selectElement.x=X;
        selectElement.y=Y;
        selectElement.angle=Angle;

        console.log("selected ElementName is "+selectElement.elementType);

        console.log(selectElement)
        if(selectElement.elementType == "key" || selectElement.elementType == "computer"){
            let X= convert_MMtoPX(InputKeyCoordX.value);
            let Y= convert_MMtoPX(InputKeyCoordY.value);
            let Angle= InputKeyAngle.value;
            selectElement.x=X;
            selectElement.y=Y;
            selectElement.angle=Angle;
        }else if(selectElement.elementType == "outline"){

        }else if(selectElement.elementType =="outline_dot"){
            clearTimeout(selectElement.timer);
            clearTimeout(selectElement.pare.timer);
            let deleteDragPoint_id= setTimeout(deleteDragPoint,3000,[selectElement,selectElement.pare]);
            selectElement.timer = deleteDragPoint_id;
            selectElement.pare.timer= deleteDragPoint_id;
            let X= convert_MMtoPX(InputKeyCoordX.value);
            let Y= convert_MMtoPX(InputKeyCoordY.value);
            let Angle= InputKeyAngle.value;
            selectElement.x=X;
            selectElement.y=Y;
            selectElement.angle=Angle;
            updateOutLine(selectElement,[selectElement.x,selectElement.y,selectElement.pare.x,selectElement.pare.y]);
            
    }
    }
}



//変換系関数~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function convertCsvtoArray(csvData){
    var tempArray = csvData.split("\n");
    var csvArray = new Array();
    for(var i = 0; i<tempArray.length;i++){
    csvArray[i] = tempArray[i].split(",");
    }
    return csvArray;
  }

//座標変換
function convert_MMtoPX(coord_mm){
    canvasWidth_mm= 500;
    let PXperMM =canvas_w/ canvasWidth_mm;
    let coord_px = PXperMM * coord_mm;
    return coord_px;
}

function convert_PXtoMM(coord_px){
    canvasWidth_mm=500;
    let MMperPX = canvasWidth_mm / canvas_w ;
    let coord_mm = MMperPX * coord_px;
    return coord_mm
}
var gridsize = 20;//mm
function convertGrid(coord){
    gridsize = Number(document.getElementById("gridsize").value);
    let grid;
    if(gridsize !== 1){
        console.log(gridsize)
        grid= convert_MMtoPX(gridsize)*Math.round(coord/convert_MMtoPX(gridsize));
        console.log("grid is " + grid)
    }else{
        grid=coord;
    }
    return grid;
    
}




//elementのイベント~~~~~~~~~~~~~~~~~~~~~~~~~
let dX,dY
function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    selectElement=this;
    setSelectElement(this)
    //KeyAngle = Number(InputKeyAngle.value);
    //this.angle=KeyAngle;
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    const startPosition = this.data.getLocalPosition(this.parent);
    dX = this.x - startPosition.x;//keyのX座標とクリックした座標の差を取る（キーをclickした時に位置が移動しないように）
    dY = this.y - startPosition.y;//keyのY座標とクリックした座標の差を取る（キーをclickした時に位置が移動しないように）
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    //let key_width = convert_MMtoPX(keyWidth_mm);
    //let key_height = convert_MMtoPX(keyHeight_mm);
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = convertGrid(newPosition.x);
        this.y = convertGrid(newPosition.y);
        setSelectElement(this)
    }

}

function onDragStart_outline(event) {
    selectElement=this;
    setSelectElement(this);
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    clearTimeout(this.timer);
    //const startPosition = this.data.getLocalPosition(this.parent);
    //dX = this.x - startPosition.x;//keyのX座標とクリックした座標の差を取る（キーをclickした時に位置が移動しないように）
    //dY = this.y - startPosition.y;//keyのY座標とクリックした座標の差を取る（キーをclickした時に位置が移動しないように）
}

function onDragEnd_outline() {
    this.alpha = 1;
    this.dragging = false;
    let deleteDragPoint_id= setTimeout(deleteDragPoint,3000,[this,this.pare]);
    this.timer = deleteDragPoint_id;
    this.pare.timer = deleteDragPoint_id;

    // set the interaction data to null
    //this.data = null;
}

function onDragMove_outline_startDot() {
    //let key_width = convert_MMtoPX(keyWidth_mm);
    //let key_height = convert_MMtoPX(keyHeight_mm);
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        let X = convertGrid(newPosition.x);
        let Y = convertGrid(newPosition.y);
        this.x=X;
        this.y=Y;
        let pare = this.pare;
        updateOutLine(this,[X,Y,pare.x,pare.y]);
        setSelectElement(this);

    }

}

function onDragMove_outline_endDot() {
    //let key_width = convert_MMtoPX(keyWidth_mm);
    //let key_height = convert_MMtoPX(keyHeight_mm);
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        let X = convertGrid(newPosition.x);
        let Y = convertGrid(newPosition.y);
        this.x=X;
        this.y=Y;
        let pare = this.pare;

        updateOutLine(this,[pare.x,pare.y,X,Y]);
        setSelectElement(this);
    }
}

function updateOutLine(point,coordinate){
    console.log(point)
    let container = point.container;
    console.log(container.children);
    container.children[0].clear();
    //container.removeChild(container.children[0]);
    //container.children[0].destroy();
    
    console.log(container.children);

    let startX = coordinate[0];
    let startY = coordinate[1];
    let endX = coordinate[2];
    let endY = coordinate[3];
    let HitAreaWidth = 10;


    let outlineContainer = container
    let outline = container.children[0];

    outline.interactive = true;
    outline.buttonMode = true;

    let HitArea = new PIXI.Polygon(startX-2,startY-2,
                        startX+2,startY-2,
                        endX+2,endY-2,
                        endX-2,endY+2);
    
    outline.beginFill(0xffffff, 0); //ヒットエリアは透明
    outline.drawShape(HitArea);
    outline.endFill();
    outline
        .lineStyle(2,colorOutline)
        .moveTo(startX,startY)
        .lineTo(endX,endY);


    outline.hitArea = HitArea;
    console.log(outline);

    
    outline.container = outlineContainer;
    outline.on('click', generateDragPoint);
    //console.log("setting outline event");
    //outline.container = outlineContainer;
    //outlineContainer.addChild(outline);    
    //app.stage.addChild(outlineContainer);
    //renderer.render(container);
}