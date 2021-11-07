var background = chrome.extension.getBackgroundPage();
number = background.number_of_query;
console.log(number);

const days_Name = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const streamLink = {Etienne: "edelive", Simon: "mon_official", Nils: "nilsbomhofflive", Marah: "m_a_r_a_h", Viet: "pixelviet", Florentin: "florentinwill", Krogmann: "krogmann"};

const content_live = document.getElementById("content-live");
const content_vod = document.getElementById("content-vod");

let date = new Date();
let yesterday = new Date((date.setDate(date.getDate() - 1)));
let dayNow = date.getFullYear() + '-' + ("0" + (yesterday.getMonth() + 1)).slice(-2) + '-' + ("0" + yesterday.getDate()).slice(-2);
let tomorrow = new Date((date.setDate(date.getDate() + 1)));
let dayTomorrow = date.getFullYear() + '-' + ("0" + (tomorrow.getMonth() + 1)).slice(-2) + '-' + ("0" + tomorrow.getDate()).slice(-2);

var curr_show_day, time, minutes, hours, timeOutput;

async function loadLive() {
    let sendeplanJson = await fetch('https://api.rocketbeans.tv/v1/schedule/normalized/?startDay=' + Math.round(yesterday.getTime() / 1000));
    let data = await sendeplanJson.json();

    data.data.forEach(days => {
        console.log(days);
        let sendeDate = (days.date).split('T');

        if (sendeDate[0] == dayNow || sendeDate[0] == dayTomorrow) {

            curr_show_day = new Date(days.date);
            content_live.innerHTML += '<span class="flex-col new-day">'+ days_Name[curr_show_day.getDay()] + ', ' + curr_show_day.getDate() + '.' + (curr_show_day.getMonth()+1)  + '</span>';

            if( days.elements.length == 0) {
                content_live.innerHTML += '<span class="no-content">Kein geplanter Livecontent</span>';
                return;
            }
            days.elements.forEach(sendung => {
                let sendeTime = new Date(sendung.timeStart);
                let onAir, live, showImage, type = '', vod = '';

                if( sendung.type != "rerun" ){
                    
                    if( sendung.channelGroups[0].type == "talent" ){
                        type = '<div class="dot twitch"></div>';
                    }else {
                        type = '<div class="dot ' + sendung.type + '"></div>';
                    }

                }else {
                    type = '';
                }               

                if ((new Date()).getTime() > new Date(sendung.timeStart).getTime() && (new Date()).getTime() < new Date(sendung.timeEnd).getTime()) {
                    
                    if(sendung.channelGroups[0].type != "talent"){
                        onAir = '<div class="onair"></div>';
                        live = 'live'
                    } else {
                        onAir = '<div class="onair twitch"></div>';
                        vod = '<a href="https://twitch.tv/' + streamLink[sendung.channelGroups[0].name] + '" target="_blank" title="Zum Stream auf Twitch"><div class="external-link twitch"><img src="images/svg/twitch.svg"></div></a></div>';
                        live = '';
                    }
                    
                } else {
                    onAir = '';
                    live = '';
                }

                time = sendung.duration / 60;
                minutes = time % 60;
                hours = Math.floor(time / 60);
                timeOutput = ((hours > 0) ? hours + ' Std ' + ( (minutes > 0) ? minutes + ' Min' : '' ) : minutes + ' Min')

                showImage = (sendung.episodeImage != null) ? '<div class="show-image" style="background-image: url(' + sendung.episodeImage + ');"></div>' : '<div class="show-image" style="background-image: url(images/placeholder.png);"></div>'
                content_live.innerHTML += '<div class="box" id="' + live + '">' + type + '<div class="time">' + (sendeTime.getHours() + ':' + ("0" + sendeTime.getMinutes()).slice(-2)).toString() + ' Uhr</div>' +
                    '<span class="title">' + sendung.title + '</span><br>' + sendung.topic +
                    '<div class="dauer">' + timeOutput + '</div>' + onAir + showImage + '<div>' +
                    vod;
            });

            const element = document.getElementById('live');
            if (element != null) {
                element.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }

            return;
        }

    });
}

async function loadVod() {

    if( number != 0 ){
        let mediaJson = await fetch('https://api.rocketbeans.tv/v1/media/episode/preview/newest?limit=' + number);
        let dataMedia = await mediaJson.json();
        let mediaLink = '';

        content_vod.innerHTML += '<span class="flex-col new-day">Neues aus der Mediathek</span>';

        dataMedia.data.episodes.forEach(media => {

            time = media.duration / 60;
            minutes = parseInt(time % 60);
            hours = Math.floor(time / 60);
            timeOutput = ((hours > 0) ? hours + ' Std ' + ( (minutes > 0) ? minutes + ' Min' : '' ) : minutes + ' Min')

            mediaLink = vod = '<a href="https://rocketbeans.tv/mediathek/video/' + media.id + '" target="_blank" title="Zur RBTV Mediathek"><div class="external-link rbtv"><img src="images/svg/external-link.svg"></div></a></div>';
            let mediaShowImage = (media.thumbnail[0].url != null) ? '<div class="show-image" style="background-image: url(' + media.thumbnail[0].url + ');"></div>' : '<div class="show-image" style="background-image: url(images/placeholder.png);"></div>'
            content_vod.innerHTML += '<div class="box">' +
                '<span class="title">' + media.showName + '</span><br>' + '<div class="dauer">' + timeOutput + '</div>' + media.title + mediaShowImage + '<div>' + vod;
        });
    }

    let uploadplanJson = await fetch('https://api.rocketbeans.tv/v1/schedule/publish?from=' + Math.round(yesterday.getTime() / 1000));
    let dataVod = await uploadplanJson.json();

    dataVod.data.forEach(vods => {
        //console.log(vods);
        let vod_sendeDate = (vods.date).split('T');

        if (vod_sendeDate[0] == dayNow || vod_sendeDate[0] == dayTomorrow) {

            curr_show_day = new Date(vods.date);
            content_vod.innerHTML += '<span class="flex-col new-day">'+ days_Name[curr_show_day.getDay()] + ', ' + curr_show_day.getDate() + '.' + (curr_show_day.getMonth()+1)  + '</span>';
            
            if( vods.elements.length == 0) {
                return;
            }
            vods.elements.forEach(show => {
                let vod_sendeTime = new Date(show.uploadDate);

                let vodShowImage = (show.showThumbnail[0].url != null) ? '<div class="show-image" style="background-image: url(' + show.showThumbnail[0].url + ');"></div>' : '<div class="show-image" style="background-image: url(images/placeholder.png);"></div>'
                content_vod.innerHTML += '<div class="box"><div class="time">' + (vod_sendeTime.getHours() + ':' + ("0" + vod_sendeTime.getMinutes()).slice(-2)).toString() + ' Uhr</div>' +
                    '<span class="title">' + show.showTitle + '</span><br>' + show.title + vodShowImage + '<div>';
            });
            return;
        }

    });
}

chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    var refBox = document.getElementById("ref-link");
    var rex = [
        /amazon/,
        /gog/,
        /fantasywelt/,
        /alternate/,
        /otto/,
        /razer/,
        /ebay/,
        /4netplayers/
    ];
    var refs = [
        "http://www.amazon.de/?_encoding=UTF8&camp=1638&creative=19454&linkCode=ur2&site-redirect=de&tag=rocketbeansde-21&linkId=TS4VQU7BZNNUKCKO",
        "https://www.gog.com/?pp=4802de61a70652cd389e566d0794ec61d34ee385",
        "https://www.fantasywelt.de/?rbnz=3pP6vcuEoBOaXdwfOk6O",
        "http://www.awin1.com/awclick.php?gid=334604&mid=11731&awinaffid=398911&linkid=2139723&clickref",
        "http://partners.webmasterplan.com/click.asp?ref=844419&site=2950&type=text&tnb=85&diurl=https%3A%2F%2Fwww.otto.de%2Fextern%2F%3FAffiliateID%3DLA992%26campid%3DLA78701%26IWL%3D054%26page%3Dtechnik%25252Fmultimedia%25252F",
        "http://www.awin1.com/awclick.php?gid=345326&mid=11733&awinaffid=398911&linkid=2234572&clickref=",
        "https://rbtv.to/EbayAffiliate",
        "https://www.4netplayers.com/?utm_source=rbtv&utm_medium=affiliate&pif4pp=a10d2ccef3f26070a15ee4dced9a4686&pif4ppex=rbtv&currency=EUR"
    ];
    var url = tabs[0].url;
    for (var i = 0; i < rex.length; i++) {
        var found = url.match(rex[i]);
        if (found != null) {
            refBox.style.display = "block";
            var site = (rex[i].toString()).replace(/\//g, "")
            refBox.innerHTML = '<div><a href="' + refs[i] + '" target="_blank"><span>Klicke um RBTV auf ' + site.charAt(0).toUpperCase() + site.slice(1) + ' zu Unterst&uuml;tze</span><img src="images/svg/' + site + '.svg"></a></div>';
            return;
        }
    }    
});



document.addEventListener('DOMContentLoaded', function() {
    var btn_live = document.getElementById('tab_live');
    var btn_vod = document.getElementById('tab_vod');
    // onClick's logic below:
    btn_live.addEventListener('click', function() {
        btn_live.classList.add('active');
        btn_vod.classList.remove('active');

        content_live.classList.remove('hidden');
        content_vod.classList.add('hidden');
    });

    btn_vod.addEventListener('click', function() {
        btn_live.classList.remove('active');
        btn_vod.classList.add('active');
        
        content_live.classList.add('hidden');
        content_vod.classList.remove('hidden');
    });
});

document.querySelector('#openOption').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
});

loadLive();
loadVod();