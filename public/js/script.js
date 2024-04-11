// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// End Show Alert

// table-cart
const tableCart = document.querySelector("[table-cart]");
if (tableCart) {
    const inputsQuantity = tableCart.querySelectorAll("input[name='quantity']");

    inputsQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const productId = input.getAttribute("item-id");
            const quantity = input.value;

            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    });
}
// End table-cart