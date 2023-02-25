const form = document.getElementById("form");
const userInput = document.getElementById("user");
const passinput = document.getElementById("password");


const CheckUser = () => {
	
	let valid = false;
	const minCharacter = 4; //caracter minimo del username    
	const maxcharacter = 12; //caracter maximo del username
	const username = userInput.value.trim();
	
	if (InputEmpty(username)) {
		showError(userInput, "El username es obligatorio");
	
	} else if (!isBetween(username.length, minCharacter, maxcharacter)) {
		showError(userInput,`El username es invalido`);

	} else {
        showvalid(userInput);
		valid = true;
	}
	return valid;
};

const checkPassword = () => {
    let valid = false;

    const password = passinput.value.trim(); //primera password

    if(InputEmpty(password)){
        showError(passinput,"La contraseña es obligatoria");
    } else if (!securityPassword(password)){
        showError(passinput,"La contraseña no es valida")

    } else {
        showvalid(passinput);
        valid = true;
        
    }
    return valid;

}


// ------------ UTILIDADES ------------

const InputEmpty = (value) => value === "";

const isBetween = (lenght,minCharacter,maxcharacter) => { 
    return lenght < minCharacter || lenght >> maxcharacter ? false : true;
};

const showError = (input,message) => {
    const formField = input.parentElement;

    formField.classList.remove("valid");
    formField.classList.add("error");

    const error = formField.querySelector("small")
    error.textContent = message;

};

const showvalid = (input) => {
    const formField = input.parentElement;

    formField.classList.remove("error");
    formField.classList.add("valid");

    const error = formField.querySelector("small")
    error.textContent = ""

};

const securityPassword = (pass) => {
    //expresion regular para validar la password
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
  return re.test(pass);
};



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

        case "password":
            checkPassword();
            break;

    
    }
})
);


form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isUserNameValid = CheckUser();
    let isPasswordValid = checkPassword();

    let isFormValid = isUserNameValid && isPasswordValid ;
    

    if(isFormValid){
        form.submit() 
    }

})

