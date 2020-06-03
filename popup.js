let content = document.getElementById("content");
let error = document.getElementById("console");
let date = new Date();
let yesterday = new Date((date.setDate(date.getDate()-1)));
let dayNow = date.getFullYear() +'-'+ ("0" + (yesterday.getMonth()+1)).slice(-2) +'-'+ ("0" + yesterday.getDate()).slice(-2);

async function loadData(){
    let sendeplanJson = await fetch('https://api.rocketbeans.tv/v1/schedule/normalized/?startDay=' + Math.round(new Date().getTime()/1000));
    let data = await sendeplanJson.json();

    data.data.forEach(days => {
        let sendeDate = (days.date).split('T');

        if(sendeDate[0] == dayNow){
            days.elements.forEach(sendung => {
                let sendeTime = new Date(sendung.timeStart);
                let onAir, live, showImage;

                let type = (sendung.type != "rerun") ? '<div class="dot '+ sendung.type +'"></div>' : '';

                if ((new Date()).getTime() > new Date(sendung.timeStart).getTime() && (new Date()).getTime() < new Date(sendung.timeEnd).getTime()){
                    onAir = '<div class="onair"></div>';
                    live = 'live'
                }else{
                    onAir = '';
                    live = '';
                }

                let time = sendung.duration / 60;
                let minutes = time % 60;
                let hours = Math.floor(time / 60);

                let timeOutput = ((hours > 0) ? hours +' Std ' + ((minutes > 0) ? minutes +' Min' : '') : minutes +' Min')

                showImage = (sendung.episodeImage != null) ? '<div class="show-image" style="background-image: url('+ sendung.episodeImage +');"></div>' : '<div class="show-image" style="background-image: url(images/placeholder.png);"></div>'

                content.innerHTML +='<div class="box" id="'+ live +'">'+ type +'<div class="time">'+ (sendeTime.getHours() +':'+ ("0" + sendeTime.getMinutes()).slice(-2)).toString() +' Uhr</div>'+
                            '<span class="title">'+ sendung.title +'</span><br>'+ sendung.topic +
                            '<div class="dauer">'+ timeOutput +'</div>'+ onAir + showImage +'<div></div>';
            });

            const element = document.getElementById('live');
            if(element != null){
                element.scrollIntoView({block: 'start', behavior: 'smooth'});
            }
            
            return;
        }
        
    });
}

loadData();

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var refBox = document.getElementById("ref-link");
    var rex = [
        /amazon/, 
        /gog/, 
        /fantasywelt/, 
        /alternate/, 
        /otto/, 
        /razer/, 
        /ebay/
    ];
    var refs = [
        "http://www.amazon.de/?_encoding=UTF8&camp=1638&creative=19454&linkCode=ur2&site-redirect=de&tag=rocketbeansde-21&linkId=TS4VQU7BZNNUKCKO", 
        "https://www.gog.com/?pp=4802de61a70652cd389e566d0794ec61d34ee385", 
        "https://www.fantasywelt.de/?rbnz=3pP6vcuEoBOaXdwfOk6O", 
        "http://www.awin1.com/awclick.php?gid=334604&mid=11731&awinaffid=398911&linkid=2139723&clickref", 
        "http://partners.webmasterplan.com/click.asp?ref=844419&site=2950&type=text&tnb=85&diurl=https%3A%2F%2Fwww.otto.de%2Fextern%2F%3FAffiliateID%3DLA992%26campid%3DLA78701%26IWL%3D054%26page%3Dtechnik%25252Fmultimedia%25252F", 
        "http://www.awin1.com/awclick.php?gid=345326&mid=11733&awinaffid=398911&linkid=2234572&clickref=",
        "https://rbtv.to/EbayAffiliate"
    ];
    var url = tabs[0].url;
    for(var i = 0; i < rex.length; i++){
        var found = url.match(rex[i]);
        if(found != null){
            refBox.style.display = "block";
            var site = (rex[i].toString()).replace(/\//g, "")
            refBox.innerHTML = '<div onclick="openReflink(\''+tabs[0].id+'\', \''+ refs[i] +'\'); isClicked();"><span>Klicke um RBTV auf '+ site.charAt(0).toUpperCase() + site.slice(1) + ' zu Unterst&uuml;tze</span><img src="images/svg/'+site+'.svg"></div><div class="thx" id="thx"><img src="images/svg/heart.svg"></div>';
            return;
        }
    }
});

function openReflink(id, url){
    chrome.tabs.update(parseInt(id), {url: url});
}

function isClicked(){
    document.getElementById("thx").classList.add("isClicked");

    setTimeout(function(){
        document.getElementById("thx").classList.remove("isClicked");
    }, 1500);
}