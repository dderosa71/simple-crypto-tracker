const emptyHeart = '♡'
const fullHeart = '♥'
const tableTop = document.querySelector('#table-top');
const coinContainer = document.querySelector('#coin-list')
const yourCoinContainer = document.querySelector('#your-coins-body')
console.lo
const coinURL = 'http://localhost:3000/yourcoins'
nomicsKey = "91e78b6b4b03a231d59598e2b3126326"
cryptoURL = `https://api.nomics.com/v1/currencies/ticker?key=${nomicsKey}&interval=1d,30d&convert=USD&per-page=25&page=1`

const yourCoins = document.querySelector('#your-coins');
yourCoins.style.display = 'none'

function createTop100() {
    fetch("https://api.nomics.com/v1/currencies/ticker?key=91e78b6b4b03a231d59598e2b3126326&interval=1d,30d&convert=USD&per-page=250&page=1")
        .then(resp => resp.json())
        .then(json => {
            const tableBody = document.getElementById("all-coins")
            json.forEach(coinData =>
                createTableRows(coinData, tableBody))
            let coinArrayForSearch = json.map(data => data.name)
            console.log(coinArrayForSearch)
            autocomplete(document.getElementById("myInput"), coinArrayForSearch);
            
        })
}

function createTableRows(dataFromAPI, tableBody) {
    const tr = document.createElement('tr')
    tr.setAttribute('id', dataFromAPI.name)
    const wantedFields = [emptyHeart, dataFromAPI.logo_url, dataFromAPI.currency,
        dataFromAPI.name, dataFromAPI.price];
    wantedFields.forEach(field => createTableDataCell(field, tr))
    tableBody.appendChild(tr)
}

function createTableDataCell(wantedField, tr) {
    //for cells without images
    const td = document.createElement('td')
    if (wantedField.startsWith('https://')) {
        let img = document.createElement('img')
        img.setAttribute('src', wantedField)
        img.setAttribute('alt', wantedField)
        img.style.height = "25px"
        img.style.width = "25px"
        td.appendChild(img)
    }
    else if (["Like", "Pin", "Add to My Coins"].includes(wantedField)) {
        let button = document.createElement('button')
        button.innerText = wantedField
        td.appendChild(button)
    }
    else if (wantedField === emptyHeart) {
        let button = document.createElement('button')
        button.innerText = wantedField
        button.className = "heart"
        td.appendChild(button)
        heartUpdate(button)
    }
    else if (!isNaN(wantedField)) {
        let fiveDigits = Math.abs(6 - wantedField.length)
        let currency = wantedField > 10 ? Math.round(wantedField * 100) / 100
            : wantedField.substring(0, fiveDigits);
        td.innerText = `$${wantedField}`
    }
    else {
        td.innerText = wantedField
    }
    tr.appendChild(td)
}

function heartUpdate(item) {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('red')) {
            e.target.innerText = '♡'
            e.target.classList.toggle("red")
            e.target.classList.toggle("heart")
        } else {
            e.target.innerText = '♥'
            e.target.classList.toggle("red")
            e.target.classList.toggle("heart")
        }
    })
}

//filters on only hearted coins.
function showFavorites() {
    const favoriteCoinButton = document.querySelector('#favorite-coins')
    favoriteCoinButton.addEventListener('click', (e) => {
        yourCoins.style.display = 'none'
        tableTop.style.display = ''
        const notLiked = document.querySelectorAll('.heart');
        notLiked.forEach(tr => tr.parentNode.parentNode.style.display = 'none')
    })
}
function resetExplore() {
    const exploreCoinsButton = document.getElementById('explore-coins')
    exploreCoinsButton.addEventListener('click', () => {
        yourCoins.style.display = 'none'
        tableTop.style.display = ''
        const tr = document.querySelectorAll('tr');
        tr.forEach(tr => tr.style.display = '')
    })
}

function displayShowCoins() {
    const yourCoinsButton = document.getElementById('your-coins-button');
    yourCoinsButton.addEventListener('click', () => {
        tableTop.style.display = 'none'
        yourCoins.style.display = ''
    })
}

function createCoins() {
    fetch(coinURL)
        .then(resp => resp.json())
        .then(coins => {
            for (coin of coins) {
                p = document.createElement('p')
                p.innerText = `${coin.name}`
                coinContainer.appendChild(p)
            }
        })
}

function newCoin() {
    const newCoinSubmit = document.querySelector("#new-coin-submit")
    newCoinSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        console.log(e)
        let coinName = e.target.parentElement[0].value
        let coinData = {

        }
        fetch(coinURL,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(
                    {
                        "name": `${coinName}`,
                        "image": 'https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/btc.svg',
                        "price": 3000,
                        "holdings": 0,
                        "usdValue": 0
                        
                    })
            }
        )
            .then(() => {
                myCoinRows()
            })
    })
}

function myCoinPageRefresher(){
    const yourCoinsButton = document.getElementById('your-coins-button');
    const newCoinSubmit = document.querySelector("#new-coin-submit")
    yourCoinsButton.addEventListener('click', ()=> maintainUserData())
    newCoinSubmit.addEventListener('click', ()=> maintainUserData())

}

function maintainUserData(){
    fetch('https://api.nomics.com/v1/currencies/ticker?key=91e78b6b4b03a231d59598e2b3126326&interval=1d,30d&convert=USD&per-page=25&page=1')
    .then (resp => resp.json())
    .then (json =>  {
        console.log(json)
        let currentMyCoinData = document.querySelectorAll('.coin-row')
        currentMyCoinData.forEach(row => row.remove())
        myCoinRows(json)
    })
}

function myCoinRows(liveData){
    fetch('http://localhost:3000/yourcoins')
    .then(resp => resp.json())
    .then(coinData =>  {
    console.log(coinData)
    for (let obj of coinData){ 
        let tr = document.createElement('tr');
        console.log(obj.name)
        tr.setAttribute('id', `my-coin-${obj.name}-${obj.id}`) 
        tr.className = "coin-row"
        yourCoinContainer.appendChild(tr)
        liveCoinData = liveData.filter(coin => Object.values(coin).includes(obj.name))
        currentCoinObject = liveCoinData[0]

        let tdDelete = document.createElement('td')
        let tdDeleteIMG = document.createElement('img');
        tdDeleteIMG.setAttribute('src', 'https://icon-library.com/images/delete-icon/delete-icon-13.jpg')
        tdDeleteIMG.setAttribute('alt', 'delete')
        tdDeleteIMG.style.height = "25px"
        tdDeleteIMG.style.width = "25px"
        tdDelete.append(tdDeleteIMG)
        tr.append(tdDeleteIMG)
        console.log(liveCoinData)
        tdDeleteIMG.addEventListener('click', (e) => {
            e.preventDefault()
            tr.remove()
            fetch(`http://localhost:3000/yourcoins/${obj.id}`,{
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
        })
        })

        
       
        

        for (let key in obj){   
            console.log('loopentered')
            let td = document.createElement('td')
            
            if(key === 'image') {
                const logo = liveCoinData[0].logo_url;
                let img = document.createElement('img')
                img.setAttribute('src', logo)
                img.setAttribute('alt', obj.name)
                img.style.height = "25px"
                img.style.width = "25px"
                // img.innerHTML=`<img src="${obj[key]}" alt="Image of ${obj.name}>`;
                td.appendChild(img)
        }
            else if(key === 'holdings'){
                td.innerText = "Click Here to Enter Coins"
                td.setAttribute('contenteditable', true)
                td.setAttribute('id', `${liveData[0].name}-holdings`)
                const thePrice = liveCoinData[0].price
                console.log(thePrice)
                td.addEventListener('keyup', (e) => {
                    currentValue = td.textContent
                    console.log(liveData[0].price)
                    // why does this fail when not set as a variable outside of this line?
                    let usdHoldings = currentValue > 0 ? thePrice * currentValue : 0;
                    e.target.nextSibling.innerText = usdHoldings
                    console.log(e)
                }
                    )
            }
            else if(['price', 'name', 'usdValue'].includes(key))   {
                let value = key === 'usdValue' ? 0 : liveCoinData[0][key];
                td.innerText = `${value}`
                td.setAttribute('id', `${liveCoinData[0][name]}-${key}`)
                
            } 
            
            // }
            
            tr.appendChild(td)
        
            function holdings(){
                td.innerText = "Click Here to Enter Coins"
                td.setAttribute('contenteditable', true)
                td.setAttribute('id', `${liveData[0].name}-holdings`)
                td.addEventListener('keyup', (e) => {
                    currentValue = td.textContent
                    console.log(liveData[0].price)
                    let usdHoldings = currentValue > 0 ? currentValue * liveData[0].price : 0;
                    e.target.nextSibling.innerText = usdHoldings
                    console.log(e)
                }
                    )
            }

        }}
    })
}



document.addEventListener("DOMContentLoaded", () => {
    // createCoins()
    fetch("https://api.nomics.com/v1/currencies/ticker?key=91e78b6b4b03a231d59598e2b3126326&interval=1d,30d&convert=USD&per-page=25&page=1")
        .then(resp => resp.json())
        .then(json => {
            const tableBody = document.getElementById("all-coins")
            json.forEach(coinData =>
                createTableRows(coinData, tableBody))
            let coinArrayForSearch = json.map(data => data.name)
            let fullCoinObject = json.map(data => data)
            // console.log(coinArrayForSearch)
            autocomplete(document.getElementById("myInput"), coinArrayForSearch);
        })
    newCoin()
    createTop100()
    showFavorites()
    resetExplore()
    displayShowCoins()
    // maintainUserData()
    myCoinPageRefresher()

  
    
}
)
