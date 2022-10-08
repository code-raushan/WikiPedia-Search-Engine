
async function handleSubmit(event){
    event.preventDefault();
    const input = document.querySelector('.js-search-input').value;
    const searchQuery = input.trim(); //trims the unnecessary spaces before and after the string
    // console.log(searchQuery);

    const searchResults = document.querySelector('.js-search-results');
    searchResults.innerHTML = ''; //clearing the previous results
    const searchAnimation = document.querySelector('.spinner-box');
    searchAnimation.classList.remove('hidden');


    async function searchWiki(searchQuery){
        const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`
        const response = await fetch(endpoint);
        if(response.status!==200){
            throw Error(response.statusText);
        }
        const json = await response.json();//awaits the json response
        return json;
        
    }

    try{
        const results = await searchWiki(searchQuery);
        if(results.query.searchinfo.totalhits===0){
            alert('search box empty');
            return;
        }
        displayResults(results);
    }catch(error){
        console.log(error);
        alert('search failed')
    }finally{
        searchAnimation.classList.add('hidden');
    }
    function displayResults(results){
        const searchResults = document.querySelector('.js-search-results');

        results.query.search.forEach(r=>{
            //generating individual urls
            const url = `https://en.wikipedia.org/?curid=${r.pageid}`;
            //appending the search results to the DOM 

            searchResults.insertAdjacentHTML('beforeend', 
            `<div class="result-item">
              <h3 class="result-title">
                <a href="${url}" target ="_blank" rel="noopener">${r.title}</a>
              </h3>
              <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
              <span class = "result-snippet">${r.snippet}</span>
              <br>
            </div>`
            );
        });
    }
    

}
const form = document.querySelector('.js-search-form')
form.addEventListener('submit', handleSubmit);
