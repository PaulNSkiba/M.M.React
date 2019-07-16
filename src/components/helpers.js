/**
 * Created by Paul on 06.01.2019.
 */
/* eslint-disable */
export const ISDEBUG = true;
export const instanceLocator = "v1:us1:6150d554-65a3-4c66-897a-bc65b2a5402d"
export const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/6150d554-65a3-4c66-897a-bc65b2a5402d/token"
export const chatUserName = "my-marks"

let mainDiv = document.createElement("div")//document.getElementById("markblank")
// let curCell = {r:0, c:0}

addClickToA()

function addClickToA() {
    var anchors = mainDiv.getElementsByTagName("a")
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function (e) {
            console.log('addClickToA')
            mainDiv.style.display="none"
        })
    }
}

export const msgTimeOut = 4000
export var subjectsforclasses = [
    [],//0 - просто, щоб було - всегда пустое
    [],//1
    [],//2
    [],//3
    [],//4
    ['Англійська мова','Українська мова','Укр. література','Фізкультура','Трудове навчання','Логіка','Математика',
        'Природознавство','Історія України','Основи здоров\'я','Інформатика','Зар. література','Музичне мистецтво',
    ],//5 - 13
    ['Англійська мова','Українська мова','Укр. література','Фізкультура','Трудове навчання','Логіка','Математика',
        'Основи здоров\'я','Інформатика','Зар. література','Географія','Біологія','Історія ст. світу','Музичне мистецтво'
    ],//6
    ['Англійська мова','Українська мова','Укр. література','Фізкультура','Трудове навчання','Музичне мистецтво',
        'Історія України','Основи здоров\'я','Інформатика','Зар. література','Географія','Біологія','Всесвітня історія',
        'Алгебра','Хімія','Геометрія','Фізика'
    ],//7
    ['Англійська мова','Українська мова','Укр. література','Фізкультура','Трудове навчання','Історія України',
        'Основи здоров\'я','Інформатика','Зар. література','Географія','Біологія','Всесвітня історія','Алгебра',
        'Хімія','Геометрія','Фізика','Мистецтво'
    ],//8
    ['Алгебра','Англійська мова','Біологія','Всесвітня історія','Географія','Геометрія','Зар. література','Інформатика',
        'Мистецтво','Правознавство','Трудове навчання','Укр. література','Українська мова','Фізика','Фізкультура','Хімія'
    ],//9
    ['Алгебра','Англійська мова','Біологія','Всесвітня історія','Географія','Геометрія','Громад. освіта','Зар. література',
        'ЗВ/МСП','Інформатика','Історія України','Мистецтво','Укр. література','Українська мова','Фізика','Фізкультура','Хімія'
    ],//10
    [
        'Алгебра','Англійська мова','Біологія','Всесвітня історія','Геометрія','Екологія','Економіка','ЗВ/МСП',
        'Історія України','Технології','Укр. література','Українська мова','Фізика','Фізкультура','Хімія'
    ]//11
]
export var subjectsforclassesjson = [
    [],//0 - просто, щоб було - всегда пустое
    [],//1
    [],//2
    [],//3
    [],//4
    [
        {name:'Англійська мова'},{name:'Українська мова'},{name:'Укр. література'},{name:'Фізкультура'},{name:'Трудове навчання'},{name:'Логіка'},{name:'Математика'},
        {name:'Природознавство'},{name:'Історія України'},{name:'Основи здоров\'я'},{name:'Інформатика'},{name:'Зар. література'},{name:'Музичне мистецтво'},
    ],//5 - 13
    ['Англійська мова','Українська мова','Укр. література','Фізкультура','Трудове навчання','Логіка','Математика',
        'Основи здоров\'я','Інформатика','Зар. література','Географія','Біологія','Історія ст. світу','Музичне мистецтво'
    ],//6
    ['Англійська мова','Українська мова','Укр. література','Фізкультура','Трудове навчання','Музичне мистецтво',
        'Історія України','Основи здоров\'я','Інформатика','Зар. література','Географія','Біологія','Всесвітня історія',
        'Алгебра','Хімія','Геометрія','Фізика'
    ],//7
    ['Англійська мова','Українська мова','Укр. література','Фізкультура','Трудове навчання','Історія України',
        'Основи здоров\'я','Інформатика','Зар. література','Географія','Біологія','Всесвітня історія','Алгебра',
        'Хімія','Геометрія','Фізика','Мистецтво'
    ],//8
    ['Алгебра','Англійська мова','Біологія','Всесвітня історія','Географія','Геометрія','Зар. література','Інформатика',
        'Мистецтво','Правознавство','Трудове навчання','Укр. література','Українська мова','Фізика','Фізкультура','Хімія'
    ],//9
    ['Алгебра','Англійська мова','Біологія','Всесвітня історія','Географія','Геометрія','Громад. освіта','Зар. література',
        'ЗВ/МСП','Інформатика','Історія України','Мистецтво','Укр. література','Українська мова','Фізика','Фізкультура','Хімія'
    ],//10
    [
        'Алгебра','Англійська мова','Біологія','Всесвітня історія','Геометрія','Екологія','Економіка','ЗВ/МСП',
        'Історія України','Технології','Укр. література','Українська мова','Фізика','Фізкультура','Хімія'
    ]//11
]

// export default subjects;

/**
 * Convert an integer to its words representation
 *
 * @author McShaman (http://stackoverflow.com/users/788657/mcshaman)
 * @source http://stackoverflow.com/questions/14766951/convert-digits-into-words-with-javascript
 */
export function numberToLang(n, custom_join_character, lang) {
    var string = n.toString(),
        units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;
    var and = custom_join_character || 'and';
    /* Is number zero? */
    switch (lang) {
        case 'eng' :
        if (parseInt(string) === 0)
        {
            return 'zero';
        }
            /* Array of units as words */
            units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            /* Array of tens as words */
            tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
            /* Array of scales as words */
            scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];
        break;
        case 'ukr' :
            if (parseInt(string) === 0)
            {
                return 'нуль';
            }
            /* Array of units as words */
            units = ['', 'один', 'два', 'три', 'чотири', 'п\'ять', 'шість', 'сім', 'вісім', 'дев\'ять', 'десять', 'одинадцять', 'дванадцять', 'тринадцять', 'чотирнадцять', 'п\'ятнадцять', 'шістнадцять', 'сімнадцять', 'вісімнадцять', 'дев\'ятнадцять'];
            /* Array of tens as words */
            tens = ['', '', 'двадцять', 'тридцять', 'сорок', 'п\'ятдесят', 'шістдесят', 'сімдесят', 'вісімдесят', 'дев\'яносто'];
            /* Array of scales as words */
            scales = ['', 'тисяча', 'мильйон', 'мільярд', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];
            break;
        case 'rus' :
            if (parseInt(string) === 0)
            {
                return 'ноль';
            }
            /* Array of units as words */
            units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
            /* Array of tens as words */
            tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятдесят', 'шестьдесят', 'семдесят', 'восемдесят', 'девяносто'];
            /* Array of scales as words */
            scales = ['', 'тысяча', 'миллион', 'миллиард', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];
            break;
    }
    /* Split user arguemnt into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while (start > 0) {
        end = start;
        chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }
    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
        return '';
    }
    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {
        chunk = parseInt(chunks[i]);
        if (chunk) {
            /* Split chunk into array of individual integers */
            ints = chunks[i].split('').reverse().map(parseFloat);
            /* If tens integer is 1, i.e. 10, then add 10 to units integer */
            if (ints[1] === 1) {
                ints[0] += 10;
            }
            /* Add scale word if chunk is not zero and array item exists */
            if ((word = scales[i])) {
                words.push(word);
            }
            /* Add unit word if array item exists */
            if ((word = units[ints[0]])) {
                words.push(word);
            }
            /* Add tens word if array item exists */
            if ((word = tens[ints[1]])) {
                words.push(word);
            }
            /* Add 'and' string after units or tens integer if: */
            if (ints[0] || ints[1]) {
                /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                if (ints[2] || !i && chunksLen) {
                    words.push(and);
                }
            }
            /* Add hundreds word if array item exists */
            if ((word = units[ints[2]])) {
                words.push(word + ' hundred');
            }
        }
    }
    var str = words.reverse().join(custom_join_character).trimStart()
    return str.charAt(0).toUpperCase() + str.slice(1); //words.reverse().join(custom_join_character).trimStart();
};

export function saveToLocalStorage(userId, elemID, kind, key, isActive) {
    // classList
    var locStrgKey =userId +'#'+ kind +'#'+elemID
    let mp = "";
    if (window.localStorage.getItem(locStrgKey)) {
        // console.log(window.localStorage.getItem(locStrgKey))
        mp = JSON.parse(window.localStorage.getItem(locStrgKey))
        // console.log(mp)
        if (isActive)
            mp[key] = true
        else
            delete mp[key]
        // console.log('UpdExists', mp, JSON.stringify(mp))
        window.localStorage.setItem(locStrgKey, JSON.stringify(mp))
    }
    else {
        mp = Object.create(null); //window.localStorage.getItem(user_.id+'#classList')
        mp[key] = true
        console.log('AddNew', mp, JSON.stringify(mp))
        window.localStorage.setItem(locStrgKey, JSON.stringify(mp))
    }
}

export function isSetInLocalStorage(userId, elemID, kind, key) {
    // var subjs = subjectsforclasses[elemID]
    var locStrgKey =userId +'#'+ kind +'#'+elemID

    // console.log("isSetInLocalStorage", userId, elemID, kind, key)
    // for(var i = 0; i < subjs.length; i++) {

        if (window.localStorage.getItem(locStrgKey)) {
            // console.log(window.localStorage.getItem(locStrgKey))
            var mp = JSON.parse(window.localStorage.getItem(locStrgKey))

            if (mp[key])
                return true;
            else
                return false
        }
    // }
}

export function getSubjCountFromStorage(userId, elemID, kind) {
    console.log("elemID", elemID)
    var subjs = subjectsforclasses[elemID]
    var locStrgKey =userId +'#'+ kind +'#'+elemID
    var j  = 0
    // console.log("isSetInLocalStorage", userId, elemID, kind, key)
    for(var i = 0; i < subjs.length; i++) {

        if (window.localStorage.getItem(locStrgKey)) {
            // console.log(window.localStorage.getItem(locStrgKey))
            var mp = JSON.parse(window.localStorage.getItem(locStrgKey))

            if (mp[subjs[i]])
                j++
        }
    }
    return subjs.length + "/" + j
}

export function getUserId() {
    return 1;
}
export function getSelectedSubjectsForClasses(userId, elemID, kind){
    var subjs = subjectsforclasses[elemID]
    var locStrgKey =userId +'#'+ kind +'#'+elemID
    // var j  = 0
    var arrayReturned = []
    // console.log("isSetInLocalStorage", userId, elemID, kind, key)
    for(var i = 0; i < subjs.length; i++) {

        if (window.localStorage.getItem(locStrgKey)) {
            // console.log(window.localStorage.getItem(locStrgKey))
            var mp = JSON.parse(window.localStorage.getItem(locStrgKey))

            if (mp[subjs[i]])
                arrayReturned.push(subjs[i])
        }
    }
    return arrayReturned

}

export function makeHeader(colCount, curTable, dateFrom) {
    var curMonth = -1; //dateFrom.getMonth()
    var thead = document.createElement("thead")
    var curRow = document.createElement("tr")
    var curRow2 = document.createElement("tr")

    curTable.appendChild(thead)
    thead.appendChild(curRow)
    thead.appendChild(curRow2)
    var firstCol = 2
    for (var i = 0; i < colCount + 2; i++){
        var curHeader0 = document.createElement("th")
        var curHeader = document.createElement("th")
        curHeader.id = "h" + 0 + "c" + i
        switch(i){
            case 0:
                // curHeader.setAttribute("width", "50px")
                curRow.appendChild(curHeader)
                curHeader.innerHTML = "№ п/п"
                curHeader.setAttribute("rowspan", 2)
                // curHeader.classList.add("headerFirst")
                break;
            case 1:
                curRow.appendChild(curHeader)
                curHeader.innerHTML = "Имя/Ник"
                curHeader.setAttribute("rowspan", 2)
                break;
            default:
                curRow2.appendChild(curHeader)
                var date = AddDay(dateFrom, (i-2))
                // console.log(date)

                var shortDate = date.getDate() // + '.' + (date.getMonth() + 1)
                curHeader.innerHTML = shortDate
                if (!(curMonth === date.getMonth())) {
                    curRow.appendChild(curHeader0)
                    curHeader0.setAttribute("colspan", getSpanCount(date, colCount + 2 - i))
                    curMonth = date.getMonth()
                    curHeader0.innerHTML = (curMonth + 1) + "." + date.getFullYear()
                }
                break;
        }

    }
}
// Function get count of cells to be merged by "colspan"
export function getSpanCount(dateStart, dateCnt, woholidays) {
    var daysToReturn = 0;
    var curMonth = dateStart.getMonth()
    for (var i = 0; i < dateCnt; i++) {
        if ((woholidays && AddDay(dateStart, i).getDay() > 0 && AddDay(dateStart, i).getDay() < 6) || (!woholidays))
        {
            if (AddDay(dateStart, i).getMonth() === curMonth) {
                daysToReturn++;
            }
        }
    }
    // console.log(dateStart, daysToReturn)
    return daysToReturn;
}
export function dateDiff(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}
export let arrOfWeekDays = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
// AddDay function (format MM-DD-YYY)
export function AddDay(strDate,intNum)
{
    var sdate =  new Date(strDate);
    sdate.setDate(sdate.getDate()+intNum);
    return new Date(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
}

export default function createHtmlGrid(rows, columns, parent, dateFrom, dateTo) {
    var curTable, curRow, curCol, ul, li, span
    let mainDiv = document.createElement("div")//document.getElementById("markblank")
    let curCell = {r:0, c:0}

    parent.innerHTML = ""

    // console.log("dateFrom", dateFrom)

    curTable = document.createElement("table")
    curTable.classList.add("markTable")


    makeHeader(columns, curTable, dateFrom)
    // columns = dateFrom - dateTo
    let tbody = document.createElement("tbody")
    curTable.appendChild(tbody)
    tbody.style.height = (window.screen.height * 0.8).toString()
    for (var i = 0; i < rows; i++) {
        curRow = document.createElement("tr")
        tbody.appendChild(curRow)
        for (var j = 0; j < columns + 2; j++){

            curCol = document.createElement("td")
            curCol.id = "r" + i + "c" + j
            span = document.createElement("span")
            span.classList.add("marks")
            curCol.appendChild(span)

            curCol.addEventListener("click", function (e) {

                console.log("clickGrid", e.target, curCell, e.target.nodeName, curRow, curCol)

                if (e.target.nodeName === "TD") {
                    var curRow = e.target.id.split("c")[0].replace("r", "")
                    var curCol = e.target.id.split("c")[1].replace("c", "")
                }


                if (curCell.r === curRow && curCell.c === curCol) {
                    mainDiv.classList.toggle("dontshow")
                    mainDiv.classList.toggle("show")
                }
                else {
                    mainDiv.classList.remove("show")
                    mainDiv.classList.add("show")
                }

                if (e.target.nodeName === "TD") {
                    // Подсветитим ячейку столбца и строки

                    // e.target.classList.add("selected-font")
                    document.getElementById("r"+curCell.r+"c1").classList.remove("selected-font")
                    document.getElementById("h"+0+"c"+curCell.c).classList.remove("selected-font")
                    curCell.r = curRow
                    curCell.c = curCol
                    document.getElementById("r"+curCell.r+"c1").classList.add("selected-font")
                    document.getElementById("h"+0+"c"+curCell.c).classList.add("selected-font")
                }

                if (mainDiv.classList.contains("show"))
                    mainDiv.style.display = "block"
                else
                    mainDiv.style.display = "none"


                if (mainDiv.parentNode === this) {
                    // Если кликнули по ссылке
                    if (e.target.nodeName === document.createElement("a").nodeName) {
                        this.getElementsByTagName("span")[0].innerHTML = e.target.innerHTML==="Стереть"?"":e.target.innerHTML;
                    }

                    if (e.target.nodeName === "A") {
                        console.log(!this.id === "r1c1", this.id === "r1c1", this.id, this)
                        var row = this.id.split("c")[0].replace("r", "")
                        row = this.id.replace("r" + parseInt(row) + "c", "r" + (parseInt(row) + 1) + "c")
                        fireClick(document.getElementById(row))
                    }

                    return
                }
                else {
                    this.appendChild(mainDiv)
                }
            })
            curRow.appendChild(curCol)
            switch (j) {
                case 0:
                    curCol.innerHTML = i + 1;
                    break;
                case 1:
                    curCol.innerHTML = numberToLang(i+1, "_", "rus");
                    break;
                default:
            }
        }
    }
    parent.appendChild(curTable)
}

function fireClick(node){
    console.log("fire!")
    if (document.createEvent) {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        node.dispatchEvent(evt);
    } else if (document.createEventObject) {
        node.fireEvent('onclick') ;
    } else if (typeof node.onclick == 'function') {
        node.onclick();
    }
}

export function toYYYYMMDD(d) {
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 101).toString().slice(-2);
    var dd = (d.getDate() + 100).toString().slice(-2);
    return yyyy + mm + dd;
}

export function getSubjFromSubjListByKey(subjArray, subjKey) {
    return subjArray.map((value, key)=>(value.subj_key===subjKey));

}
export function consoleLog(){
    return ISDEBUG&&console.log(...arguments)
}
/* eslint-disable */