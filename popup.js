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