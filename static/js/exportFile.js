function Exportfile(){
    let elementsdata = AllElement
    console.log("element data :  " +  elementsdata)
    let StringElementData =""
    for(let elementdata of elementsdata){
        if(elementdata.elementType == "outline"){
            let coords = elementdata.children[0].graphicsData[1].points;
            console.log(elementdata);
            StringElementData += "1" + "," + String(convert_PXtoMM(coords[0])) + "," + String(convert_PXtoMM(coords[1])) + "," + String(convert_PXtoMM(coords[2])) + "," + String(convert_PXtoMM(coords[3])) + "," + String(elementdata.angle) + "," + String(elementdata.name) + "\n";
        }else if(elementdata.elementType == "key"){
            let code  = getKeyBindData(elementdata);
            let code_string = code.join('_|_')
            StringElementData += code_string + "," + String(convert_PXtoMM(elementdata.x)) + "," + String(convert_PXtoMM(elementdata.y)) + "," + String(elementdata.angle) + "," + String(elementdata.name) + "\n";
        }else if(elementdata.elementType == "computer"){
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

function getKeyBindData(elementdata){
    let ElementBind = elementdata.MapBind;
    let code_array =[];
    for(let i=0; i<3;i++){
        for(let j=0;j<3;j++){
            code_array.push(ElementBind[i][j]);
        }
    }
    return code_array;
}

function changeCharToCode(char){
    let code=null;
    if(char.length == 1){
        let ascllNum =char.charCodeAt(0);
        //code = KeyCode_ascll[ascllNum];
        code = ascllNum;
    }else{
        code= KeyCode[char]
    }
    console.log(String(code) + ":" +String(char));
    return code;
}


var SHIFT =0x80
var KeyCode_ascll =[
        0x00,             // NUL
        0x00,             // SOH
        0x00,             // STX
        0x00,             // ETX
        0x00,             // EOT
        0x00,             // ENQ
        0x00,             // ACK
        0x00,             // BEL
        0x2a,          // BS  Backspace
        0x2b,          // TAB Tab
        0x28,          // LF  Enter
        0x00,             // VT
        0x00,             // FF
        0x00,             // CR
        0x00,             // SO
        0x00,             // SI
        0x00,             // DEL
        0x00,             // DC1
        0x00,             // DC2
        0x00,             // DC3
        0x00,             // DC4
        0x00,             // NAK
        0x00,             // SYN
        0x00,             // ETB
        0x00,             // CAN
        0x00,             // EM
        0x00,             // SUB
        0x00,             // ESC
        0x00,             // FS
        0x00,             // GS
        0x00,             // RS
        0x00,             // US
        0x2c,          // ' '
        0x1e|SHIFT,    // !
        0x34|SHIFT,    // "
        0x20|SHIFT,    // #
        0x21|SHIFT,    // $
        0x22|SHIFT,    // %
        0x24|SHIFT,    // &
        0x34,          // '
        0x26|SHIFT,    // (
        0x27|SHIFT,    // )
        0x25|SHIFT,    // *
        0x2e|SHIFT,    // +
        0x36,          // ,
        0x2d,          // -
        0x37,          // .
        0x38,          // /
        0x27,          // 0
        0x1e,          // 1
        0x1f,          // 2
        0x20,          // 3
        0x21,          // 4
        0x22,          // 5
        0x23,          // 6
        0x24,          // 7
        0x25,          // 8
        0x26,          // 9
        0x33|SHIFT,    // :
        0x33,          // ;
        0x36|SHIFT,    // <
        0x2e,          // =
        0x37|SHIFT,    // >
        0x38|SHIFT,    // ?
        0x1f|SHIFT,    // @
        0x04|SHIFT,    // A
        0x05|SHIFT,    // B
        0x06|SHIFT,    // C
        0x07|SHIFT,    // D
        0x08|SHIFT,    // E
        0x09|SHIFT,    // F
        0x0a|SHIFT,    // G
        0x0b|SHIFT,    // H
        0x0c|SHIFT,    // I
        0x0d|SHIFT,    // J
        0x0e|SHIFT,    // K
        0x0f|SHIFT,    // L
        0x10|SHIFT,    // M
        0x11|SHIFT,    // N
        0x12|SHIFT,    // O
        0x13|SHIFT,    // P
        0x14|SHIFT,    // Q
        0x15|SHIFT,    // R
        0x16|SHIFT,    // S
        0x17|SHIFT,    // T
        0x18|SHIFT,    // U
        0x19|SHIFT,    // V
        0x1a|SHIFT,    // W
        0x1b|SHIFT,    // X
        0x1c|SHIFT,    // Y
        0x1d|SHIFT,    // Z
        0x2f,          // [
        0x31,          // bslash
        0x30,          // ]
        0x23|SHIFT,    // ^
        0x2d|SHIFT,    // _
        0x35,          // `
        0x04,          // a
        0x05,          // b
        0x06,          // c
        0x07,          // d
        0x08,          // e
        0x09,          // f
        0x0a,          // g
        0x0b,          // h
        0x0c,          // i
        0x0d,          // j
        0x0e,          // k
        0x0f,          // l
        0x10,          // m
        0x11,          // n
        0x12,          // o
        0x13,          // p
        0x14,          // q
        0x15,          // r
        0x16,          // s
        0x17,          // t
        0x18,          // u
        0x19,          // v
        0x1a,          // w
        0x1b,          // x
        0x1c,          // y
        0x1d,          // z
        0x2f|SHIFT,    // {
        0x31|SHIFT,    // |
        0x30|SHIFT,    // }
        0x35|SHIFT,    // ~
        0x00              // DEL
]

var KeyCode ={
"left_ctrl":0x80,
"left_shift":0x81,
"left_alt":0x82,
"left_gui":0x83,
"right_ctrl":0x84,
"right_shift":0x85,
"right_alt":0x86,
"right_gui":0x87,
"up":0xda,
"down":0xd9,
"left":0xd8,
"right":0xd7,
"backspace":0xb2,
"tab":0xb3,
"return":0xb0,
"esc":0xb1,
"insert":0xd1,
"delete":0xd4,
"page_up":0xd3,
"page_down":0xd6,
"home":0xd2,
"end":0xd5,
"caps_lock":0xc1,
"F1":0xC2,
"F2":0xC3,
"F3":0xC4,
"F4":0xC5,
"F5":0xC6,
"F6":0xC7,
"F7":0xC8,
"F8":0xC9,
"F9":0xCA,
"F10":0xCB,
"F11":0xCC,
"F12":0xCD,
"F13":0xF0,
"F14":0xF1,
"F15":0xF2,
"F16":0xF3,
"F17":0xF4,
"F20":0xF7,
"F21":0xF8,
"F22":0xF9,
"F23":0xFA,
"F24":0xFB,
}



$(function() {
    // 入力補完候補の単語リスト
    var wordlist = Object.keys(KeyCode);
    
    // 入力補完を実施する要素に単語リストを設定
    $("#input_Bind_0").autocomplete({
        source: wordlist
      });
      $("#input_Bind_1").autocomplete({
        source: wordlist
      });
    $("#input_Bind_2").autocomplete({
      source: wordlist
    });
  });