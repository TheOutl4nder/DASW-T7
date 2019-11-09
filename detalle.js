let usuario=JSON.parse(localStorage.getItem("detail"));

//let newUser = {nombre:"", apellido:"", correo:"", url:"", sexo:"", fecha:"", password:""};

document.getElementById("user").insertAdjacentHTML('afterbegin', `
            <div class="media col-8 mt-2" id="modelo">
                    <div class="media-left align-self-center mr-3">
                        <img class="rounded-circle" style="width: inherit;" src="${usuario.url}">
                    </div>
                    <div class="media-body">
                        <h4>${usuario.nombre} ${usuario.apellido}</h4>
                        <p>Correo: ${usuario.correo}</p>
                        <p>Sexo: ${usuario.sexo}</p>
                        <p>Fecha: ${usuario.fecha}</p>
                        <p>Password: ${usuario.password}</p>
                    </div>
                </div>
            
            `);