const obj = {
    card_input: document.querySelector('#card_input'),
    success: document.querySelector('.success'),
    error: document.querySelector('.error'),
    alertTitle: document.getElementById('alertTitle'),
    alertDialog: document.getElementById('alertDialog'),
    closeModal: document.getElementById('closeModal'),
    card_form: document.querySelector('#card_form')
}

obj.closeModal.addEventListener("click", closeModal)
obj.card_input.addEventListener('input', restrictNumber);
obj.card_form.addEventListener('submit', validateCard);

function closeModal() {
    obj.alertDialog.close();
    obj.alertTitle.textContent = "";
    obj.success.classList.remove("show");
    obj.error.classList.remove("show");
}

function restrictNumber(e) {

    const newValue = e.target.value.replace(/\D/gim, "");
    e.target.value = newValue;
    return
};

function validateCard(e) {
    e.preventDefault();

    if (obj.card_input.value == '') {

        obj.success.classList.remove("show")
        obj.error.classList.add("show")
        obj.alertTitle.textContent = "Field requiered";
        obj.alertDialog.showModal();
        return
    }

    let card_type;
    let sum_odd_index = 0;
    let sum_even_index = 0;

    if (card_input.value[0] == '3') {

        card_type = 'AMERICAN EXPRESS';
    }

    else if (card_input.value[0] == '4') {

        card_type = 'VISA';
    }

    else if (card_input.value[0] == '5') {

        card_type = 'MASTERCARD';
    };

    const card_number = obj.card_input.value.split('').reverse().join('');

    for (let i = 0; i < card_number.length; i += 2) {

        sum_odd_index += parseInt(card_number[i]);
    };

    for (let i = 1; i < card_number.length; i += 2) {

        const num = parseInt(card_number[i]) * 2;

        if (num > 9) {

            sum_even_index += (1 + (num % 10));
        }

        else {

            sum_even_index += num;
        };
    };

    const total = sum_odd_index + sum_even_index;

    if (total % 10 == 0 && card_type) {

        obj.error.classList.remove("show")
        obj.success.classList.add("show")
        obj.alertTitle.textContent = `VALID CARD\n\nCARD TYPE: ${card_type}`;
        obj.alertDialog.showModal();
        obj.card_input.value = '';
        return
    }

    obj.success.classList.remove("show")
    obj.error.classList.add("show")
    obj.alertTitle.textContent = "INVALID CARD\n\nTry Again!"
    obj.alertDialog.showModal();
    return
}