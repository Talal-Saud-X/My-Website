const obj = {
    input: document.getElementById("input"),
    clear: document.getElementById("clear"),
    form: document.getElementById("form"),
    result: document.querySelector(".result"),
    messageAlert: document.querySelector(".message"),
    cache: { 0: 1, 1: 1, 2: 2, 3: 6, 4: 24, 5: 120, 6: 720, 7: 5040 }
}

obj.input.addEventListener("input", restrictNumbers);

obj.clear.addEventListener("click", () => {
    obj.messageAlert.classList.remove("alert")
    obj.result.textContent = ""
    obj.messageAlert.textContent = ""
    obj.input.value = ""
    return
})

function restrictNumbers(e) {
    const newValue = e.target.value.replace(/\D/gim, "");
    e.target.value = newValue;
    return
}

obj.form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!obj.input.value.trim() || obj.input.value == '') {

        obj.messageAlert.textContent = "Field Required";
        obj.messageAlert.classList.add("alert");
        return
    }

    obj.messageAlert.classList.remove("alert");
    obj.messageAlert.textContent = ""
    obj.result.textContent = ""
    const inputValue = obj.input.value
    obj.input.value = ""

    if (!isNaN(inputValue)) {
        if (inputValue < 0 || inputValue > 170) {
            obj.result.textContent += "\nResult: Error!"
            return
        }
        for (let i = inputValue; i >= 0; i--) {

            if (i == 0) {
                obj.result.textContent += `Factorial of (0!) = 1\n\n`
                break
            }
            obj.result.textContent += `Factorial of (${i}!) = ${i} * (${i - 1}!)\n\n`
        }
        obj.result.textContent += `\nResult: ${factorial(inputValue)}`
        return
    }

    obj.messageAlert.textContent = "Error!";
    obj.messageAlert.classList.add("alert");
    return

})

function factorial(x) {
    if (x < 0) {
        return "Error!"
    }
    if (x in obj.cache) return obj.cache[x]
    return obj.cache[x] = x * factorial(x - 1)
}