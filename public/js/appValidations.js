;(function() {

    function checkEmailForSave(val, callback) {
        var messageArr = [];
        if (validator.isEmpty(val)) messageArr.push('Email не может быть пустым!');
        if (!validator.isEmail(val)) messageArr.push('Неверный email адрес!');
        isPresentEmail(val, function (res) {
            if (res) messageArr.push('Такой email уже зарегистрирован!');
            if (callback) callback(messageArr);
        });
    }

    function checkNewEmailForSave(val, callback) {
        var messageArr = [];
        if (validator.isEmpty(val)) messageArr.push('Email не может быть пустым!');
        if (!validator.isEmail(val)) messageArr.push('Неверный email адрес!');
        isCorrectChangeEmail(val, function (res) {
            if (!res) messageArr.push('Такой email уже зарегистрирован!');
            if (callback) callback(messageArr);
        });
    }

    function checkPasswordForSave(val, callback) {
        var messageArr = [];
        if (validator.isEmpty(val)) messageArr.push('Пароль не может быть пустым!');
        if (!validator.isLength(val, {min:8})) messageArr.push('Пароль должен иметь не менее 8 символов!');
        // проверить Regexp. Не пропускает _
        // var passwdRegexp = /^(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d\W]{8,}$/;
        // var msg = 'Пароль должен иметь хотя бы одну маленькую, одну большую букву, цифру и специальный символ!';
        // if (!validator.matches(val, passwdRegexp)) messageArr.push(msg);
        if (callback) callback(messageArr);
        return (messageArr.length == 0) ? true : false;
    }

    function checkConfirmPasswordForSave(val, confirmVal, callback) {
        var messageArr = [];
        if (!validator.equals(val, confirmVal)) messageArr.push('Пароль должен совпадать с подтверждением!');
        if (callback) callback(messageArr);
        return (messageArr.length == 0) ? true : false;
    }

    function checkFNameForSave(val, callback) {
        var messageArr = [];
        if (!validator.isLength(val, {min:2})) messageArr.push('FName должен иметь не менее 2 символов!');
        if (callback) callback(messageArr);
        return (messageArr.length == 0) ? true : false;
    }

    function checkLNameForSave(val, callback) {
        var messageArr = [];
        if (!validator.isLength(val, {min:2})) messageArr.push('LName должен иметь не менее 2 символов!');
        if (callback) callback(messageArr);
        return (messageArr.length == 0) ? true : false;
    }

    function checkEmailForLogin(val, callback) {
        var messageArr = [];
        isPresentEmail(val, function (res) {
            if (!res) messageArr.push('Такой email не найден!');
            if (callback) callback(messageArr);
        });
    }

//Так как пароль можно и подобрать через такую функцию, отменим эту проверку
    // function checkPasswordForLogin(val, emailVal, callback) {
    //     var messageArr = [];
    //     isCorrectPassword(val, emailVal, function (res) {
    //         if (!res) messageArr.push('Не соответствие пароля и email!');
    //         if (callback) callback(messageArr);
    //     });
    // }

    function isCorrectSignupData() {
        var form = $("#formSignup"),
            email = $('#formSignup [name="email"]').val(),
            password = $('#formSignup [name="password"]').val(),
            confirmPassword = $('#formSignup [name="confirmPassword"]').val();
        checkEmailForSave(email, function (messageArr) {
            if (messageArr.length == 0 && checkPasswordForSave(password) && checkConfirmPasswordForSave(confirmPassword, password)) {
                form.off('submit');
                form.on('submit', function () {
                    bj.validations.isCorrectSignupData();
                })
            } else {
                form.off('submit');
                form.on('submit', function(event) {
                    event.preventDefault();
                    bj.validations.isCorrectSignupData();
                });
            }
        })
    }

    function isCorrectLoginData() {
        var form = $("#formLogin"),
            email = $('#formLogin [name="email"]').val(),
            password = $('#formLogin [name="password"]').val();
        checkEmailForLogin(email, function (messageArr) {
            if (messageArr.length == 0) {
                // checkPasswordForLogin(password, email, function (messageArr) {
                //     if (messageArr.length == 0) {
                        form.off('submit');
                        form.on('submit', function() {
                            bj.validations.isCorrectLoginData();
                        });
                //     } else {
                //         form.off('submit');
                //         form.on('submit', function(event) {
                //             event.preventDefault();
                //             bj.validations.isCorrectLoginData();
                //         });
                //     }
                // })
            } else {
                form.off('submit');
                form.on('submit', function(event) {
                    event.preventDefault();
                    bj.validations.isCorrectLoginData();
                });
            }
        })
    }

    function isCorrectProfileData(callback) {
        var form = $("#formProfile"),
            email = $('#formProfile [name="email"]').val(),
            password = $('#formProfile [name="password"]').val(),
            confirmPassword = $('#formProfile [name="confirmPassword"]').val(),
            fName = $('#formProfile [name="fName"]').val(),
            lName = $('#formProfile [name="lName"]').val();

        var checkPassword,
            checkNames,
            checkFName,
            checkLName;
        if (password != '') {
            checkPassword = checkPasswordForSave(password) && checkConfirmPasswordForSave(confirmPassword, password);
        } else { checkPassword = true }

        checkFName = (fName == '') ? true : checkFNameForSave(fName);
        checkLName = (lName == '') ? true : checkLNameForSave(lName);
        checkNames =  checkFName && checkLName;

        checkNewEmailForSave(email, function (messageArr) {
            if (messageArr.length == 0 && checkPassword && checkNames) {
                console.log('forma ok');
                if (callback) callback();
                form.off('submit');
                form.on('submit', function () {
                    bj.validations.isCorrectProfileData();
                })
            } else {
                console.log('forma invalid');
                form.off('submit');
                form.on('submit', function(event) {
                    event.preventDefault();
                    bj.validations.isCorrectProfileData();
                });
            }
        })
    }

    function isPresentEmail(val, callback) {
        $.post(('/findEmail?email=' + val), function (data) {
                callback(data)
            }
        )
    }

    function isCorrectChangeEmail(val, callback) {
        $.post(('/checkEmail?email=' + val), function (data) {
                callback(data)
            }
        )
    }


//Так как пароль можно и подобрать через такую функцию, отменим эту проверку
    // function isCorrectPassword(val, emailVal, callback) {
    //     $.post(('/checkPassword?email=' + emailVal + '&pass=' + val), function (data) {
    //         callback(data)
    //     })
    // }

    var export_my = {
        "checkEmailForSave" : checkEmailForSave,
        "checkNewEmailForSave" : checkNewEmailForSave,
        "checkPasswordForSave" : checkPasswordForSave,
        "checkConfirmPasswordForSave" : checkConfirmPasswordForSave,
        "checkFNameForSave" : checkFNameForSave,
        "checkLNameForSave" : checkLNameForSave,
        "checkEmailForLogin" : checkEmailForLogin,
     //   "checkPasswordForLogin" : checkPasswordForLogin,
        "isCorrectLoginData" : isCorrectLoginData,
        "isCorrectSignupData" : isCorrectSignupData,
        "isCorrectProfileData" : isCorrectProfileData
    };

    window.bj.validations = export_my;
})();