/*
* Questa funzione è necessario richiamarla solo dopo aver creato i div all'interno
* del box, sennò l'animazione non sarà visibile
*/
function renderAnimation() {
    $(".checkbutton").click(function () {
        if ($(this).attr("data-active") == '0') {
            $(this.children[0]).removeClass("mostra");
            $(this.children[0]).addClass("nascondi");

            $(this.children[1]).removeClass("nascondi");
            $(this.children[1]).addClass("mostra");
            $(this.children[1]).addClass("square-click");
            $(this.children[1].lastElementChild).addClass("spunta-click");
            console.log($(this));
            console.log($(this).data("active"));
            updateCounter(1);
            checkNewButton();
            $(this).attr("data-active", 1);;
        } else {
            $(this.children[1].lastElementChild).removeClass("spunta-click");
            $(this.children[1]).removeClass("square-click");

            $(this.children[1]).removeClass("mostra");
            $(this.children[1]).addClass("nascondi");

            $(this.children[0]).removeClass("nascondi");
            $(this.children[0]).addClass("mostra");

            $(this).removeClass("remove-item");
            $(this.children[2]).addClass("nascondi");
            $(this.children[2]).removeClass("mostra");
            updateCounter(-1);
            checkNewButton();
            $(this).attr("data-active", 0);
        }
    });

    $(".checkbutton").hover(
        function () {
            if ($(this).attr("data-active") == 1) {
                $(this).addClass("remove-item");

                $(this.children[1]).addClass("nascondi");
                $(this.children[1]).removeClass("mostra");

                $(this.children[2]).addClass("mostra");
                $(this.children[2]).removeClass("nascondi");

            }
        }, function () {
            if ($(this).attr("data-active") == 1) {

                $(this).removeClass("remove-item");

                $(this.children[1]).addClass("mostra");
                $(this.children[1]).removeClass("nascondi");

                $(this.children[2]).addClass("nascondi");
                $(this.children[2]).removeClass("mostra");
            }
        });
}

let counterAdd = 0; //conta gli utenti aggiunti al gruppo

//Aggiorna il valore della variabile counterAdd
function updateCounter(val) {
    counterAdd += val;
}


//Restituisce tutte le chat private per la creazione degli item nel box
function getMyContacts() {
    $.post('../php/get_private_chats.php', { myID: myID }, function (response) {
        chats = JSON.parse(response);
        chats.forEach(chat => {
            displayItemGroup(chat["Id"], "../img/data/propics/LowRes/default.png", chat["Name"] + " " + chat["Surname"], chat["Username"], 0);
        });
        renderAnimation();
    });
}

//Inserisce nel box i div degli utenti
function displayItemGroup(id, foto, nome, username) {
    $("#peopleList").append(`<div data-id="` + id + `" class="item-new-group">
                                <div class="name-item">
                                    <img src="`+ foto + `"/>
                                    <span>`+ nome + `</span>
                                </div> 

                                <div class="check-item">
                                    <div class="nickname-item">@`+ username + `</div>
                                    <div class="checkbutton" data-active="0">
                                        <svg viewBox="-100,-90,450,450" width="33px" height="33px" fill-rule="evenodd" class="plus-item mostra"><g fill="#fafafa" fill-rule="evenodd" stroke="none" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M11,2v9h-9v2h9v9h2v-9h9v-2h-9v-9z"></path></g></g></svg> 
                                        
                                        <svg class="checkmark nascondi" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                        </svg>

                                        <svg class="nascondi" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 64 64" width="28" height="28"><line x1="14" x2="51" y1="32" y2="32" fill="none" stroke="#ffffff" stroke-miterlimit="10" stroke-width="3" class="colorStroke010101 svgStroke"></line></svg> 
                                    </div>
                                </div>
                            </div>`);
}

/*Restituisce true se i requisiti per la creaizione di un nuovo sono soddisfatti
* Inoltre gestisce il colore del bottone "Crea nuovo gruppo"
*/
function checkNewButton() {
    if ($("#inputNameGroup").val() != "" && counterAdd > 1) {
        $("#createNewGruop").css("background-color", "#0B192F");
        return true
    } else {
        $("#createNewGruop").css("background-color", "#2f3f5a");
        return false
    }
}


/* 
* Funzione che registra il nuovo gruppo sul DB
*/
function startGroup() {
    if (checkNewButton()) {
        let activeIds = [];

        document.querySelectorAll('.item-new-group').forEach(function (item) {
            let activeItem = item.querySelector('.checkbutton[data-active="1"]');
            if (activeItem) {
                activeIds.push(activeItem.parentNode.parentNode.getAttribute('data-id'));
            }
        });

        nameGroup = $("#inputNameGroup").val();

        startChat(nameGroup, activeIds);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'È necessario attribuire un nome al nuovo gruppo e selezionare almeno 2 partecianti',
        })
    }


}