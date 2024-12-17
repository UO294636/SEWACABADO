"use strict";

class Memoria{
    constructor(){
        this.elements = [
            { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
            { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
            { element: "McClaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"},
            { element: "McClaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"},
            { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"},
            { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"},
            { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"},
            { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"},
            { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"},
            { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"},
            { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"},
            { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"}
        ];

        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }
    resetBoard(){
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    shuffleElements(){
        const tam = this.elements.length;

        for(let i = tam -1; i > 0;i--){
            const j = Math.floor(Math.random() * (i))+1;
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards(){
        this.lockBoard = true;
        setTimeout(() =>{
            this.firstCard.dataset.state = "initial";
            this.secondCard.dataset.state = "initial";
            this.resetBoard();
        },500)
    }

    checkForMatch(){
        this.secondCard.dataset.element === this.firstCard.dataset.element ? this.disableCards() : this.unflipCards();
    }

    disableCards(){
        this.firstCard.dataset.state= "revealed";
        this.secondCard.dataset.state = "revealed";
        this.resetBoard();
        this.checkForWin();//Compruebo si ha ganado.
    }

    createElements(){
        const container = document.querySelector('section');

        for(const card in this.elements){
            const cardData = this.elements[card];

            const articleNode = document.createElement('article');
            articleNode.setAttribute('data-element',cardData.element);
            articleNode.setAttribute('data-state',"initial");

            const h3Node = document.createElement('h3');
            h3Node.textContent = 'Tarjeta de memoria';

            const imgNode = document.createElement('img');
            imgNode.setAttribute('src', cardData.source);
            imgNode.setAttribute('alt', cardData.element);

            articleNode.appendChild(h3Node);
            articleNode.appendChild(imgNode);

            container.appendChild(articleNode);
        }
    }

    addEventListeners(){
        const cards = document.querySelectorAll('section article');
        cards.forEach(cardOfTheDocument => cardOfTheDocument.addEventListener('click',this.flipCard.bind(cardOfTheDocument,this)));
        const botonReinicio = document.querySelector('button');
        botonReinicio.addEventListener("click", () => {
            this.resetGame();
        });
    }
    flipCard(memoria){
        if(this.dataset.state === "revealed" || memoria.lockBoard === true || this === memoria.firstCard){
            return;
        }
        this.dataset.state = "flip";
        if(memoria.hasFlippedCard === false){
            memoria.hasFlippedCard = true;
            memoria.firstCard = this;
        }else{
            memoria.secondCard = this;
            memoria.checkForMatch();

        }
    }

    checkForWin(){
        const cards = document.querySelectorAll('section article');
    const allRevealed = Array.from(cards).every(card => card.dataset.state === "revealed");

    if (allRevealed) {
        const h2OfTheGame = document.querySelector('section h2');
        if (h2OfTheGame === undefined){
            console.log("si lo detecta");
        }
        h2OfTheGame.textContent = "¡Enhorabuena, has ganado!";
        h2OfTheGame.scrollIntoView({ behavior: 'smooth' });
    }
}

resetGame() {
    const container = document.querySelector('section');
    container.innerHTML = '';
    const titulo = document.createElement('h2');
    titulo.textContent = "Juego de Memoria";
    container.appendChild(titulo);

    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.firstCard = null;
    this.secondCard = null;

    this.shuffleElements();
    
    this.createElements();
    this.addEventListeners();
}


}