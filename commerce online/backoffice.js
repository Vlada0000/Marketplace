document.addEventListener("DOMContentLoaded", () => {
    ottieniProdotti();
    document.getElementById("edit-product-form").addEventListener("submit", salvaModifiche);
    document.getElementById("add-product-form").addEventListener("submit", aggiungiProdotto);
});

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY3NGEwOTdmNmI0YjAwMTU0MjhmZDAiLCJpYXQiOjE3MTgxMzI1MzAsImV4cCI6MTcxOTM0MjEzMH0.42VDmLOemsVMnnbDRtwiYLrIOqMFrFhisAQlFAMflgo";
const url = "https://striveschool-api.herokuapp.com/api/product/";
let productId;

async function ottieniProdotti() {
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        mostraProdotti(data);
    } catch (error) {
        console.error('Si è verificato un errore:', error);
    }
}

function mostraProdotti(prodotti) {
    const listaProdotti = document.getElementById("products-list");
    listaProdotti.innerHTML = "";

    prodotti.forEach(prodotto => {
        const elementoLista = document.createElement("li");
        elementoLista.classList.add("list-group-item");

        const pulsanteModifica = document.createElement("button");
        pulsanteModifica.classList.add("btn", "btn-sm", "btn-primary", "me-2");
        pulsanteModifica.textContent = "Modifica";
        pulsanteModifica.addEventListener("click", () => apriOffcanvasModifica(prodotto));

        const pulsanteElimina = document.createElement("button");
        pulsanteElimina.classList.add("btn", "btn-sm", "btn-danger");
        pulsanteElimina.textContent = "Elimina";
        pulsanteElimina.addEventListener("click", () => eliminaProdotto(prodotto._id));

        elementoLista.innerHTML = `
            <span>${prodotto.name}</span>
            <span>${prodotto.brand}</span>
            <span>$${prodotto.price}</span>
        `;
        elementoLista.appendChild(pulsanteModifica);
        elementoLista.appendChild(pulsanteElimina);

        listaProdotti.appendChild(elementoLista);
    });
}

async function eliminaProdotto(idProdotto) {
    try {
        const response = await fetch(`${url}${idProdotto}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        console.log("Prodotto eliminato con successo");
        ottieniProdotti();
    } catch (error) {
        console.error('Si è verificato un errore:', error);
    }
}

function apriOffcanvasModifica(dettagliProdotto) {
    popolaModificaForm(dettagliProdotto);
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('editProductOffcanvas'));
    offcanvas.show();
}

function popolaModificaForm(dettagliProdotto) {
    document.getElementById("edit-name").value = dettagliProdotto.name;
    document.getElementById("edit-description").value = dettagliProdotto.description;
    document.getElementById("edit-brand").value = dettagliProdotto.brand;
    document.getElementById("edit-imageUrl").value = dettagliProdotto.imageUrl;
    document.getElementById("edit-price").value = dettagliProdotto.price;
    productId = dettagliProdotto._id;
}

async function salvaModifiche(evento) {
    evento.preventDefault();

    const nome = document.getElementById("edit-name").value;
    const descrizione = document.getElementById("edit-description").value;
    const marca = document.getElementById("edit-brand").value;
    const imageUrl = document.getElementById("edit-imageUrl").value;
    const prezzo = parseFloat(document.getElementById("edit-price").value);

    try {
        const response = await fetch(`${url}${productId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: nome, description: descrizione, brand: marca, imageUrl, price: prezzo })
        });
        console.log("Dettagli prodotto aggiornati con successo");
        ottieniProdotti();
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('editProductOffcanvas'));
        offcanvas.hide();
    } catch (error) {
        console.error('Si è verificato un errore:', error);
    }
}

async function aggiungiProdotto(evento) {
    evento.preventDefault();

    const nome = document.getElementById("name").value;
    const descrizione = document.getElementById("description").value;
    const marca = document.getElementById("brand").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const prezzo = parseFloat(document.getElementById("price").value);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: nome, description: descrizione, brand: marca, imageUrl, price: prezzo })
        });
        console.log("Prodotto aggiunto con successo");
        document.getElementById("add-product-form").reset();
        ottieniProdotti();
    } catch (error) {
        console.error('Si è verificato un errore:', error);
    }
}
