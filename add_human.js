function createHumanForm() {
    let main_content = document.getElementById("main_content")
    let addedForm = document.createElement("form")
    main_content.appendChild(addedForm)
    //addedForm.setAttribute("action", "sendHuman()")
    addedForm.setAttribute("method", "post")

    let nameLabel = document.createElement("label")
    nameLabel.setAttribute("for", "name")
    nameLabel.innerHTML = "Imię:<br>"
    addedForm.appendChild(nameLabel)
    let nameInput = document.createElement("input")
    nameInput.setAttribute("type", "text")
    nameInput.id = "nameInput"
    nameInput.placeholder = "Imię..."
    //nameInput.setAttribute("name", "humanName")
    addedForm.appendChild(nameInput)
    
    let surnameLabel = document.createElement("label")
    surnameLabel.setAttribute("for", "surname")
    surnameLabel.innerHTML = "<br><br>Nazwisko:<br>"
    addedForm.appendChild(surnameLabel)
    let surnameInput = document.createElement("input")
    surnameInput.setAttribute("type", "text")
    surnameInput.placeholder = "Nazwisko..."
    surnameInput.id = "surnameInput"
    //surnameInput.setAttribute("name", "humanSurname")
    addedForm.appendChild(surnameInput)

    addedForm.innerHTML += "<br><br>"
    addedForm.innerHTML += `Mężczyzna <input type="radio" id="M" name="gender_of_human" value="M">\t\t\t\t\t`
    addedForm.innerHTML += `Kobieta <input type="radio" id="F" name="gender_of_human" value="M">`
    addedForm.innerHTML += "<br><br>Mieszka w...<br>"
    let cityInput = document.createElement("input")
    cityInput.setAttribute("type", "text")
    cityInput.id = "cityInput"
    cityInput.placeholder = "Podaj nazwę miasta..."
    //cityInput.setAttribute("name", "cityInput")
    addedForm.appendChild(cityInput)

    addedForm.innerHTML += "<br><br>Podaj nazwę kliki...<br>"
    let cliqueInput = document.createElement("input")
    cliqueInput.setAttribute("type", "text")
    cliqueInput.setAttribute("id", "cliqueInput")
    cliqueInput.placeholder = "Podaj nazwę kliki..."
    addedForm.appendChild(cliqueInput)

    addedForm.innerHTML += "<br><br>Podaj link do FB...<br>"
    let fbLinkInput = document.createElement("input")
    fbLinkInput.type = "text"
    fbLinkInput.id = "fbLinkInput"
    fbLinkInput.placeholder = "Podaj nazwę kliki..."
    addedForm.appendChild(fbLinkInput)
    addedForm.innerHTML += "<br><br>"

    let submitButton = document.createElement("input")
    submitButton.type = "submit"
    submitButton.id = "submitHumanButton"
    submitButton.setAttribute("onclick", "sendHuman()")
    submitButton.value = "Dodaj osobę!"
    addedForm.appendChild(submitButton)
}

function sendHuman() {
    console.log("Kidyś będzie działąć...")
}