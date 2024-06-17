document.addEventListener("DOMContentLoaded", () => {
    const url = "https://striveschool-api.herokuapp.com/api/product/";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY3NGEwOTdmNmI0YjAwMTU0MjhmZDAiLCJpYXQiOjE3MTgxMzI1MzAsImV4cCI6MTcxOTM0MjEzMH0.42VDmLOemsVMnnbDRtwiYLrIOqMFrFhisAQlFAMflgo";

    const urlParams = new URLSearchParams(location.search);
    const productId = urlParams.get('id');

    const productDetailsUrl = `${url}${productId}`;

    async function ottieniDettagliProdotto() {
        try {
            const response = await fetch(productDetailsUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const dettagliProdotto = await response.json();
            console.log(dettagliProdotto);
            mostraDettagliProdotto(dettagliProdotto);
        } catch (error) {
            console.error('Si è verificato un errore:', error);
        }
    }

    function mostraDettagliProdotto(dettagliProdotto) {
        const containerDettagliProdotto = document.getElementById("product-details");
        if (containerDettagliProdotto) {
            containerDettagliProdotto.innerHTML = `
                <div class="col-md-4">
                    <img src="${dettagliProdotto.imageUrl}" class="img-fluid" alt="${dettagliProdotto.name}">
                </div>
                <div class="col-md-8 align-content-center">
                    <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${dettagliProdotto.name}</h5>
                            <p class="card-text">${dettagliProdotto.description}</p>
                            <p class="card-text"><strong>Marca:</strong> ${dettagliProdotto.brand}</p>
                            <p class="card-text"><strong>Prezzo:</strong> $${dettagliProdotto.price}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            console.error("Elemento con ID 'product-details' non trovato.");
        }
    }

    ottieniDettagliProdotto();
});
