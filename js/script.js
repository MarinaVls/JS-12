class User {
    constructor({id, name, email, address, phone}) {
        this.date = {id, name, email, address, phone};
    };

    editUser({id, name, email, address, phone}) {
        this.date = {id, name, email, address, phone};
    }

    get () {
        return this.date
    }
}

class Contacts {
    constructor () {
        this.contactsData = [];
    }

    add({name, email, address, phone}) {
        const user = new User({
            id: Date.now() + 'unique', 
            name, 
            email,
            address,
            phone,
        }) 
    
        this.contactsData.push(user)
    };

    find(idContact) {
        return this.contactsData.find(({date: {id}}) => id == idContact);
        //const foundUser = this.contactsData.find((contact) => contact.date.id == idContact)
    }

    edit(idContact, newContactDate) {
        let foundEditUser = this.find(idContact);
        foundEditUser.editUser(newContactDate);
    }

    remove(idContact) {
        this.contactsData = this.contactsData.filter(({date: {id}}) => id != idContact)
        this.storage = this.contactsData;
        this.setCookie();
        
        //this.contactsData = this.contactsData.filter((contact) => contact.date.id != idContact)
    }

    get() {
        return this.contactsData;
    }

}

class ContactsApp extends Contacts {
    constructor() {
        super();
        this.inputName; // задали все переменные , потом все переопределим, конструктор просто создает переменные, и они живут в контексте нашего класас
        this.inputPhone;
        this.inputEmail;
        this.inputAddress;
        this.addButton;
        this.editSaveButton;
        this.app;

        this.createHTML();
        this.addEvent(); //метод который булет создоваться и навешивать события
        this.deleteLocalStorage()
    }

    createHTML(){
        const contactOption = document.createElement('div');
        contactOption.classList.add('contacts__options');

        this.app = document.createElement('div');
        this.inputName = document.createElement('input');
        this.inputPhone = document.createElement('input');
        this.inputEmail = document.createElement('input');
        this.inputAddress = document.createElement('input');
        this.addButton = document.createElement('button');
        this.editSaveButton = document.createElement('button');


        this.inputName.classList.add('contact__name');
        this.inputName.setAttribute('placeholder', 'Введите имя')
        
        this.inputPhone.classList.add('contact__phone');
        this.inputPhone.setAttribute('placeholder', 'Введите номер телефона')

        this.inputEmail.classList.add('contact__email');
        this.inputEmail.setAttribute('placeholder', 'Введите E-mail')

        this.inputAddress.classList.add('contact__address');
        this.inputAddress.setAttribute('placeholder', 'Введите адрес')

        this.addButton.classList.add('contact__button-add');
        this.editSaveButton.classList.add('contact__button-edit')

        this.addButton.innerHTML = 'Добавить контакт';
        this.editSaveButton.innerHTML = 'Сохранить контакт';

        this.editSaveButton.style.display = 'none';

        contactOption.appendChild(this.inputName);
        contactOption.appendChild(this.inputPhone);
        contactOption.appendChild(this.inputEmail);
        contactOption.appendChild(this.inputAddress);
        contactOption.appendChild(this.addButton);
        contactOption.appendChild(this.editSaveButton);
       
        this.app.classList.add('contacts');
        document.body.appendChild(this.app);

        this.app.appendChild(contactOption);
    }

    addEvent() {
        this.addButton.addEventListener('click', () => {

            this.onAdd({
                name: this.inputName.value,
                email: this.inputEmail.value,
                phone: this.inputPhone.value,
                address: this.inputAddress.value,
            })

            this.inputName.value = '';
            this.inputEmail.value = '';
            this.inputPhone.value = '';
            this.inputAddress.value = '';
        })
    }

    onAdd(addObj) {
        if (this.inputName.value.length == 0 || this.inputName == '' 
        || this.inputEmail.value.length == 0 || this.inputEmail == '' 
        || this.inputPhone.value.length == 0 || this.inputPhone == '' 
        || this.inputAddress.value.length == 0 || this.inputAddress == '') {
           alert('Ввели не верную информацию! Заполните все строки!') 
        }else{
            this.add(addObj);
            this.onShow();
        }

        this.storage = this.contactsData;
        this.setCookie();
    }
    
    onShow() {
        const data = this.get();

        let ul = document.querySelector('.contacts-items');
        if(!ul) {
            ul = document.createElement('ul');
            ul.classList.add('contacts-items');
        }

        let list = '';
        
        if (!data) return; //если нет дата то стоп, а если дата есть , то

        data.forEach(({date:{name, address, phone, id, email}}) => {
            list += `<li class="contact__item">
                        <p><span class="span-weight">Имя:</span> ${name}</p>
                        <p><span class="span-weight">Номер телефона:</span> ${phone}</p>
                        <p><span class="span-weight">E-mail:</span>${email}</p>
                        <p><span class="span-weight">Адрес:</span> ${address}</p>
                        <button class="contact__item__delete" id="${id}">Удалить</button>
                        <button class="contact__item__edit" id="${id}">Редактировать</button>
                    </li>
                    <hr/>`
        })

        ul.innerHTML = list;
        this.app.appendChild(ul);
        this.onAddEventRemoveEdit();
    }

    onAddEventRemoveEdit() {
        const deleteBtn = document.querySelectorAll('.contact__item__delete');

        deleteBtn.forEach((delBtn) => {
            delBtn.addEventListener('click', (event) => {
                this.onDelete(event.target.id)
            })
        });

        const editBtn = document.querySelectorAll('.contact__item__edit');

        editBtn.forEach((edBtn) => {
            edBtn.addEventListener('click', (event) =>{
                this.onEdit(event.target.id);
            })
        });

    }

    onDelete(id) {
        this.remove(id)
        this.onShow();
    }

    onEdit(id) {
       let user = this.find(id);

        this.inputName.value = user.date.name;
        this.inputEmail.value= user.date.email;
        this.inputPhone.value= user.date.phone;
        this.inputAddress.value= user.date.address;

        this.addButton.style.display  = 'none';

        let contOption = document.querySelector('.contacts__options');
        contOption.removeChild(this.editSaveButton);
        
        this.editSaveButton = document.createElement('button');
        this.editSaveButton.classList.add('contact__button-edit')
        this.editSaveButton.innerHTML = 'Сохранить контакт';
        this.editSaveButton.style.display = 'block';
        contOption.appendChild(this.editSaveButton);

        const editSaveBtn2 = document.querySelector('.contact__button-edit');

        editSaveBtn2.addEventListener('click' , () => {
            this.onSaveEditContact(id); 
        })
        
    }

    onSaveEditContact(idEdit) {
        let userEdit = {
            id: idEdit,
            name: this.inputName.value,
            email: this.inputEmail.value,
            phone: this.inputPhone.value,
            address: this.inputAddress.value,
        };
        
        this.edit(idEdit, userEdit);

        this.storage = this.contactsData;
        this.setCookie();
        
        this.inputName.value = "";
        this.inputEmail.value= "";
        this.inputPhone.value= "";
        this.inputAddress.value= "";

        this.onShow();
        this.addButton.style.display  = 'block';

        let editSaveBtn = document.querySelector('.contact__button-edit');
        editSaveBtn.style.display = 'none';
    }

    set storage(value) {
        localStorage.setItem('contactsData', JSON.stringify(value));
    
    }

    get storage() {
        return localStorage.getItem('contactsData');
    }  
    
    setCookie() {
        document.cookie = "storageExpiration=; max-age=864000";
    }

    deleteLocalStorage() {
        if(document.cookie == "") {
            localStorage.clear();
        }
    }

    get() {
        return super.get()  //this.contactsDate
    }

}

window.addEventListener('load', () => {
    const contacts = new ContactsApp();
    
    if (contacts.storage != null) {        
        const newContactsData = JSON.parse(contacts.storage);

        newContactsData.forEach( item => {
            contacts.add(item.date);
        })
        contacts.onShow();
    }
});