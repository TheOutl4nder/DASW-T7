'use strict';


var XHR = new XMLHttpRequest();
var LoadUser =new XMLHttpRequest();
var loginRequest = new XMLHttpRequest();

XHR.open('GET','https://users-dasw.herokuapp.com/api/tokenDASW',true);
XHR.setRequestHeader('x-expediente','713903');
XHR.addEventListener("readystatechange",loadToken,false);
XHR.send();

function loadToken(){
    if (XHR.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
        if (XHR.status === 200) {
            // Perfect!
            let response=JSON.parse(XHR.responseText);
            localStorage.setItem("token",response.token);
        } else {
            alert('Error al cargar los datos!');
        }
    } 
}

let newUser = {nombre:"", apellido:"", correo:"", url:"", sexo:"", fecha:"", password:""};

let loginUser={correo:"",password:""};

let regForm=document.getElementById("regform");
regForm.reset();
regForm.addEventListener("change",checkRegisterForm);

let submitUser=document.getElementById("registerBtn");
submitUser.addEventListener("click",submit);
submitUser.disabled="true";

let loginBtn=document.getElementById("loginBtn");
loginBtn.addEventListener("click",login);

function login(){
    loginUser.correo=document.getElementById("loginCorreo").value;
    loginUser.password=document.getElementById("loginPassword").value;
    loginRequest.open('POST','https://users-dasw.herokuapp.com/api/login');
    loginRequest.setRequestHeader('x-auth',localStorage.getItem("token"));
    loginRequest.setRequestHeader('content-type','application/json');
    loginRequest.addEventListener("readystatechange",checkLogin,false);
    let array=new Array();
    array.push(loginUser);
    console.log(JSON.stringify(array[0]));
    loginRequest.send(JSON.stringify(array[0]));
}

function checkLogin(event){
    if (loginRequest.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
        if (loginRequest.status === 200) {
            // Perfect!
            let response=JSON.parse(loginRequest.responseText);
            localStorage.setItem("token_user",response.token);
            window.location.href="consulta.html";
        } else {
            alert('Error al iniciar sesión!'+'\n'+loginRequest.responseText);
        }
    } 
}

function checkRegisterForm(event){
    submitUser.disabled="true";
    if(regForm.querySelectorAll(":invalid").length>0){
        let array=regForm.querySelectorAll(":invalid");
        for(let i=0;i<array.length;i++){
            array[i].getElementsByClassName.border="2 px solid red";
        }
    }
    if(document.getElementById("pass").value===document.getElementById("confirm").value && document.getElementById("pass").value!="")
        submitUser.disabled="";   
}

function submit(event){
    event.preventDefault();
    newUser.nombre=regForm.querySelectorAll(":valid")[0].value;
    newUser.apellido=regForm.querySelectorAll(":valid")[1].value;
    newUser.correo=regForm.querySelectorAll(":valid")[2].value;
    newUser.password=regForm.querySelectorAll(":valid")[3].value;
    newUser.fecha=regForm.querySelectorAll(":valid")[5].value;
    if(regForm.querySelectorAll(":valid")[6].checked)
        newUser.sexo=regForm.querySelectorAll(":valid")[6].value;
    else
        newUser.sexo=regForm.querySelectorAll(":valid")[7].value;
    newUser.url=regForm.querySelectorAll(":valid")[8].value;
    let array =new Array();
    array.push(newUser);
    LoadUser.open('POST','https://users-dasw.herokuapp.com/api/users');
    LoadUser.setRequestHeader('x-auth',localStorage.getItem("token"));
    LoadUser.setRequestHeader('content-type','application/json');
    LoadUser.addEventListener("readystatechange",load);
    let payload=JSON.stringify(array[0]);
    LoadUser.send(payload);
}

function load(){
    if (LoadUser.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
        if (LoadUser.status === 201) {
            // Perfect!
            alert('Usuario creado exitosamente!');
            regForm.reset();
        } else {
            alert(LoadUser.statusText+'\n'+LoadUser.responseText);
        }
    } 
}


