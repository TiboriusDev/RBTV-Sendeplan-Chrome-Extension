let content = document.getElementById("content");
let error = document.getElementById("console");
let date = new Date();
let yesterday = new Date((date.setDate(date.getDate()-1)));
let dayNow = date.getFullYear() +'-'+ ("0" + (yesterday.getMonth()+1)).slice(-2) +'-'+ ("0" + yesterday.getDate()).slice(-2);

function loadData(){
    fetch('https://api.rocketbeans.tv/v1/schedule/normalized/?startDay=' + Math.round(new Date().getTime()/1000))
        .then(response => response.json())
        .then(data => {

            data.data.forEach(days => {
                var sendeDate = (days.date).split('T');

                if(sendeDate[0] == dayNow){
                    days.elements.forEach(sendung => {
                        var sendeTime = new Date(sendung.timeStart);
                        var onAir, live;

                       

                        var type = (sendung.type != "rerun") ? '<div class="dot '+ sendung.type +'"></div>' : '';
                        if (date.getTime() > new Date(sendung.timeStart).getTime() && date.getTime() < new Date(sendung.timeEnd).getTime()){
                            onAir = '<div class="onair"></div>';
                            live = 'id="live"'
                        }else{
                            onAir = '';
                            live = '';
                        }

                        var time = sendung.duration / 60;
                        var minutes = time % 60;
                        var hours = Math.floor(time / 60);

                        var timeOutput = ((hours > 0) ? hours +' Std ' + ((minutes > 0) ? minutes +' Min' : '') : minutes +' Min')

                        

                        content.innerHTML +='<div class="box" id="box">'+ type +'<div class="time" '+ live +'>'+ (sendeTime.getHours() +':'+ ("0" + sendeTime.getMinutes()).slice(-2)).toString() +' Uhr</div>'+
                                    '<span class="title">'+ sendung.title +'</span><br>'+ sendung.topic +
                                    '<div class="dauer">'+ timeOutput +'</div>'+ onAir +'<div></div>';
                    });

                    const element = document.getElementById('live');
                    const y = element.getBoundingClientRect().top + window.pageYOffset + -52;

                    window.scrollTo({top: y, behavior: 'smooth'});
                    return;
                }
                
            });
        });
}

loadData();