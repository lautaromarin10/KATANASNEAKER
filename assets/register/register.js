const form = document.getElementById("form");
const userInput = document.getElementById("user");
const mailinput = document.getElementById("mail");
const passinput = document.getElementById("password");
const passinputVerificated = document.getElementById("password2");


const CheckUser = () => {
	
	let valid = false;
	const minCharacter = 4; //caracter minimo del username    
	const maxcharacter = 12; //caracter maximo del username
	const username = userInput.value.trim();
	
	if (InputEmpty(username)) {
		showError(userInput, "El username es obligatorio");
	
	} else if (!isBetween(username.length, minCharacter, maxcharacter)) {
		showError(userInput,`El username debe contener un minimo de ${minCharacter} caracteres y un maximo de ${maxcharacter}`);

	} else {
        showvalid(userInput);
		valid = true;
	}
	return valid;
};

const checkMail = () => {
    let valid = false;

    const emailValue = mailinput.value.trim();

    if(InputEmpty(mailinput)){
        showError(mailinput,"Es obligatorio introducir un Mail")

    } else if (!validEmail(emailValue)) {
        showError(mailinput,"El mail es invalido")
    } else {
        showvalid(mailinput)
        valid = true;
        
    }
    return valid;

}


const checkPassword = () => {
    let valid = false;

    const password = passinput.value.trim(); //primera password

    if(InputEmpty(password)){
        showError(passinput,"La contraseña es obligatoria");
    } else if (!securityPassword(password)){
        showError(passinput,"La contraseña debe tener un minimo de 8 caracteres, una mayuscula, una minuscula y un simbolo")

    } else {
        showvalid(passinput);
        valid = true;
        
    }
    return valid;

}


const matchPassword = () => {
    let valid = false; 
    const password = passinput.value.trim(); //primer password introducida
    const passwordRepeat = passinputVerificated.value.trim(); //password a verificar su igualdad


    if(InputEmpty(passwordRepeat)){
        showError(passinputVerificated,"Repita su contraseña por favor!")
    }else if(!passwordverificated(password,passwordRepeat)){ 
        showError(passinputVerificated,"la contraseña no coincide");
    } else {
        showvalid(passinputVerificated);
        valid = true;
    }
    return valid;


}




//--------------------------------- utilidades-----------------------------------


form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isUserNameValid = CheckUser();
    let isEmailValid = checkMail();
    let isPasswordValid = checkPassword();
    let isPasswordMatch = matchPassword();

    let isFormValid = isUserNameValid && isEmailValid && isPasswordValid && isPasswordMatch ;
    //el formulario es valido solamente cuando todos los argumentos dan true

    if(isFormValid){
        form.submit() // al ser valido el formulario este se envia
    }

})

const passwordverificated = (password, passwordRepeat) => {
    return password === passwordRepeat;
    // mediante el operador de extricta igualdad "===" comparamos si ambas contraseñas son iguales, si son iguales devuelve true y si no false.
}



const InputEmpty = (value) => value === ""; //verificamos si el input a verificar se encuentra vacio comparandolo con un array igualmente vacio ("")

const isBetween = (lenght,minCharacter,maxcharacter) => { 
    return lenght < minCharacter || lenght >> maxcharacter ? false : true;
}


const showError = (input,message) => {
    const formField = input.parentElement;

    formField.classList.remove("valid");
    formField.classList.add("error");

    const error = formField.querySelector("small")
    error.textContent = message;

} 

const showvalid = (input) => {
    const formField = input.parentElement;

    formField.classList.remove("error");
    formField.classList.add("valid");

    const error = formField.querySelector("small")
    error.textContent = ""

}

const validEmail = (email) => {
    //expresion regular para validar el mail
    const re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

const securityPassword = (pass) => {
      //expresion regular para validar la password
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
	return re.test(pass);
}


const debounce = (fn, delay = 500) => {
    let timeoutId;

    return (...args) => {
        if(timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn.apply(null,args);
        }, delay);
    }
}


form.addEventListener("input",
debounce( (e) => {
    switch(e.target.id){
        case "user":
            CheckUser();
            break;


        case "mail":
            checkMail();
            break;


        case "password":
            checkPassword();
            break;

        case "password2":
            matchPassword();
            break;
    }
})
);

