let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY3NGEwOTdmNmI0YjAwMTU0MjhmZDAiLCJpYXQiOjE3MTgxMzI1MzAsImV4cCI6MTcxOTM0MjEzMH0.42VDmLOemsVMnnbDRtwiYLrIOqMFrFhisAQlFAMflgo";
let url = "https://striveschool-api.herokuapp.com/api/product/";
let products = [];
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    ottieniProdotti();
    inviaProdotti();
    document.getElementById('ricerca').addEventListener('input', filtraProdotti);
    document.getElementById('cart-icon').addEventListener('click', function() {
        console.log("Cliccato sull'icona del carrello");
        mostraCarrello();
    });
});

async function ottieniProdotti() {
    try {
        let response = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        let data = await response.json();
        products = data;
        mostraProdotti(data);
    } catch (error) {
        console.error('Si è verificato un errore:', error);
    }
}

async function inviaProdotti() {
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "O bag california rosa smoke",
                description: "Shopping bag capiente con chiusura magnetica e tasca interna. Perfetta da abbinare ad un look estivo semplice grazie al dettaglio dei manici in corda.",
                brand: "O Bag",
                imageUrl: "https://cdn.obag.filoblu.com/media/catalog/product/cache/42c4b26f1cd8cebc9ada7467d079943d/O/B/OBAGBG11_TES20_075_NOTAG_UNICA_L1.jpg",
                price: 80
            })
        });
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Si è verificato un errore:', error);
    }
}

function mostraProdotti(prodotti) {
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    prodotti.forEach(prodotto => {
        const swiperSlide = document.createElement("div");
        swiperSlide.className = "swiper-slide";
        const htmlProdotto = `
            <div class="card mb-4 shadow-sm h-100 d-flex flex-column">
                <a href="details.html?id=${prodotto._id}" class="text-decoration-none text-dark flex-grow-1">
                    <img src="${prodotto.imageUrl}" class="card-img-top" alt="${prodotto.name}">
                    <div class="card-body d-flex flex-column flex-grow-1">
                        <h5 class="card-title">${prodotto.name}</h5>
                        <p class="card-text">${prodotto.description}</p>
                        <p class="card-text"><strong>Marca:</strong> ${prodotto.brand}</p>
                        <p class="card-text"><strong>Prezzo:</strong> $${prodotto.price}</p>
                    </div>
                </a>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-primary mt-auto mb-3 w-100" onclick="aggiungiAlCarrello('${prodotto._id}')"><i class="bi bi-cart2"></i></button>
                </div>
            </div>`;
        swiperSlide.innerHTML = htmlProdotto;
        swiperWrapper.appendChild(swiperSlide);
    });
    new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 3,
        loop: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

function reindirizzaDettagliProdotto(idProdotto) {
    window.location.href = "details.html?id=" + idProdotto;
}

function filtraProdotti(evento) {
    const termineRicerca = evento.target.value.toLowerCase();
    const contenitoreSuggerimenti = document.getElementById('suggestions');
    contenitoreSuggerimenti.innerHTML = '';
    if (termineRicerca) {
        const prodottiFiltrati = products.filter(prodotto =>
            prodotto.name.toLowerCase().includes(termineRicerca)
        );
        prodottiFiltrati.forEach(prodotto => {
            const elementoSuggerimento = document.createElement('div');
            elementoSuggerimento.className = 'suggestion-item';
            elementoSuggerimento.innerHTML = `
                <img src="${prodotto.imageUrl}" alt="${prodotto.name}" class="suggestion-image">
                <div class="suggestion-text">${prodotto.name}</div>`;
            elementoSuggerimento.addEventListener('click', () => {
                reindirizzaDettagliProdotto(prodotto._id);
            });
            contenitoreSuggerimenti.appendChild(elementoSuggerimento);
        });
        contenitoreSuggerimenti.classList.add('visible');
        contenitoreSuggerimenti.addEventListener('mouseleave', () => {
            contenitoreSuggerimenti.classList.remove('visible');
        });
        contenitoreSuggerimenti.addEventListener('mouseenter', () => {
            contenitoreSuggerimenti.classList.add('visible');
        });
    } else {
        contenitoreSuggerimenti.classList.remove('visible');
    }
}

function aggiungiAlCarrello(idProdotto) {
    const prodotto = products.find(prod => prod._id === idProdotto);
    if (prodotto) {
        const indiceProdottoEsistente = cart.findIndex(item => item._id === idProdotto);
        if (indiceProdottoEsistente !== -1) {
            cart[indiceProdottoEsistente].quantity += 1;
        } else {
            cart.push({ ...prodotto, quantity: 1 });
        }
        aggiornaCarrello();
    }
}

function aggiornaCarrello() {
    const contenitoreElementiCarrello = document.getElementById('cart-items');
    const elementoPrezzoTotale = document.getElementById('total-price');
    const elementoBadgeCarrello = document.getElementById('cart-badge');
    const numeroElementiCarrello = cart.length;
    contenitoreElementiCarrello.innerHTML = '';
    let prezzoTotale = 0;
    cart.forEach((prodotto, indice) => {
        const elementoCarrello = document.createElement('li');
        elementoCarrello.className = 'list-group-item d-flex justify-content-between align-items-center';
        elementoCarrello.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${prodotto.imageUrl}" alt="${prodotto.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                <div>
                    <h6>${prodotto.name}</h6>
                    <small>$${prodotto.price}</small>
                </div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="rimuoviDalCarrello(${indice})">
                <i class="bi bi-trash"></i>
            </button>`;
        contenitoreElementiCarrello.appendChild(elementoCarrello);
        prezzoTotale += prodotto.price;
    });
    elementoPrezzoTotale.textContent = prezzoTotale.toFixed(2);
    elementoBadgeCarrello.textContent = numeroElementiCarrello;
}

function rimuoviDalCarrello(indice) {
    cart.splice(indice, 1);
    aggiornaCarrello();
}

function mostraCarrello() {
    const carrelloOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    carrelloOffcanvas.show();
}

function svuotaCarrello() {
    cart = [];
    aggiornaCarrello();
}
function aggiornaIntervalloPrezzo(valori) {
    const displayPrezzoMinimo = document.getElementById('min-price-display');
    const displayPrezzoMassimo = document.getElementById('max-price-display');
    
    displayPrezzoMinimo.textContent = valori[0];
    displayPrezzoMassimo.textContent = valori[1];
}

document.addEventListener('DOMContentLoaded', () => {
    const intervalloPrezzo = document.getElementById('price-range');
    
    noUiSlider.create(intervalloPrezzo, {
        start: [0, 1000],
        connect: true,
        range: {
            'min': 0,
            'max': 1000
        }
    });

    intervalloPrezzo.noUiSlider.on('update', (valori, handle) => {
        aggiornaIntervalloPrezzo(valori.map(valore => Math.round(valore)));
    });

    aggiornaIntervalloPrezzo(intervalloPrezzo.noUiSlider.get());
});

function selezionaCategoria(evento) {
    evento.preventDefault();

    const collegamenti = document.querySelectorAll('.category-list a');
    collegamenti.forEach(collegamento => collegamento.classList.remove('selected'));

    evento.target.classList.add('selected');
}

document.addEventListener('DOMContentLoaded', () => {
    aggiornaIntervalloPrezzo();
});
