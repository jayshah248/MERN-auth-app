function ValidateEmail() {
    const pass = document.querySelector("#pass");
    const c_pass = document.querySelector("#cpass");
    const input = document.querySelector('.email').value
    console.log(pass.value,c_pass.value,input)
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    if (!input.match(validRegex)) {
  
        alert("Invalid email address!");
  
      document.form1.text1.focus();
  
      return true;
  
    } 
    if (pass.value!=c_pass.value){
        alert("Invalid password!");
        return false;

    }
    document.querySelector('form').submit()
    }
const button = document.querySelector('.btn')
button.addEventListener('click', () => {
    ValidateEmail()
})
//     let validatedFlag = false
   
//     screen('change', (e) => {
//         if (pass!=c_pass) {
//             alert('Enter Valid Password')
//              e.preventDefault( )
//         } 
//     })
  
//   }