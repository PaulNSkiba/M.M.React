/**
 * Created by Paul on 06.01.2019.
 */
import axios from 'axios';
import { store } from '../store/configureStore'
import {AUTH_URL, API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD} from '../config/config'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

/* eslint-disable */
export const mapStateToProps = store => {
    // console.log(store) // посмотрим, что же у нас в store?
    return {
        user:       store.user,
        userSetup:  store.userSetup,
        chat :      store.chat,
    }
}
export const instanceAxios=()=>{
    let {token} = store.getState().user
    return (axios.create({
        baseURL: AUTH_URL + '/api/',
        timeout: 0,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
        }
    }));
};
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
export function dateDiffHour(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    console.log("dateDiffHour", dt1, dt2, (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(), dt2.getHours()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(), dt1.getHours())))
    return  Math.round(Number(Math.abs(dt1 - dt2) / 36e5), 0) //Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(), dt2.getHours()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(), dt1.getHours()) ) /(1000 * 60 * 24));
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
    const   yyyy = d.getFullYear().toString(),
            mm = (d.getMonth() + 101).toString().slice(-2),
            dd = (d.getDate() + 100).toString().slice(-2)
    return yyyy + mm + dd;
}
export function dateFromYYYYMMDD(str) {
    str = str.replace('-','')
    const   yyyy = str.substr(0, 4),
            mm = str.substr(4, 2),
            dd = str.substr(6, 2)
    // console.log("dateFromYYYYMMDD", yyyy, mm, dd)
    return new Date(Number(yyyy), Number(mm) -1, Number(dd))
}
export function getSubjFromSubjListByKey(subjArray, subjKey) {
    return subjArray.map((value, key)=>(value.subj_key===subjKey));

}
export function consoleLog(){
    return ISDEBUG&&console.log(...arguments)
}

export function getDefLangLibrary() {
    let langObj = {}
    langObj.siteName = "My marks"
    langObj.lang = "Lang"
    langObj.introBegin = "This application will help teachers and parents keep a diary and monitor student performance. To do this, just take "
    langObj.introEnd = " small steps"
    langObj.entry = "Login"
    langObj.exit = "Logout"
    langObj.mainSite = "Main"
    langObj.adminSite = "Admin"
    langObj.adminSiteClass = "Class admin"
    langObj.homework = "Homework"
    langObj.project = "Project"
    langObj.refNewStudentBegin = "Link for"
    langObj.refNewStudentEnd = " adding new students"
    langObj.step1Descr = ". Choose a class:"
    langObj.step2Descr = ". Number of students:"
    langObj.step3Descr = ". Subjects for study:"
    langObj.step4Descr = ". Grade subject:"
    langObj.step5Descr = ". Marker for grades:"
    langObj.step6Descr = ". Additional settings:"
    langObj.step7Descr = ". A register and grade setting:"
    langObj.step8Descr = ". Import/Export grades to Excel:"
    langObj.step9Descr = ". Diagrams"
    langObj.step10Descr = "Save data for the future?"
    langObj.step1DescrMob = ".Class"
    langObj.step2DescrMob = ".Students"
    langObj.step3DescrMob = ".Subjects"
    langObj.step4DescrMob = ".Selected"
    langObj.step5DescrMob = ".Grade marker"
    langObj.step6DescrMob = ".Settings"
    langObj.step7DescrMob = ".Register"
    langObj.step8DescrMob = ".Excel-in/out"
    langObj.step9DescrMob = ".Diagrams"
    langObj.step10DescrMob = "Save?"
    langObj.yes = "Yes"
    langObj.no = "No"
    langObj.speedByMark = "sec/mark"
    langObj.top = "TOP"
    langObj.step = "Step"
    return langObj
}

export const getLangLibrary=async (lang)=>{
    if (!lang) {
        lang = localStorage.getItem("langCode") ? localStorage.getItem("langCode") : defLang
    }
    let langObj = {}
    // console.log('initAliasArray', AUTH_URL + ('/api/langs/get' + (langid?('/' + langid):'')));
    // console.log("getLangLibrary:start")
    await instanceAxios().get(AUTH_URL + ('/api/langs/get' + (lang?('/' + lang):'')))
        .then(response => {

            // this.props.onReduxUpdate('ALIASES_LIST', response.data)
            response.data.forEach(item=>{
                langObj[item.alias] = item.word
            })
            console.log("LANGOBJ", langObj)
            // console.log("getLangLibrary:end")
            return langObj
            //this.setState({ subjects: response.data });
            // console.log(response);
        })
        .catch(response => {
            console.log('initAliasArray:err', response.data);
            // Список ошибок в отклике...
        })

    return langObj

    langObj = {
        siteName : "Мои оценки",
        lang : "Язык",
        introBegin : "Данное приложение поможет учителям и родителям вести дневник и следить за успеваемостью учеников. Для этого нужно сделать всего лишь ",
        introEnd : " маленьких шагов",
        entry : "Вход",
        exit : "Выход",
        mainSite : "Главная",
        adminSite : "Aдминка",
        adminSiteClass : "Админка класса",
        homework : "Домашка",
        project : "Проект",
        refNewStudentBegin : "Cсылка для",
        refNewStudentEnd: " добавления новых студентов",
        step1Descr : ". Выберите класс:",
        step2Descr : ". Количество учеников:",
        step3Descr : ". Изучаемые предметы:",
        step4Descr : ". Предмет для оценок:",
        step5Descr : ". Маркер для оценок:",
        step6Descr : ". Дополнительные настройки:",
        step7Descr : ". Журнал и установка оценок:",
        step8Descr : ". Импорт/экспорт оценок в Эксель:",
        step9Descr : ". Диаграммы:",
        step10Descr : "Сохранить данные на будущее?",
        step1DescrMob : ".Класс",
        step2DescrMob : ".Ученики",
        step3DescrMob : ".Предметы",
        step4DescrMob : ".Выбранный",
        step5DescrMob : ".Маркер оценок",
        step6DescrMob : ".Настройки",
        step7DescrMob : ".Журнал",
        step8DescrMob : ".Excel-обмен",
        step9DescrMob : ".Диаграммы",
        step10DescrMob : "Сохранить?",
        yes : "Да",
        no : "Нет",
        speedByMark : "сек/оценку",
        top : "ТОП",
        step : "Шаг"
    }
    switch (lang) {
        case "UA":
            langObj.siteName = "Мої оцінки"
            langObj.lang = "Мова"
            langObj.introBegin = "Цей додаток допоможе вчителям і батькам вести щоденник і стежити за успішністю учнів. Для цього потрібно зробити всього лише"
            langObj.introEnd = " маленьких кроків"
            langObj.entry = "Вхід"
            langObj.exit = "Вихід"
            langObj.mainSite = "Головна"
            langObj.adminSite = "Aдмінка"
            langObj.adminSiteClass = "Адмінка класу"
            langObj.homework = "Домашка"
            langObj.project = "Проект"
            langObj.refNewStudentBegin = "Посилання для"
            langObj.refNewStudentEnd = " додавання нових студентів"
            langObj.step1Descr = ". Виберіть клас:"
            langObj.step2Descr = ". Кількість учнів:"
            langObj.step3Descr = ". Предмети для навчання:"
            langObj.step4Descr = ". Предмет для оцінок:"
            langObj.step5Descr = ". Маркер для оцінок:"
            langObj.step6Descr = ". Додаткові налаштування:"
            langObj.step7Descr = ". Журнал та установка оцінок:"
            langObj.step8Descr = ". Імпорт/експорт оцінок в Ексель:"
            langObj.step9Descr = ". Діаграми"
            langObj.step10Descr = "Зберегти дані на майбутнє?"
            langObj.step1DescrMob = ".Клас"
            langObj.step2DescrMob = ".Учні"
            langObj.step3DescrMob = ".Предмети"
            langObj.step4DescrMob = ".Обраний"
            langObj.step5DescrMob = ".Маркер оцінок"
            langObj.step6DescrMob = ".Налаштування"
            langObj.step7DescrMob = ".Журнал"
            langObj.step8DescrMob = ".Excel-обмін"
            langObj.step9DescrMob = ".Діаграми"
            langObj.step10DescrMob = "Зберегти?"
            langObj.yes = "Так"
            langObj.no = "Ні"
            langObj.speedByMark = "сек/оцінку"
            langObj.top = "ТОП"
            langObj.step = "Крок"
        break;
        case "RU":

        break;
        case "PL":
            langObj.siteName = "Moje stopnie"
            langObj.lang = "Język"
            langObj.introBegin = "Ta aplikacja pomoże nauczycielom i rodzicom prowadzić dziennik i monitorować wyniki uczniów. Aby to zrobić, po prostu"
            langObj.introEnd = " małe kroki"
            langObj.entry = "Wejdź"
            langObj.exit = "Wyjdź"
            langObj.mainSite = "Główna"
            langObj.adminSite = "Admin",
            langObj.adminSiteClass = "Admin klasy",
            langObj.homework = "Domowe",
            langObj.project = "Project"
            langObj.refNewStudentBegin = "Link do",
            langObj.refNewStudentEnd = " dodawania nowych studentów"
            langObj.step1Descr = ". Wybierz klasę:",
            langObj.step2Descr = ". Liczba studentów:",
            langObj.step3Descr = ". Przedmioty do nauki:",
            langObj.step4Descr = ". Przedmiot do oceny:",
            langObj.step5Descr = ". Marker do oceny:",
            langObj.step6Descr = ". Ustawienia zaawansowane:",
            langObj.step7Descr = ". Dziennik i ustawienie klasy:",
            langObj.step8Descr = ". Importuj/eksportuj oceny w Excelu:",
            langObj.step9Descr = ". Wykresy",
            langObj.step10Descr = "Zaberti Dani?",
            langObj.step1DescrMob = ".Klasa",
            langObj.step2DescrMob = ".Studenci",
            langObj.step3DescrMob = ".Przedmioty",
            langObj.step4DescrMob = ".Wybrano",
            langObj.step5DescrMob = ".Marker do oceny",
            langObj.step6DescrMob = ".Ustawienia",
            langObj.step7DescrMob = ".Dziennik",
            langObj.step8DescrMob = ".Wymiana Excel",
            langObj.step9DescrMob = ".Wykresy"
            langObj.step10DescrMob = "Zaberti?",
            langObj.yes = "Tak",
            langObj.no = "Nie",
            langObj.speedByMark = "sec/klasa "
            langObj.top = "TOP"
            langObj.step = "Krok"
            break;
        case "ES":
            langObj.siteName = "Mis calificaciones"
            langObj.lang = "Idioma"
            langObj.introBegin = "Esta aplicación ayudará a los maestros y padres a llevar un diario y realizar un seguimiento del rendimiento de los estudiantes. Todo lo que tienes que hacer es hacerlo "
            langObj.introEnd = " pequeños pasos"
            langObj.entry = "Login"
            langObj.exit = "Logout"
            langObj.mainSite = "Inicio"
            langObj.adminSite = "Admin"
            langObj.adminSiteClass = "Admin de la clase"
            langObj.homework = "Deberes"
            langObj.project = "Proyecto"
            langObj.refNewStudentBegin = "Enlace para"
            langObj.refNewStudentEnd = " agregar nuevos estudiantes"
            langObj.step1Descr = ". Elige una clase:"
            langObj.step2Descr = ". Numero de estudiantes:"
            langObj.step3Descr = ". Sujetos para estudio:"
            langObj.step4Descr = ". Grados:"
            langObj.step5Descr = ". Marcador:"
            langObj.step6Descr = ". Ajustes adicionales:"
            langObj.step7Descr = ". Diario escolar y ajuste de grado:"
            langObj.step8Descr = ". Importar/Exportar estimación en Excel:"
            langObj.step9Descr = ". Diagramas"
            langObj.step10Descr = "¿Guardar datos para el futuro?"
            langObj.step1DescrMob = ".Clase"
            langObj.step2DescrMob = ".Estudiantes"
            langObj.step3DescrMob = ".Asignaturas"
            langObj.step4DescrMob = ".Seleccionado"
            langObj.step5DescrMob = ".Marcador"
            langObj.step6DescrMob = ".Configuraciones"
            langObj.step7DescrMob = ".Diario escolar"
            langObj.step8DescrMob = ".Excel"
            langObj.step9DescrMob = ".Diagramas"
            langObj.step10DescrMob = "Guardar?"
            langObj.yes = "Si"
            langObj.no = "No"
            langObj.speedByMark = "seg/eval"
            langObj.top = "TOP"
            langObj.step = "Paso"
            break;
        case "DE":
            langObj.siteName = "Meine Schulnoten"
            langObj.lang = "Sprache"
            langObj.introBegin = "Цей додаток допоможе вчителям і батькам вести щоденник і стежити за успішністю учнів. Для цього потрібно зробити всього лише"
            langObj.introEnd = " маленьких кроків"
            langObj.entry = "Вхід"
            langObj.exit = "Вихід"
            langObj.mainSite = "Головна"
            langObj.adminSite = "Aдмінка"
            langObj.adminSiteClass = "Адмінка класу"
            langObj.homework = "Домашка"
            langObj.project = "Проект"
            langObj.refNewStudentBegin = "Посилання для"
            langObj.refNewStudentEnd = " додавання нових студентів"
            langObj.step1Descr = ". Виберіть клас:"
            langObj.step2Descr = ". Кількість учнів:"
            langObj.step3Descr = ". Предмети для навчання:"
            langObj.step4Descr = ". Предмет для оцінок:"
            langObj.step5Descr = ". Маркер для оцінок:"
            langObj.step6Descr = ". Додаткові налаштування:"
            langObj.step7Descr = ". Журнал та установка оцінок:"
            langObj.step8Descr = ". Імпорт/експорт оцінок в Ексель:"
            langObj.step9Descr = ". Діаграми"
            langObj.step10Descr = "Зберегти дані на майбутнє?"
            langObj.step1DescrMob = ".Клас"
            langObj.step2DescrMob = ".Учні"
            langObj.step3DescrMob = ".Предмети"
            langObj.step4DescrMob = ".Обраний"
            langObj.step5DescrMob = ".Маркер оцінок"
            langObj.step6DescrMob = ".Налаштування"
            langObj.step7DescrMob = ".Журнал"
            langObj.step8DescrMob = ".Excel-обмін"
            langObj.step9DescrMob = ".Діаграми"
            langObj.step10DescrMob = "Зберегти?"
            langObj.yes = "Так"
            langObj.no = "Ні"
            langObj.speedByMark = "сек/оцінку"
            langObj.top = "ТОП"
            langObj.step = "Крок"
            break;
        case "FR":
            langObj.siteName = "Mes notes"
            langObj.lang = "Langue"
            langObj.introBegin = "Цей додаток допоможе вчителям і батькам вести щоденник і стежити за успішністю учнів. Для цього потрібно зробити всього лише"
            langObj.introEnd = " маленьких кроків"
            langObj.entry = "Вхід"
            langObj.exit = "Вихід"
            langObj.mainSite = "Головна"
            langObj.adminSite = "Aдмінка"
            langObj.adminSiteClass = "Адмінка класу"
            langObj.homework = "Домашка"
            langObj.project = "Проект"
            langObj.refNewStudentBegin = "Посилання для"
            langObj.refNewStudentEnd = " додавання нових студентів"
            langObj.step1Descr = ". Виберіть клас:"
            langObj.step2Descr = ". Кількість учнів:"
            langObj.step3Descr = ". Предмети для навчання:"
            langObj.step4Descr = ". Предмет для оцінок:"
            langObj.step5Descr = ". Маркер для оцінок:"
            langObj.step6Descr = ". Додаткові налаштування:"
            langObj.step7Descr = ". Журнал та установка оцінок:"
            langObj.step8Descr = ". Імпорт/експорт оцінок в Ексель:"
            langObj.step9Descr = ". Діаграми"
            langObj.step10Descr = "Зберегти дані на майбутнє?"
            langObj.step1DescrMob = ".Клас"
            langObj.step2DescrMob = ".Учні"
            langObj.step3DescrMob = ".Предмети"
            langObj.step4DescrMob = ".Обраний"
            langObj.step5DescrMob = ".Маркер оцінок"
            langObj.step6DescrMob = ".Налаштування"
            langObj.step7DescrMob = ".Журнал"
            langObj.step8DescrMob = ".Excel-обмін"
            langObj.step9DescrMob = ".Діаграми"
            langObj.step10DescrMob = "Зберегти?"
            langObj.yes = "Так"
            langObj.no = "Ні"
            langObj.speedByMark = "сек/оцінку"
            langObj.top = "ТОП"
            langObj.step = "Крок"
            break;
        case "IT":
            langObj.siteName = "I miei voti"
            langObj.lang = "Lingua"
            langObj.introBegin = "Цей додаток допоможе вчителям і батькам вести щоденник і стежити за успішністю учнів. Для цього потрібно зробити всього лише"
            langObj.introEnd = " маленьких кроків"
            langObj.entry = "Вхід"
            langObj.exit = "Вихід"
            langObj.mainSite = "Головна"
            langObj.adminSite = "Aдмінка"
            langObj.adminSiteClass = "Адмінка класу"
            langObj.homework = "Домашка"
            langObj.project = "Проект"
            langObj.refNewStudentBegin = "Посилання для"
            langObj.refNewStudentEnd = " додавання нових студентів"
            langObj.step1Descr = ". Виберіть клас:"
            langObj.step2Descr = ". Кількість учнів:"
            langObj.step3Descr = ". Предмети для навчання:"
            langObj.step4Descr = ". Предмет для оцінок:"
            langObj.step5Descr = ". Маркер для оцінок:"
            langObj.step6Descr = ". Додаткові налаштування:"
            langObj.step7Descr = ". Журнал та установка оцінок:"
            langObj.step8Descr = ". Імпорт/експорт оцінок в Ексель:"
            langObj.step9Descr = ". Діаграми"
            langObj.step10Descr = "Зберегти дані на майбутнє?"
            langObj.step1DescrMob = ".Клас"
            langObj.step2DescrMob = ".Учні"
            langObj.step3DescrMob = ".Предмети"
            langObj.step4DescrMob = ".Обраний"
            langObj.step5DescrMob = ".Маркер оцінок"
            langObj.step6DescrMob = ".Налаштування"
            langObj.step7DescrMob = ".Журнал"
            langObj.step8DescrMob = ".Excel-обмін"
            langObj.step9DescrMob = ".Діаграми"
            langObj.step10DescrMob = "Зберегти?"
            langObj.yes = "Так"
            langObj.no = "Ні"
            langObj.speedByMark = "сек/оцінку"
            langObj.top = "ТОП"
            langObj.step = "Крок"
            break;
        case "EN":
            langObj.siteName = "Мy marks"
            langObj.lang = "Lang"
            langObj.introBegin = "This application will help teachers and parents keep a diary and monitor student performance. To do this, just "
            langObj.introEnd = " small steps"
            langObj.entry = "Login"
            langObj.exit = "Logout"
            langObj.mainSite = "Main"
            langObj.adminSite = "Admin"
            langObj.adminSiteClass = "Class admin"
            langObj.homework = "Homework"
            langObj.project = "Project"
            langObj.refNewStudentBegin = "Link for"
            langObj.refNewStudentEnd = " adding new students"
            langObj.step1Descr = ". Choose a class:"
            langObj.step2Descr = ". Number of students:"
            langObj.step3Descr = ". Subjects for study:"
            langObj.step4Descr = ". Grade subject:"
            langObj.step5Descr = ". Marker for grades:"
            langObj.step6Descr = ". Additional settings:"
            langObj.step7Descr = ". A register and grade setting:"
            langObj.step8Descr = ". Import/Export grades to Excel:"
            langObj.step9Descr = ". Diagrams"
            langObj.step10Descr = "Save data for the future??"
            langObj.step1DescrMob = ".Class"
            langObj.step2DescrMob = ".Students"
            langObj.step3DescrMob = ".Subjects"
            langObj.step4DescrMob = ".Selected"
            langObj.step5DescrMob = ".Grade marker"
            langObj.step6DescrMob = ".Settings"
            langObj.step7DescrMob = ".Register"
            langObj.step8DescrMob = ".Excel-in/out"
            langObj.step9DescrMob = ".Diagrams"
            langObj.step10DescrMob = "Save?"
            langObj.yes = "Yes"
            langObj.no = "No"
            langObj.speedByMark = "sec/mark"
            langObj.top = "TOP"
            langObj.step = "Step"
            break;
        default:
            langObj.siteName = "My marks"
            langObj.lang = "Lang"
            langObj.introBegin = "This application will help teachers and parents keep a diary and monitor student performance. To do this, just take "
            langObj.introEnd = " small steps"
            langObj.entry = "Login"
            langObj.exit = "Logout"
            langObj.mainSite = "Main"
            langObj.adminSite = "Admin"
            langObj.adminSiteClass = "Class admin"
            langObj.homework = "Homework"
            langObj.project = "Project"
            langObj.refNewStudentBegin = "Link for"
            langObj.refNewStudentEnd = " adding new students"
            langObj.step1Descr = ". Choose a class:"
            langObj.step2Descr = ". Number of students:"
            langObj.step3Descr = ". Subjects for study:"
            langObj.step4Descr = ". Grade subject:"
            langObj.step5Descr = ". Marker for grades:"
            langObj.step6Descr = ". Additional settings:"
            langObj.step7Descr = ". A register and grade setting:"
            langObj.step8Descr = ". Import/Export grades to Excel:"
            langObj.step9Descr = ". Diagrams"
            langObj.step10Descr = "Save data for the future?"
            langObj.step1DescrMob = ".Class"
            langObj.step2DescrMob = ".Students"
            langObj.step3DescrMob = ".Subjects"
            langObj.step4DescrMob = ".Selected"
            langObj.step5DescrMob = ".Grade marker"
            langObj.step6DescrMob = ".Settings"
            langObj.step7DescrMob = ".Register"
            langObj.step8DescrMob = ".Excel-in/out"
            langObj.step9DescrMob = ".Diagrams"
            langObj.step10DescrMob = "Save?"
            langObj.yes = "Yes"
            langObj.no = "No"
            langObj.speedByMark = "sec/mark"
            langObj.top = "TOP"
            langObj.step = "Step"
            break
    }
    return langObj

}

export const saveToLocalStorageOnDate=(localName, data)=>{
    window.localStorage.setItem(localName, data);
}
export const getLangByCountry=(myCountryCode)=> {
    let lang = "Lang"
    switch (myCountryCode) {
        case "UA": lang = "Мова";  break;
        case "RU": lang = "Язык";  break;
        case "PL": lang = "Język";  break;
        case "ES": lang = "Idioma";  break;
        case "DE": lang = "Sprache";  break;
        case "FR": lang = "Langue";  break;
        case "IT": lang = "Lingua";  break;
        case "EN": lang = "Lang";  break;
        default:
            lang = "Lang"
            break
    }
    return lang
}
export const prepareMessageToFormat=(msg, returnObject)=>{
    let obj = {}
    obj.senderId = msg.user_name
    obj.text = msg.message
    obj.time = msg.msg_time
    obj.userID = msg.user_id
    obj.userName = msg.user_name
    obj.uniqid = msg.uniqid
    if (!(msg.homework_date === null)) {
        obj.hwdate = msg.homework_date
        obj.subjkey = msg.homework_subj_key
        obj.subjname = msg.homework_subj_name
        obj.subjid = msg.homework_subj_id
    }
    obj.id = msg.id
    //"{"senderId":"my-marks","text":"выучить параграф 12","time":"14:59","userID":209,"userName":"Menen",
    // "hwdate":"2019-07-16T21:00:00.000Z","subjkey":"#lngukr","subjname":"Українська мова"}"
    // console.log('obj', JSON.stringify(obj))
    return returnObject?obj:JSON.stringify(obj)
}

export const echoClient = (token, chatSSL) => {
    return new Echo(
        {
            broadcaster: 'pusher',
            key: LOCALPUSHERPWD,
            cluster: 'mt1',
            wsHost: BASE_HOST,
            wsPort: WEBSOCKETPORT,
            wssPort: WEBSOCKETPORT,
            disableStats: true,
            enabledTransports: chatSSL ? ['ws', 'wss'] : ['ws'],
            encrypted: chatSSL,
            authEndpoint: AUTH_URL + '/broadcasting/auth',
            namespace: "App.Events",
            auth: {
                headers: {
                    'V-Auth': true,
                    Authorization: `Bearer ${token}`,
                }
            }
        }
    )
}
export const pusherClient = (token, chatSSL) => {
    const pusher = new Pusher(LOCALPUSHERPWD,
        {
            broadcaster: 'pusher',
            key: LOCALPUSHERPWD,
            cluster: 'mt1',
            wsHost: BASE_HOST,
            wsPort: WEBSOCKETPORT,
            wssPort: WEBSOCKETPORT,
            authEndpoint: AUTH_URL + '/broadcasting/auth',
            csrfToken: null,
            host: null,
            // authorizer: function (channel, options) {
            //     return {
            //         authorize: function (socketId, callback) {
            //             // Do some ajax to get the auth information
            //             callback(false, authInformation);
            //         }
            //     };
            // },
            disableStats: true,
            enabledTransports: chatSSL ? ['ws', 'wss'] : ['ws'],
            disabledTransports: ['sockjs'],
            encrypted: chatSSL,
            auth: {
                headers: {
                    'V-Auth': true,
                    Authorization: `Bearer ${token}`,
                }
            }
        }
    )
    pusher.logToConsole = true
    return pusher
}

export const waitCursorBlock=()=>
    <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
/* eslint-disable */