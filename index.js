class Form {
    constructor(formWrapper) {
        this.form = formWrapper;
        this.fields = this.form.getElementsByTagName('input');
        this.submitButton = document.getElementById('submitButton');
        this.resultContainer = document.getElementById('resultContainer');

        this.submitButton.addEventListener('click', event => {
            event.preventDefault();
            this.submit();
        })
    }

    validate() {
        const validateEmail = email => /^[a-zA-Z0-9.-]+@yandex.(ru|com|ua|kz|by)$/.test(email);
        const validatePhone = phone => /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone) && phone.match(/\d/g).reduce((p, c) => p + parseInt(c, 10), 0) <= 30;
        const validateFio = fio => /^([A-zА-яЁё]+\s[A-zА-яЁё]+){2}$/g.test(fio);
        const errorFields = [];

        if (!validateFio(this.fields.fio.value)) {
            errorFields.push('fio');
        }

        if (!validateEmail(this.fields.email.value)) {
            errorFields.push('email');
        }

        if (!validatePhone(this.fields.phone.value)) {
            errorFields.push('phone');
        }

        return {
            isValid: errorFields.length === 0,
            errorFields
        }
    }

    getData() {
        let result = {};
        for (let i = 0; i < this.fields.length; i++) {
            result[this.fields[i].name] = this.fields[i].value;
        }

        return result;
    }

    setData(fields) {
        Object.keys(fields).forEach(key => {
            if (this.fields[key]) {
                this.fields[key].value = fields[key]
            }
        });
    }

    submit() {
        // очистка стилей
        for (let i = 0; i < this.fields.length; i++) {
            this.fields[i].className = '';
        }
        this.resultContainer.className = '';
        this.resultContainer.innerHTML = '';

        // валидация
        const validationResult = this.validate();

        if (!validationResult.isValid) {
            Object.keys(validationResult.errorFields).forEach(key => {
                const field = validationResult.errorFields[key];
                if (this.fields[field]) {
                    this.fields[field].classList.add('error');
                }
            });

            return false;
        }

        this.submitButton.setAttribute('disabled', 'disabled');

        // начало запроса
        return performRequest(this.form.getAttribute('action'), this.getData()).then(response => {
            this.submitButton.removeAttribute('disabled');
            switch (response.status) {
                case 'success':
                    this.resultContainer.classList.add('success');
                    this.resultContainer.innerHTML = 'Success';
                    break;
                case 'progress':
                    this.resultContainer.classList.add('progress');
                    this.resultContainer.innerHTML = 'Retry in ' + response.timeout + 'ms';
                    setTimeout(this.submit.bind(this), response.timeout);
                    break;
                case 'error':
                    this.resultContainer.classList.add('error');
                    this.resultContainer.innerHTML = response.reason || 'Unknown error';
                    break;
                default:
                    this.resultContainer.innerHTML = 'Unknown result';
                    break;
            }
        });
    }
}

function performRequest(url, data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        const formData = new FormData();

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }

        xhr.open('POST', url, true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                return resolve(JSON.parse(xhr.responseText));
            } else {
                return reject(new Error('Request didn\'t perform successfully; error code:' + xhr.statusText));
            }
        };

        xhr.onerror = function(error) {
            return reject(error);
        };

        xhr.send(formData);
    })
}

window.MyForm = new Form(document.getElementById('MyForm'));