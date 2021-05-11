//Вспомогательная функция - формирует строковый массив ролей
//Из "selected multiple" полей ввода для последующей передачи его в JSON
function getRoles(inputId){
    let roles = new Array();
    $(`#${inputId} :selected`).each(function(){
        roles.push({id: $(this).val(), role: $(this).attr("name"), authority: $(this).attr("name")})
    });
    return roles;
}

//Вспомогательная функция - формирует строку с перечислением ролей пользователя
//Для корректного отображения этой информации в представлении


//Редактирование данных пользователя
function editUser() {
    let userForUpdate = {
        id: document.getElementById("editUser_Id").value,
        name: document.getElementById("editUser_Name").value,
        age: document.getElementById("editUser_Age").value,
        password: document.getElementById("editUser_Password").value,
        roles: getRoles("editUser_Roles"),
    };
    fetch('/admin', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(userForUpdate)
    }).then(result => result.json()).then(json => createAllUsersTable(json));
};

function editModal(id) {
    let href = '/admin/' + id;
    fetch(href).then(
        result => {
            result.json().then(
                userForEdit => {
                    $('.myForm #editUser_Id').val(userForEdit.id);
                    $('.myForm #editUser_Name').val(userForEdit.name);
                    $('.myForm #editUser_Age').val(userForEdit.age);
                    $('.myForm #editUser_Roles').val(userForEdit.roles);
                }
            )
        }
    )
    jQuery('#editModal').modal();
}

//Удаление пользователя из БД
function deleteUser() {
    let userForDelete = {
        id: document.getElementById("deleteUser_Id").value,
    };
    fetch('/admin', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(userForDelete)
    }).then(result => result.json()).then(json => createAllUsersTable(json));
}

function deleteModal(id) {
    let link = '/admin/' + id;
    fetch(link).then(
        result => {
            result.json().then(
                userForDelete => {
                    $('.myDeleteForm #deleteUser_Id').val(userForDelete.id);
                    $('.myDeleteForm #deleteUser_Name').val(userForDelete.name);
                    $('.myDeleteForm #deleteUser_Age').val(userForDelete.age);
                    $('.myDeleteForm #deleteUser_Roles').val(userForDelete.roles);
                }
            )
        }
    )
    jQuery('#deleteModal').modal();
}

function rolesToString(roles){
    let userRoles = "";
    for (let value of roles) {
        userRoles += " " + value.name;
    }
    return userRoles;
}
//Формирование таблицы данных о всех пользователей в БД
function createAllUsersTable(users) {
    let tableRow = "";
    users.forEach((user) => {
        tableRow += "<tr>"
            + "<td>" + user.id + "</td>"
            + "<td>" + user.name + "</td>"
            + "<td>" + user.age + "</td>"
            + "<td>" + rolesToString(user.roles) + "</td>"
            + "<td><a onclick=\"editModal("+user.id+");\" " +
            "class=\"btn btn-info\">Edit</a></td>"
            + "<td><a onclick=\"deleteModal("+user.id+");\" " +
            "class=\"btn btn-danger\">Delete</a></td>"
            + "</tr>";
    })

    document.getElementById("data").innerHTML = tableRow;
}

//Событие ready. Функция будет выполнена, когда DOM будет готов
$(document).ready(function ($) {

    fetch('/admin').then(result => {result.json().then(data => {createAllUsersTable(data);})});

    jQuery.getJSON('/admin/principal', function(data){
        document.getElementById("currentUsername").innerHTML = data.username;
        document.getElementById("currentRole").innerHTML = rolesToString(data.roles);
    });

    jQuery.getJSON('/admin/principal', function(user){

        document.getElementById("user_Id").innerHTML = user.id;
        document.getElementById("user_Name").innerHTML = user.name;
        document.getElementById("user_Age").innerHTML = user.age;
        document.getElementById("user_Roles").innerHTML = rolesToString(user.roles);
    });

    // Добавление нового пользователя в БД
    jQuery('.currentUserPage #createNewUserButton').on('click', function (event) {

        event.preventDefault();

        let newUser = {
            name: document.getElementById("newName").value,
            age: document.getElementById("newAge").value,
            password: document.getElementById("newPassword").value,
            roles: getRoles("newRoles"),
        };

        fetch('/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newUser)
        }).then(result => result.json()).then(json => createAllUsersTable(json));

        $('#all_users').attr('class', 'tab-pane fade show active border');
        $('#tabAllUsers').attr('class', 'nav-link active');
        $('#tabNewUser').attr('class', 'nav-link');
        $('#create_new_user').attr('class', 'tab-pane fade border');
    })
});