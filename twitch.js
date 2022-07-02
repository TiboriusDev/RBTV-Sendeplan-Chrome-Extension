const clientId = 'wc8bif8v6qw22tbw5zjoi8x6q0yjkv';
const secretId = 'whymt6x5tfiknyn1xs3eo1w9jkokzp';
var access_token;
var ids = ["rocketbeanstv", "edelive" , "florentinwill" , "krogmann" , "m_a_r_a_h" , "nilsbomhofflive" , "mon_official" , "pixelviet", "tonimarony32", "doomdesign", "budibros" ]
var url = 'https://api.twitch.tv/helix/streams?';

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

    for (let i = 0; i < ids.length; i++) {
        url += 'user_login='+ ids[i] +'&';
    }

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
        output += '<span><a href="https://www.twitch.tv/'+ element.user_login +'" target="_blank" style="background-image: url(/images/streams/'+element.user_login+'.webp);"></a><span><img src="https://static-cdn.jtvnw.net/ttv-boxart/' + element.game_id + '.jpg"/><p>'+ element.user_name +'</p><p>'+ element.game_name + '</p><p>' +element.title+'</p></span></span>';
        });

        document.getElementById('streams').innerHTML = output;
    })
    .catch((error) => {
        if(error === 401)
        console.error('Error:', error);
    });
}

LivestreamDaten();