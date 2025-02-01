import axios from 'axios';
const apiKey = process.env.NEWS_API_KEY;
const url = 'https://api.newsdatahub.com/v1/news?language=en';
const headers = {
    'X-Api-Key': apiKey,
    'User-Agent': 'personal_reminder'
};

// Get news from localStorage
function getNews(){
    return JSON.parse(localStorage.getItem('news')) || [];
}

// Load news
async function loadNews(){
    const news = getNews();
    const now = new Date().getTime();
    // Make API call if localStorage is empty or it's been 6 hours since last call
    if(news.length === 0 || ((now - news.time) > (6 * 60 * 60 * 1000))){
        try{
            const response = await axios.get(url, {headers});
            const data = response.data;
            //console.log(data);
            displayNews(data.data);
            const newTime = new Date().getTime();
            const newsObj = {
                time: newTime,          
                articles: data.data
            };
            // Add news object to localStorage
            localStorage.setItem('news', JSON.stringify(newsObj));          
        }catch (error){
            console.error(`There was an error: `, error.response.data);
        }   
    }else{
        displayNews(news.articles);
    }
}

// Populate news data to UI
function displayNews(data){
    const newsDiv = document.querySelector("#news");
    for(const item of data){
        if(item.title !== "[Removed]"){
            const articleCard = document.createElement('div');
            articleCard.classList.add('conatainer');
            articleCard.innerHTML = `<div class="card"><img class="card-img-top" src="${item.media_url}" alt="${item.title}">
            <div class="card-body"><h4 class="card-title">${item.title}</h4>
            <a href="${item.article_link}" target="_blank" class="btn btn-outline-dark mt-3">See more</a></div></div>`;
            newsDiv.appendChild(articleCard);
        }        
    }
}
            
loadNews();