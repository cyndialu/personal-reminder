const apiKey = process.env.NEWS_API_KEY;
const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=us&language=en`;

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
            const response = await fetch(url);
            const data = await response.json();
            //console.log(data);
            //console.log(data.results);
            displayNews(data.results);
            const newTime = new Date().getTime();
            const newsObj = {
                time: newTime,          
                articles: data.results
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
            const articleCard = document.createElement('div');
            articleCard.classList.add('conatainer');
            articleCard.innerHTML = `<div class="card"><img class="card-img-top" src="${item.image_url}" alt="${item.title}">
            <div class="card-body"><h4 class="card-title">${item.title}</h4>
            <a href="${item.link}" target="_blank" class="btn btn-outline-dark mt-3">See more</a></div></div>`;
            newsDiv.appendChild(articleCard);               
    }
}
            
loadNews();