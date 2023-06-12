const form = document.querySelector('#form')
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirm_password = document.querySelector('#confirm_password');


form.addEventListener('submit',(e)=>{
    
    if(!validateInputs()){
        e.preventDefault();

    }

})

function validateInputs(){
    const usernameVal = username.value.trim()
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();
    const confirm_passwordVal = confirm_password.value.trim();

    let success = true

    if(usernameVal===''){
        setError(username,'Username is required')
        success = false;
    }
    else{
        setSucces(username)
    }

    if(emailVal===''){
        setError(email,'Email is required')
        success = false;
    }
    else if(!ValidateEmail(emailVal)){
        setError(email,'Please enter the valid email')
        success = false;
    }
    else{
        setSucces(email)
    }

    if(passwordVal === ''){
        setError(password,'Password is required')
        success = false;
    }
    else if(passwordVal.length<8){
        setError(password,'Password must be atleast 8 characters')
        success = false;
    }
    else{
        setSucces(password)
    }

    if(confirm_passwordVal ===''){
        setError(confirm_password,'Confirm Password is required')
        success = false;
    }
    else if(confirm_passwordVal !== passwordVal){
        setError(confirm_password,'Password does not match')
        success = false;
    }
    else{
        setSucces(confirm_password)
    }

    return success;
}

function setError(element,message){
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error')

    errorElement.innerText = message;
    inputGroup.classList.add('error')
    inputGroup.classList.remove('success')
}


function setSucces(element){
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error')

    errorElement.innerText = '';
    inputGroup.classList.add('success')
    inputGroup.classList.remove('error')
}

const ValidateEmail = (email) => {
    return String(email)
    .toLowerCase()
    .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};