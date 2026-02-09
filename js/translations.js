// translations.js - Файл с переводами и функциями для работы с ними
// Базовая структура переводов для всех языков

const translationStructure = {
    // Общие элементы интерфейса
    common: {
        headerTitle: { ru: "DOBAR SERVIS d.o.o", cnr: "DOBAR SERVIS d.o.o", en: "DOBAR SERVIS d.o.o" },
        title: { ru: "Запись на ремонт", cnr: "Prijava popravke", en: "Repair Booking" },
        name: { ru: "Имя", cnr: "Ime", en: "Name" },
        phone: { ru: "Телефон", cnr: "Telefon", en: "Phone" },
        submit: { ru: "Вызвать мастера", cnr: "Pozovi majstora", en: "Call a master" },
        success: { ru: "Заявка отправлена!", cnr: "Prijava je poslata!", en: "Request sent!" },
        successTitle: { ru: "Заявка отправлена!", cnr: "Prijava je poslata!", en: "Request sent!" },
        btnOk: { ru: "Понятно", cnr: "U redu", en: "Got it" },
        description: { ru: "Описание", cnr: "Opis", en: "Description" },

    },
    
    // Форма и поля
    form: {
        city: { ru: "Выберите город", cnr: "Izaberite grad", en: "Select city" },
        type: { ru: "Тип техники", cnr: "Tip uređaja", en: "Appliance type" },
        brand: { ru: "Выберите бренд", cnr: "Izaberite marku", en: "Select brand" },
        descPlaceholder: { 
            ru: "Кратко опишите проблему. При необходимости добавьте фото или видео", 
            cnr: "Ukratko opišite problem. Po potrebi dodajte fotografiju ili video", 
            en: "Briefly describe the problem. If necessary, add a photo or video" 
        },
        descTitle: {
            ru: "Описание проблемы, Код ошибки (если есть)",
            cnr: "Opis problema, kod greške (ako postoji)",
            en: "Description, error code (if any)"
        },
        photoBtn: { 
            ru: "Добавить фото или видео проблемы (до 3)", 
            cnr: "Dodajte fotografiju ili video problema (do 3)", 
            en: "Add a photo or video of the problem (up to 3)" 
        },
        noFile: { ru: "Файл не выбран", cnr: "Datoteka nije izabrana", en: "No file chosen" }
    },
    
    // Валидация полей (добавлено)
    validation: {
        fillField: { ru: "Заполните это поле", cnr: "Popunite ovo polje", en: "Please fill in this field" },
        invalidPhone: { ru: "Неверный формат номера", cnr: "Neispravan format broja", en: "Invalid phone number format" },
        requiredField: { ru: "Обязательное поле", cnr: "Obavezno polje", en: "Required field" },
        selectCategory: { ru: "Выберите категорию", cnr: "Izaberite kategoriju", en: "Select category" },
        selectBrand: { ru: "Выберите или введите бренд", cnr: "Izaberite ili unesite marku", en: "Select or enter brand" },
        enterName: { ru: "Введите имя", cnr: "Unesite ime", en: "Enter name" },
        enterPhone: { ru: "Введите номер телефона", cnr: "Unesite broj telefona", en: "Enter phone number" },
        selectCity: { ru: "Выберите город", cnr: "Izaberite grad", en: "Select city" },
        specifyAddress: { ru: "Укажите адрес или местоположение", cnr: "Navedite adresu ili lokaciju", en: "Specify address or location" },
        enterDescription: { 
            ru: "Опишите проблему. Можно добавить фото или видео (до 3 файлов)", 
            cnr: "Opišite problem. Možete dodati fotografiju ili video (do 3 datoteke)", 
            en: "Describe the problem. You can add a photo or video (up to 3 files)" 
        }
    },
    
    // Категории и подкатегории
    categories: {
        selectType: { ru: "Выберите категорию техники", cnr: "Odaberite kategoriju uređaja", en: "Select appliance category" },
        selectSub: { ru: "Выберите тип устройства", cnr: "Odaberite tip uređaja", en: "Select device type" },
        brandModalTitle: { ru: "Выберите бренд", cnr: "Izaberite marku", en: "Select brand" },
        brandManual: { ru: "Или введите вручную:", cnr: "Ili unesite ručno:", en: "Or type manually:" },
        brandManualPlaceholder: { ru: "Название бренда", cnr: "Naziv marke", en: "Brand name" },
        brandBtnCancel: { ru: "Отмена", cnr: "Otkaži", en: "Cancel" },
        brandBtnConfirm: { ru: "Ок", cnr: "U redu", en: "OK" }
    },
    
    // Адрес и карта
    address: {
        optChooseCity: { ru: "Выберите город", cnr: "Izaberite grad", en: "Select city" },
        addressLabel: { ru: "Адрес или ориентир", cnr: "Adresa ili orijentir", en: "Address or landmark" },
        optChooseAddress: { ru: "Как указать местоположение?", cnr: "Kako navesti lokaciju?", en: "How to specify location?" },
        optMapSelect: { ru: "📍 Указать на карте", cnr: "📍 Navesti na mapi", en: "📍 Point on map" },
        optManualEntry: { ru: "⌨️ Ввести адрес/ориентир", cnr: "⌨️ Unesi adresu/orijentir", en: "⌨️ Enter address/landmark" },
        mapModalTitle: { ru: "Укажите местоположение", cnr: "Navedite lokaciju", en: "Specify location" },
        addrNotSelected: { ru: "Укажите местоположение", cnr: "Navedite lokaciju", en: "Specify location" },
        manualPlaceholder: { ru: "Адрес, ориентир или описание местоположения...", cnr: "Adresa, orijentir ili opis lokacije...", en: "Address, landmark or location description..." },
        mapSearchPlaceholder: { ru: "Поиск адреса...", cnr: "Pretraži adresu...", en: "Search address..." },
        btnConfirmAddr: { ru: "Подтвердить адрес", cnr: "Potvrdi adresu", en: "Confirm address" }
    },
    
    // Статус заявки
    status: {
        orderLabel: { ru: "Номер заявки", cnr: "Broj prijave", en: "Order ID" },
        statusLabel: { ru: "Статус", cnr: "Status", en: "Status" }
    },
    
    // Ошибки файлов (добавлено)
    files: {
        maxFiles: { ru: "Можно выбрать не более {max} файлов", cnr: "Možete izabrati najviše {max} datoteka", en: "You can select up to {max} files" },
        maxSize: { ru: "Файл {name} слишком большой (макс. {size}МБ)", cnr: "Datoteka {name} je prevelika (maks. {size} MB)", en: "File {name} is too large (max {size} MB)" }
    },
    
    // Города (статический список)
    cities: {
        Podgorica: { ru: "Podgorica", cnr: "Podgorica", en: "Podgorica" },
        Budva: { ru: "Budva", cnr: "Budva", en: "Budva" },
        Bar: { ru: "Bar", cnr: "Bar", en: "Bar" },
        Tivat: { ru: "Tivat", cnr: "Tivat", en: "Tivat" },
        Kotor: { ru: "Kotor", cnr: "Kotor", en: "Kotor" },
        HercegNovi: { ru: "Herceg Novi", cnr: "Herceg Novi", en: "Herceg Novi" }
    },
    
    // Фразы для статуса
    phrases: {
        ru: [
            "Спасибо за обращение! Ваша заявка № {orderNum} принята и передана специалисту. Мы свяжемся с вами в ближайшее время.",
            "Заявка № {orderNum} успешно зарегистрирована. Благодарим за доверие — уже начали обработку.",
            "Ваш запрос № {orderNum} принят в работу. Наш мастер свяжется с вами для согласования деталей.",
            "Спасибо за выбор нашего сервиса. Заявка № {orderNum} зафиксирована и находится в обработке.",
            "Мы получили вашу заявку № {orderNum}. В ближайшее время с вами свяжется сервисный инженер.",
            "Заявка № {orderNum} принята. Мы ценим ваше время и готовим оптимальное решение.",
            "Благодарим за обращение. Ваша заявка № {orderNum} уже передана мастеру.",
            "Ваше обращение № {orderNum} зарегистрировано. Ожидайте обратную связь в ближайшее время.",
            "Спасибо за доверие! Заявка № {orderNum} в работе, мы скоро свяжемся с вами.",
            "Заявка № {orderNum} успешно принята. Наш специалист уже готовится связаться с вами."
        ],
        cnr: [
            "Hvala na obraćanju! Vaša prijava br. {orderNum} je primljena i proslijeđena stručnjaku. Kontaktiraćemo vas uskoro.",
            "Prijava br. {orderNum} je uspješno registrovana. Hvala na povjerenju — obrada je već počela.",
            "Vaš zahtjev br. {orderNum} je prihvaćen. Naš majstor će vas kontaktirati radi dogovora o detaljima.",
            "Hvala što ste odabrali naš servis. Prijava br. {orderNum} je evidentirana i u fazi je obrade.",
            "Primili smo vašu prijavu br. {orderNum}. Servisni inženjer će vas kontaktirati u najkraćem mogućem roku.",
            "Prijava br. {orderNum} je prihvaćena. Cijenimo vaše vrijeme i pripremamo optimalno rješenje.",
            "Hvala na obraćanju. Vaša prijava br. {orderNum} je već proslijeđena majstoru.",
            "Vaša prijava br. {orderNum} je registrovana. Očekujte povratnu informaciju uskoro.",
            "Hvala na povjerenju! Prijava br. {orderNum} je u radu, uskoro ćemo vas kontaktirati.",
            "Prijava br. {orderNum} je uspješno prihvaćena. Naš stručnjak se već priprema da vas kontaktira."
        ],
        en: [
            "Thank you for contacting us! Your request No. {orderNum} has been accepted and assigned to a specialist. We will contact you shortly.",
            "Request No. {orderNum} successfully registered. Thank you for your trust — processing has already begun.",
            "Your request No. {orderNum} is accepted. Our technician will contact you to coordinate the details.",
            "Thank you for choosing our service. Request No. {orderNum} is recorded and is being processed.",
            "We have received your request No. {orderNum}. A service engineer will contact you shortly.",
            "Request No. {orderNum} is accepted. We value your time and are preparing the best solution.",
            "Thank you for your request. Your application No. {orderNum} has already been handed over to the master.",
            "Your request No. {orderNum} is registered. Expect feedback shortly.",
            "Thank you for your trust! Request No. {orderNum} is in progress, we will contact you soon.",
            "Request No. {orderNum} successfully accepted. Our specialist is already preparing to contact you."
        ]
    }
};

// Модальные окна
const modalTranslations = {
    modalTitle: { ru: "Проверьте данные", cnr: "Proverite podatke", en: "Check details" },
    btnCancel: { ru: "Отмена", cnr: "Otkaži", en: "Cancel" },
    btnConfirm: { ru: "Ок", cnr: "U redu", en: "OK" },
    btnChange: { ru: "Изменить", cnr: "Izmijeni", en: "Change" },
    btnEverythingCorrect: { ru: "Всё верно", cnr: "Sve je tačno", en: "Everything is correct" }
};

// Утилитарная функция для получения перевода
function getTranslation(key, lang = window.currentLang || 'ru') {
    // Ищем ключ в иерархической структуре
    const keys = key.split('.');
    let result = translationStructure;
    
    for (const k of keys) {
        if (result && result[k]) {
            result = result[k];
        } else {
            return key; // Возвращаем ключ, если перевод не найден
        }
    }
    
    // Если это объект с переводами для разных языков
    if (result && typeof result === 'object' && result[lang] !== undefined) {
        return result[lang];
    }
    
    // Если это массив фраз
    if (Array.isArray(result)) {
        return result;
    }
    
    return key;
}

// Функция получения случайной фразы
function getRandomPhrase(lang = window.currentLang || 'ru') {
    const phrases = translationStructure.phrases[lang] || translationStructure.phrases.ru;
    return phrases[Math.floor(Math.random() * phrases.length)];
}

// Функция для форматирования сообщений с подстановкой значений
function formatTranslation(template, values = {}) {
    let result = template;
    for (const [key, value] of Object.entries(values)) {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
}

// Функция смены языка (оптимизированная)
function changeLang(lang) {
    window.currentLang = lang;
    localStorage.setItem('userLanguage', lang);
    
    // Общие элементы (проверяем существование)
    const titleEl = document.getElementById('title');
    if (titleEl) titleEl.innerText = getTranslation('common.title', lang);
    
    const nameEl = document.getElementById('name');
    if (nameEl) nameEl.placeholder = getTranslation('common.name', lang);
    
    const phoneEl = document.getElementById('phone');
    if (phoneEl) phoneEl.placeholder = getTranslation('common.phone', lang);
    
    // Бренд - новый формат
    const brandInput = document.getElementById('brand-input');
    if (brandInput) {
        brandInput.placeholder = getTranslation('form.brand', lang);
    }
    
    const brandHidden = document.getElementById('brand');
    if (brandHidden) {
        brandHidden.placeholder = getTranslation('form.brand', lang);
    }
    
    // Описание
    const descriptionEl = document.getElementById('description');
    if (descriptionEl) descriptionEl.placeholder = getTranslation('form.descPlaceholder', lang);
    
    // Кнопка фото
    const photoBtnLabel = document.getElementById('lbl-photo-btn');
    if (photoBtnLabel) photoBtnLabel.innerText = getTranslation('form.photoBtn', lang);
    
    // Кнопка отправки
    const submitBtn = document.getElementById('btn-submit');
    if (submitBtn) submitBtn.innerText = getTranslation('common.submit', lang);
    
    // Категории и бренды (обновляем только существующие элементы)
    const brandModalTitle = document.getElementById('brand-modal-title');
    if (brandModalTitle) brandModalTitle.innerText = getTranslation('categories.brandModalTitle', lang);
    
    const customBrandInput = document.getElementById('customBrand');
    if (customBrandInput) {
        customBrandInput.placeholder = getTranslation('categories.brandManualPlaceholder', lang) || "Название бренда";
    }
    
    // Кнопки в модальном окне бренда
    const brandModalCancelBtn = document.querySelector('#brandModal .modal-footer .btn-secondary');
    if (brandModalCancelBtn) {
        brandModalCancelBtn.innerText = modalTranslations.btnCancel[lang] || modalTranslations.btnCancel.ru;
    }

    // Кнопка "ОК" находится в теле модалки, не в footer!
    const manualBrandOkBtn = document.querySelector('#brandModal .manual-brand-input .btn-primary');
    if (manualBrandOkBtn) {
        manualBrandOkBtn.innerText = modalTranslations.btnConfirm[lang] || modalTranslations.btnConfirm.ru;
    }
    
    // Город
    const citySelect = document.getElementById('city');
    if (citySelect && citySelect.options[0]) {
        citySelect.options[0].text = getTranslation('form.city', lang);
    }
    
    // Адресные поля
    const addressTypeSelect = document.getElementById('address-type-select');
    if (addressTypeSelect && addressTypeSelect.options[0]) {
        addressTypeSelect.options[0].text = getTranslation('address.optChooseAddress', lang);
    }
    
    const addressInput = document.getElementById('address-input');
    if (addressInput) {
        addressInput.placeholder = getTranslation('address.manualPlaceholder', lang);
    }
    
    // Карта (только если элементы существуют)
    const mapTitle = document.getElementById('map-modal-title');
    if (mapTitle) mapTitle.innerText = getTranslation('address.mapModalTitle', lang);
    
    const mapSearch = document.getElementById('map-search-input');
    if (mapSearch) mapSearch.placeholder = getTranslation('address.mapSearchPlaceholder', lang);
    
    const mapConfirmBtn = document.querySelector('#mapModal .modal-footer .btn-primary');
    if (mapConfirmBtn) mapConfirmBtn.innerText = getTranslation('address.btnConfirmAddr', lang);
    
    // Модальное окно подтверждения
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.innerText = modalTranslations.modalTitle[lang] || modalTranslations.modalTitle.ru;
    
    // Кнопки в модальном окне подтверждения
    const confirmModalButtons = document.querySelectorAll('#confirmModal .modal-footer button');
    if (confirmModalButtons.length >= 2) {
        confirmModalButtons[0].innerText = modalTranslations.btnChange[lang] || modalTranslations.btnChange.ru;
        confirmModalButtons[1].innerText = modalTranslations.btnEverythingCorrect[lang] || modalTranslations.btnEverythingCorrect.ru;
    }
    
    // Кнопка в модальном окне статуса
    const statusModalBtn = document.querySelector('#statusModal .modal-footer .btn-primary');
    if (statusModalBtn) {
        statusModalBtn.innerText = getTranslation('common.btnOk', lang) || "Понятно";
    }
    
    // Кнопки переключения языка
    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`lang-${lang}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Инициализация категорий (если функция существует)
    if (typeof CategoryManager !== 'undefined' && CategoryManager.initMainCategories) {
        try {
            CategoryManager.initMainCategories(lang);
        } catch (error) {
            console.warn('Ошибка при обновлении категорий:', error);
        }
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
        const translation = getTranslation(key, lang);
        if (translation !== key) {
            element.textContent = translation;
        }
    }
});
}

// Облегченная версия для обратной совместимости (старый формат)
function getLegacyTranslations() {
    const lang = window.currentLang || 'ru';
    const result = {};
    
    // Преобразуем в плоскую структуру для обратной совместимости
    for (const category in translationStructure) {
        if (category === 'phrases') continue; // Фразы обрабатываем отдельно
        if (category === 'cities') continue; // Города обрабатываем отдельно
        
        for (const key in translationStructure[category]) {
            if (translationStructure[category][key][lang] !== undefined) {
                result[key] = translationStructure[category][key][lang];
            }
        }
    }
    
    // Добавляем фразы
    result.phrases = translationStructure.phrases[lang] || translationStructure.phrases.ru;
    
    // Добавляем города
    result.cities = Object.values(translationStructure.cities).map(city => city[lang]);
    
    return result;
}

// Функция для показа сообщения об ошибке валидации (универсальная)
function showValidationMessage(fieldId, messageKey, values = {}) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    let message = getTranslation(`validation.${messageKey}`, window.currentLang);
    
    // Форматируем сообщение если есть значения для подстановки
    if (Object.keys(values).length > 0) {
        message = formatTranslation(message, values);
    }
    
    // Всегда используем кастомное сообщение, даже если не нашли перевод
    if (message === `validation.${messageKey}`) {
        // Если перевод не найден, используем fallback на английском
        const fallbackMessages = {
            'enterName': { ru: "Введите имя", cnr: "Unesite ime", en: "Enter name" },
            'selectCategory': { ru: "Выберите категорию", cnr: "Izaberite kategoriju", en: "Select category" },
            'selectBrand': { ru: "Выберите или введите бренд", cnr: "Izaberite ili unesite marku", en: "Select or enter brand" },
            'selectCity': { ru: "Выберите город", cnr: "Izaberite grad", en: "Select city" },
            'specifyAddress': { ru: "Укажите адрес или местоположение", cnr: "Navedite adresu ili lokaciju", en: "Specify address or location" },
            'enterPhone': { ru: "Введите номер телефона", cnr: "Unesite broj telefona", en: "Enter phone number" },
            'invalidPhone': { ru: "Неверный формат номера", cnr: "Neispravan format broja", en: "Invalid phone number format" },
            'fillField': { ru: "Заполните это поле", cnr: "Popunite ovo polje", en: "Please fill in this field" },
            'requiredField': { ru: "Обязательное поле", cnr: "Obavezno polje", en: "Required field" }
        };
        
        const lang = window.currentLang || 'ru';
        if (fallbackMessages[messageKey] && fallbackMessages[messageKey][lang]) {
            message = fallbackMessages[messageKey][lang];
        } else {
            message = fallbackMessages[messageKey]?.en || "Please fill in this field";
        }
    }
    
    // Устанавливаем кастомное сообщение
    field.setCustomValidity(message);
    field.reportValidity();
    
    // Для лучшего UX, фокусируемся на поле с ошибкой
    if (field.focus) {
        field.focus();
    }
}

// Функция для очистки сообщения об ошибке валидации
function clearValidationMessage(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.setCustomValidity('');
    }
}

// Экспортируем глобально
window.translations = translationStructure;
window.modalTranslations = modalTranslations;
window.getTranslation = getTranslation;
window.getRandomPhrase = getRandomPhrase;
window.formatTranslation = formatTranslation;
window.changeLang = changeLang;
window.getLegacyTranslations = getLegacyTranslations;
window.showValidationMessage = showValidationMessage;
window.clearValidationMessage = clearValidationMessage;