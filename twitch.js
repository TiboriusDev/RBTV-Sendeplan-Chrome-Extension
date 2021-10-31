const clientId = 'wc8bif8v6qw22tbw5zjoi8x6q0yjkv';
const secretId = 'l4e7ibuabugg0mluddqg3tycth82vy';
var access_Token;
var ids = [ "edelive" , "florentinwill" , "krogmann" , "m_a_r_a_h" , "nilsbomhofflive" , "mon_official" , "pixelviet" ]
var url = 'https://api.twitch.tv/helix/streams?user_login=mon_official&user_login=pixelviet&user_login=edelive&user_login=florentinwill&user_login=krogmann&user_login=nilsbomhofflive&user_login=m_a_r_a_h';

// Get Livestreamdaten
async function LivestreamDaten(){
    var p1 = new Promise((resolve, reject) => { 
        GetToken(resolve, reject)  
    }).then(() => {
        ReadStreamData();
    });
}

    // Get Twitch Token
async function GetToken(resolve, reject){
    fetch('https://id.twitch.tv/oauth2/token?client_id='+ clientId +'&client_secret='+ secretId +'&grant_type=client_credentials', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        access_token = data.access_token;
        resolve();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

    // Read Streamdaten
async function ReadStreamData(){
    var output = '';
    fetch(url,{ 
        method: 'GET',
        headers: {
        'Client-ID': clientId,
        'Authorization': 'Bearer ' + access_token,
        } })
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.data.forEach(element => {
        output += '<a href="https://www.twitch.tv/'+ element.user_login +'" target="_blank" title="'+ element.user_name +' streamt '+ element.game_name + ' - ' +element.title+'" style="background-image: url(/images/streams/'+element.user_login+'.png);"></a>';
        });

        document.getElementById('streams').innerHTML = output;
    })
    .catch((error) => {
        if(error === 401)
        console.error('Error:', error);
    });
}

LivestreamDaten();