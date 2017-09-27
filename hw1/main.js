document.addEventListener('DOMContentLoaded', function(){ 

	function QuoteHandler(button, path) {
		let requestUrl = path||"https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json";
		let allQuotes;
		let authorsList;
		let selectedAuthor;

		(function getAllQuotes() {
			let request = new XMLHttpRequest();

			request.open("GET", requestUrl, true);
			request.send();

			request.onreadystatechange  = function() {
				if ( request.readyState != 4 ) return;

				if ( request.status == 200 ) {
					button.disabled = false;
					allQuotes = JSON.parse( request.responseText );

					allQuotes = quotesArrayPreporation(allQuotes);
					authorsList = getAuthorsList(allQuotes);

					renderSelect();
				}
			}
		})();

		
		button.addEventListener("click" , function() {
			let randomQuotes = allQuotes;

			if (selectedAuthor) {
				randomQuotes = allQuotes.filter( function(quote) { //убираем цитаты без автора
					return quote.quoteAuthor == selectedAuthor;
				})
			}

			let randomQuoteIndex = Math.floor( Math.random() * randomQuotes.length);
			document.querySelector(".quote-text").innerHTML = '"' + randomQuotes[randomQuoteIndex].quoteText + '" - ' + randomQuotes[randomQuoteIndex].quoteAuthor;
		});

		function quotesArrayPreporation (quotesArray) {

			quotesArray.sort( function(quoteA, quoteB) {  //сортируем по автору и тексту 
				if (quoteA.quoteAuthor.localeCompare(quoteB.quoteAuthor) == 0) {
					return quoteA.quoteText.localeCompare(quoteB.quoteText)
				}
				return quoteA.quoteAuthor.localeCompare(quoteB.quoteAuthor);
			});

			quotesArray = quotesArray.filter( function(quote) { //убираем цитаты без автора
				return quote.quoteAuthor != "";
			});

			for (let i = 0; i < quotesArray.length-1;) { //убираем дубли
				debugger;
				if (quotesArray[i].quoteText == quotesArray[i+1].quoteText) {
					quotesArray.splice(i+1, 1);
				} else {
					i++;
				}
			}

			return quotesArray;
		}

		function getAuthorsList (quotesArray) {

			let helpObj = {};

			quotesArray.forEach( function(current) { //получаем список авторов
				let authorName = current.quoteAuthor;
				helpObj[authorName] = true;
			});

			return Object.keys(helpObj);
		}

		function renderSelect () {
			let authorsListNode = document.createElement("select");
			let welcomeString = document.createElement("option");
			let authorIndex = 0;
			authorsListNode.className = "authorsList";
			welcomeString.innerHTML = "Get a random quote";
			welcomeString.selected = true;
			authorsListNode.appendChild(welcomeString);
			

			for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
				let currentBlock = document.createElement("optgroup");
				currentBlock.label = String.fromCharCode(i);
				while (authorIndex < authorsList.length && i == authorsList[authorIndex].charCodeAt(0)) {
					let currentOption = document.createElement("option");
					currentOption.innerHTML = authorsList[authorIndex];
					currentBlock.appendChild(currentOption);
					authorIndex++;
				}

				if (currentBlock.childNodes.length > 1) { //не добавляем пустые select
					authorsListNode.appendChild(currentBlock);
				}
			}

			document.body.appendChild(authorsListNode);
			authorsListNode.addEventListener("change" , function() {
				if (this.options[this.selectedIndex].text == "Get a random quote") {
					selectedAuthor = "";
				} else {
					selectedAuthor = this.options[this.selectedIndex].text;
				}
			});
		}

	}

	let button = document.querySelector(".button");
	let mainHandler = new QuoteHandler(button);

})
