let scrollPos = ""
let detalIndex = 0
let detailArr =[]
let detailName=""

function updatalist(listname,ele){
    ele.innerHTML=""
    detailName=listname
    detailArr =[]
    var obj = new XMLHttpRequest();
    obj.open("POST", "http://13.58.99.6:8080/updatalist", true);
    // obj.open("POST", "http://localhost:8080/updatalist", true);
    obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const _ele=ele
    obj.onreadystatechange = function () {
        if (obj.readyState == 4 && (obj.status == 200)) {
            if(obj.responseText!="error"){
                detailArr = JSON.parse(obj.responseText)
                if(_ele){
                    renderList(_ele,detailArr,detailName)
                }
            }
           else{
               alert("server error")
           }
        }
    }
    let sendData={listname:listname}
    obj.send(JSON.stringify(sendData));
}
function resize(){
    let botton = document.getElementById("navButton")
    let navMenu = document.getElementById("navMenu")

    let width ="95%"
    navMenu.style.width=width
    if(botton.classList.value.indexOf('open') >0){
        navMenu.style.left = "0"
        document.body.style.height="100%"
        document.body.style.overflow="hidden"
    }else{
        navMenu.style.left = "-"+width
        document.body.style.height=""
        document.body.style.overflow=""
    }
}
function toggle(menu) {
    menu.classList.toggle("open");
    menu.classList.toggle("close");
    resize()
}
function loadDetail(i){
    scrollPos = document.body.scrollTop
    document.body.scrollTop=0

    let detail = document.getElementsByClassName("detail")[0]
    let detailC = document.getElementsByClassName("detail-close")[0]

    let wrap = document.getElementsByClassName("wrap")[0]
    wrap.innerHTML=""
    wrap.onclick=function(e){ 
        e.stopPropagation();
    }
   
    detalIndex = Number(i)
    let title = document.createElement("h1")
    title.innerHTML=detailArr[detalIndex].title
    wrap.appendChild(title)
    let date = document.createElement("h2")
    date.innerHTML=detailArr[detalIndex].date
    wrap.appendChild(date)
    let description = document.createElement("p")
    description.innerHTML=detailArr[detalIndex].description
    wrap.appendChild(description)
    let image= document.createElement("img")
    image.src= detailArr[detalIndex].detailSrc
    wrap.appendChild(image)
    var obj = new XMLHttpRequest();
    obj.open("POST", "http://13.58.99.6:8080/getLike", true);
    // obj.open("POST", "http://localhost:8080/getLike", true);
    obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const _wrap=wrap
    obj.onreadystatechange = function () {
        if (obj.readyState == 4 && (obj.status == 200)) {
            if(obj.responseText!="error"){
                let like = document.createElement("div")
                like.id="like"
                like.classList.value="beforeLike"
                let text = document.createElement("div")
                text.innerHTML="GIMME A LIKE"
                let num = document.createElement("span")
                num.innerHTML=obj.responseText
                like.appendChild(num)
                like.appendChild(text)
                const _i = i
                like.onclick=function(){
                    gimmeLike(_i);
                } 

                _wrap.appendChild(like)
                if(detailC.offsetHeight<document.body.offsetHeight){
                    detailC.style.height = document.body.offsetHeight+100
                }else{
                    detailC.style.height=detailC.offsetHeight-300
                }
            }
           else{
               alert("server error")
           }
        }
    }
    let sendData={listname:detailName,id:i}
    obj.send(JSON.stringify(sendData));

    

    detail.style.display="block"

    detail.scroll(function(event){
        event.stopPropagation();
    })
}
function gimmeLike(i){
    var obj = new XMLHttpRequest();
    obj.open("POST", "http://13.58.99.6:8080/postdata", true);
    // obj.open("POST", "http://localhost:8080/postdata", true);
    obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    obj.onreadystatechange = function () {
        if (obj.readyState == 4 && (obj.status == 200)) {
            if(obj.responseText=="success"){
                let like=document.getElementById("like")
                let num= like.children[0]
                num.innerHTML=Number(num.innerHTML)+1
                let text = like.children[1]
                text.innerHTML="SO DELICIOUS! :P"
                like.classList.value="afterLike"
                like.onclick=function(){}

            }else{
                alert("server error")
            }
        }
    }
    let sendData={listname:detailName, id:Number(i)}
    obj.send(JSON.stringify(sendData));
}

function renderList(list, arr,name){
    detailName = name
    detailArr = arr
    list.innerHTML=""
    for(let i=0; i<arr.length; i++){
        //添加一个子标签
        let id= list.id+i.toString()
        let ele = document.createElement("div");
        ele.id = id
        ele.className+=" "+"work"
        const _i = i
        ele.onclick=function(){
            loadDetail(_i);
        } 
        let image= document.createElement("img")
        // image.src= "../"+arr[i].imgSrc
        image.style.background= "url("+"../"+arr[i].imgSrc+")";
        ele.appendChild(image);
        let title = document.createElement("h1")
        title.innerHTML=arr[i].title
        ele.appendChild(title);
        let date = document.createElement("p")
        date.innerHTML= arr[i].date
        ele.appendChild(date);

        list.appendChild(ele);
    }

    //Shhh... trying to design more here
    let ele = document.createElement("div");
    ele.className+=" "+"shhmore"
    ele.innerHTML="Shhh... trying to design more here"
    list.appendChild(ele);
}


function closeDetail(){
    let detail = document.getElementsByClassName("detail")[0]
    detail.style.display = "none"
    document.body.scrollTop=scrollPos
}

function pageLeft(){
    document.body.scrollTop=scrollPos
    detalIndex = detalIndex-1
    if(detalIndex <0){
        detalIndex=detailArr.length-1
    }
    loadDetail(detalIndex)
}

function pageRight(){
    document.body.scrollTop=scrollPos
    detalIndex = detalIndex+1
    if(detalIndex>detailArr.length-1){
        detalIndex=0
    }
    loadDetail(detalIndex)
}

function selectedNav(ele){
    for(let i=1; i<6; i++){
        let id ="navlist"+i.toString()
        let item = document.getElementById(id)
        item.classList=""
    }
    ele.classList+="selected"
}

window.onresize=function(){
    resize();
}