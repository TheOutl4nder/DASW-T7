var usersRequest = new XMLHttpRequest();
var detailRequest = new XMLHttpRequest();
var editRequest = new XMLHttpRequest();
var LoadUser =new XMLHttpRequest();
var deleteRequest = new XMLHttpRequest();

var tempMail;

let list=document.getElementById("lista");
let regForm=document.getElementById("regform");
regForm.reset();
regForm.addEventListener("change",checkRegisterForm);
let submitUser=document.getElementById("registerBtn");
submitUser.addEventListener("click",submit);
submitUser.disabled="true";

if(localStorage.getItem("token")===null){
    var XHR = new XMLHttpRequest();
    XHR.open('GET', 'https://users-dasw.herokuapp.com/api/tokenDASW', true);
    XHR.setRequestHeader('x-expediente', '713903');
    XHR.addEventListener("readystatechange", loadToken, false);
    XHR.send();

    function loadToken() {
        if (XHR.readyState === XMLHttpRequest.DONE) {
            // Everything is good, the response was received.
            if (XHR.status === 200) {
                // Perfect!
                let response = JSON.parse(XHR.responseText);
                localStorage.setItem("token", response.token);
            } else {
                alert('Error al cargar los datos!');
            }
        }
    }
}

usersRequest.open('GET','https://users-dasw.herokuapp.com/api/users');
usersRequest.setRequestHeader('x-auth',localStorage.getItem("token"));
usersRequest.setRequestHeader('x-user-token',localStorage.getItem("token_user"));
usersRequest.addEventListener("readystatechange",displayUsers);
usersRequest.send();

function displayUsers(){
    if (usersRequest.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
        if (usersRequest.status === 200) {
            // Perfect!
            let response=JSON.parse(usersRequest.responseText);
            for(let i=0;i<response.length;i++){
                list.insertAdjacentHTML('afterbegin',`
                <div class="media col-8 mt-2" id="modelo">
                        <div class="media-left align-self-center mr-3">
                            <img class="rounded-circle" style="width: inherit;" src="${response[i].url}">
                        </div>
                        <div class="media-body">
                            <h4>${response[i].nombre} ${response[i].apellido}</h4>
                            <p >Correo: ${response[i].correo}</p>
                        </div>
                        <div class="media-right align-self-center">
                            <div class="row">
                                <a href="#" class="btn btn-primary edit" onclick=verDetalle("${response[i].correo}")><i class="fas fa-search edit  "></i></a>
                            </div>
                            <div class="row">
                                <a href="#" class="btn btn-primary mt-2" data-toggle="modal" data-target="#registro" onclick=loadEdit("${response[i].correo}")><i class="fas fa-pencil-alt edit  "></i></a>
                            </div>
                            <div class="row">
                                <a href="#" class="btn btn-primary mt-2"><i class="fas fa-trash-alt  remove " data-toggle="modal" data-target="#Borrar" onclick=deleteUser("${response[i].correo}")></i></i></a>
                            </div>
                        </div>
                    </div>
                
                `);
            }
        } else {
            alert('Error al obtener la lista de usuarios!'+'\n'+usersRequest.responseText);
        }
    } 
}

function deleteUser(email,password){
    document.getElementById("UserDelInfo").innerHTML=(`
    <div class="col-8 mt-2" id="modelo">
        <p>Correo: ${email}</p>
    </div>
    `);
    tempMail=email;
    document.getElementById("deletus").addEventListener("click",eliminateUser);
}

function eliminateUser(){
    deleteRequest.open('DELETE','https://users-dasw.herokuapp.com/api/users/'+tempMail);
    deleteRequest.setRequestHeader('Content-Type','application/json');
    deleteRequest.setRequestHeader('x-auth',localStorage.getItem("token"));
    deleteRequest.setRequestHeader('x-user-token',localStorage.getItem("token_user"));
    deleteRequest.addEventListener("readystatechange",checkDelete);
    deleteRequest.send();
}

function checkDelete(){
    if (deleteRequest.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
        if (deleteRequest.status === 200) {
            // Perfect!
            alert('Usuario eliminado exitosamente!');
            location.reload();
        } else {
            alert(deleteRequest.statusText+'\n'+deleteRequest.responseText);
        }
    } 
}

function verDetalle(email){
    detailRequest.open('GET','https://users-dasw.herokuapp.com/api/users/'+email);
    detailRequest.setRequestHeader('x-auth',localStorage.getItem("token"));
    detailRequest.setRequestHeader('x-user-token',localStorage.getItem("token_user"));
    detailRequest.addEventListener("readystatechange",showDetails);
    detailRequest.send();
}

function showDetails(){
    if (detailRequest.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
        if (detailRequest.status === 200) {
            // Perfect!
            let response=JSON.parse(detailRequest.responseText);
            localStorage.setItem("detail",JSON.stringify(response));
            window.location.href="detalle.html";
        } else {
            alert('Error al obtener los detalles del usuario!'+'\n'+detailRequest.responseText);
        }
    } 
}

function loadEdit(email){
    editRequest.open('GET','https://users-dasw.herokuapp.com/api/users/'+email);
    editRequest.setRequestHeader('x-auth',localStorage.getItem("token"));
    editRequest.setRequestHeader('x-user-token',localStorage.getItem("token_user"));
    editRequest.addEventListener("readystatechange",loadModal);
    editRequest.send();
}

function loadModal(){
    if (editRequest.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
        if (editRequest.status === 200) {
            // Perfect!
            let response=JSON.parse(editRequest.responseText);
            regForm.getElementsByTagName("input")[0].value=response.nombre;
            regForm.getElementsByTagName("input")[1].value=response.apellido;
            regForm.getElementsByTagName("input")[2].value=response.correo;
            regForm.getElementsByTagName("input")[3].value=response.password;
            regForm.getElementsByTagName("input")[5].value=response.fecha;
            if(response.sexo=="M")
                regForm.getElementsByTagName("input")[6].checked=true;
            else
                regForm.getElementsByTagName("input")[7].checked=true;
            regForm.getElementsByTagName("input")[8].value=response.url;

        } else {
            alert('Error al obtener los detalles del usuario!'+'\n'+editRequest.responseText);
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
    if(document.getElementById("Pass").value===document.getElementById("confirm").value && document.getElementById("Pass").value!="")
        submitUser.disabled="";   
}

function submit(event){
    event.preventDefault();
    User.nombre=regForm.getElementsByTagName("input")[0].value;
    User.apellido=regForm.getElementsByTagName("input")[1].value;
    User.correo=regForm.getElementsByTagName("input")[2].value;
    User.password=regForm.getElementsByTagName("input")[3].value;
    User.fecha=regForm.getElementsByTagName("input")[5].value;
    if(regForm.getElementsByTagName("input")[6].checked)
        User.sexo=regForm.getElementsByTagName("input")[6].value;
    else
        User.sexo=regForm.getElementsByTagName("input")[7].value;
    User.url=regForm.getElementsByTagName("input")[8].value;
    let array =new Array();
    array.push(User);
    LoadUser.open('PUT','https://users-dasw.herokuapp.com/api/users/'+User.correo);
    LoadUser.setRequestHeader('x-auth',localStorage.getItem("token"));
    LoadUser.setRequestHeader('x-user-token',localStorage.getItem("token_user"));
    LoadUser.setRequestHeader('content-type','application/json');
    LoadUser.addEventListener("readystatechange",load);
    let payload=JSON.stringify(array[0]);
    LoadUser.send(payload);
}

function load(){
    if (LoadUser.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
        if (LoadUser.status === 200) {
            // Perfect!
            alert('Usuario actualizado exitosamente!');
            regForm.reset();
            location.reload();
        } else {
            alert(LoadUser.statusText+'\n'+LoadUser.responseText);
        }
    } 
}
