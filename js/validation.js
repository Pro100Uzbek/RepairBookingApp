/**
 * Менеджер валидации (Чистый ITI)
 */

// validation.js - исправленный ValidationManager
const ValidationManager = {
    phoneInput: null,
    errorElement: null,

    init: function(input) {
        this.phoneInput = input;
        this.errorElement = document.getElementById('phone-error');
        console.log('✅ ValidationManager: готов к работе');
    },

    /**
     * Валидация через методы библиотеки ITI
     */
    validate: function() {
        this.clearError();
        
        console.group('📞 ВАЛИДАЦИЯ ТЕЛЕФОНА');
        
        // 1. Проверка на пустоту
        if (!this.phoneInput || !this.phoneInput.value.trim()) {
            console.log('❌ Поле телефона пустое');
            this.showError('enterPhone');
            console.groupEnd();
            return false;
        }

        console.log('Введенное значение:', this.phoneInput.value);
        
        // 2. Проверка наличия window.iti
        if (!window.iti) {
            console.error('❌ Библиотека ITI не найдена в window.iti');
            // Fallback: проверка минимальной длины
            const phoneValue = this.phoneInput.value.trim();
            const cleanPhone = phoneValue.replace(/\D/g, '');
            console.log('Чистый номер (fallback):', cleanPhone);
            
            if (cleanPhone.length < 8) {
                console.log('❌ Слишком короткий номер');
                this.showError('invalidPhone');
                console.groupEnd();
                return false;
            }
            console.log('✅ Номер прошел fallback проверку');
            console.groupEnd();
            return true;
        }

        // 3. Получаем полный номер
        let fullNumber = '';
        try {
            fullNumber = window.iti.getNumber();
            console.log('Полный номер (iti.getNumber):', fullNumber);
        } catch (error) {
            console.error('Ошибка получения номера через iti:', error);
        }
        
        // 4. Проверка валидности
        const isValid = window.iti.isValidNumber();
        console.log('Валидность номера:', isValid ? '✅ ВАЛИДЕН' : '❌ НЕВАЛИДЕН');
        
        if (!isValid) {
            // Детальная диагностика
            const validationError = window.iti.getValidationError();
            console.log('Код ошибки валидации:', validationError);
            console.log('Тип номера:', window.iti.getNumberType());
            
            this.showError('invalidPhone');
            console.groupEnd();
            return false;
        }
        
        console.log('✅ Номер корректен');
        console.log('Страна:', window.iti.getSelectedCountryData().name);
        console.log('Код страны:', window.iti.getSelectedCountryData().dialCode);
        console.groupEnd();
        return true;
    },

    showError: function(key) {
        const lang = window.currentLang || 'ru';
        const messages = {
            'enterPhone': { ru: "Введите номер", cnr: "Unesite broj", en: "Enter number" },
            'invalidPhone': { ru: "Неверный формат", cnr: "Neispravan format", en: "Invalid format" }
        };

        const msg = messages[key] ? messages[key][lang] : "Error";
        
        if (this.errorElement) {
            this.errorElement.textContent = msg;
            this.errorElement.style.display = 'block';
        }
        if (this.phoneInput) {
            this.phoneInput.classList.add('error');
        }
    },

    // ДОБАВЛЯЕМ ЭТОТ МЕТОД!
    clearError: function() {
        console.log('🧹 Очистка ошибки телефона');
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
            this.errorElement.textContent = '';
        }
        if (this.phoneInput) {
            this.phoneInput.classList.remove('error');
        }
    }
};

// Глобальная функция валидации всей формы

// В validation.js исправляем validateFormWithTranslations:
function validateFormWithTranslations() {
    const lang = window.currentLang || 'ru';
    let isValid = true;
    
    console.group('📋 ВАЛИДАЦИЯ ФОРМЫ');
    
    // Сбрасываем все ошибки
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.field-with-error').forEach(el => el.classList.remove('field-with-error'));
    document.querySelectorAll('.validation-error').forEach(el => el.style.display = 'none');
    
    // Валидация имени
    const nameField = document.getElementById('name');
    if (!nameField || !nameField.value.trim()) {
        console.log('❌ Имя не заполнено');
        nameField.classList.add('error');
        nameField.parentElement.classList.add('field-with-error');
        showValidationMessage('name', 'enterName');
        if (isValid) {
            nameField.focus();
            isValid = false;
        }
    }
    
    // Валидация телефона
    console.log('📞 Валидация телефона...');
    if (!ValidationManager.validate()) {
        isValid = false;
    }
    
    // Валидация города
    const cityField = document.getElementById('city');
    if (!cityField || !cityField.value) {
        console.log('❌ Город не выбран');
        cityField.classList.add('error');
        cityField.parentElement.classList.add('field-with-error');
        showValidationMessage('city', 'selectCity');
        if (isValid) {
            cityField.focus();
            isValid = false;
        }
    } else {
        console.log('✅ Город выбран:', cityField.value);
        cityField.classList.remove('error');
        cityField.parentElement.classList.remove('field-with-error');
        clearValidationMessage('city');
    }
    
    // Валидация адреса
    const addressField = document.getElementById('address-input');
    const latField = document.getElementById('lat');
    const lngField = document.getElementById('lng');
    
    const hasAddressText = addressField && addressField.value.trim();
    const hasCoordinates = latField && lngField && latField.value && lngField.value;
    const addressSection = document.getElementById('address-section');
    
    // Проверяем только если секция адреса видима
    if (addressSection && addressSection.style.display !== 'none' && 
        addressSection.style.display !== '' && 
        !hasAddressText && !hasCoordinates) {
        
        // Показываем ошибку только если поле видимо
        addressField.classList.add('error');
        addressField.parentElement.classList.add('field-with-error');
        showValidationMessage('address-input', 'specifyAddress');
        if (isValid) {
            addressField.focus();
            isValid = false;
        }
    }
    
    // Валидация категории
    const categoryField = document.getElementById('type-category');
    if (categoryField && (!categoryField.value || categoryField.value === "")) {
        categoryField.classList.add('error');
        categoryField.parentElement.classList.add('field-with-error');
        showValidationMessage('type-category', 'selectCategory');
        if (isValid) {
            categoryField.focus();
            isValid = false;
        }
    } else if (categoryField) {
        categoryField.classList.remove('error');
        categoryField.parentElement.classList.remove('field-with-error');
        clearValidationMessage('type-category');
    }
    
    // Валидация бренда
    const brandInput = document.getElementById('brand-input');
    const brandHidden = document.getElementById('brand');
    if (!brandInput || !brandInput.value.trim() || !brandHidden || !brandHidden.value.trim()) {
        brandInput.classList.add('error');
        brandInput.parentElement.classList.add('field-with-error');
        showValidationMessage('brand-input', 'selectBrand');
        if (isValid) {
            brandInput.focus();
            isValid = false;
        }
    } else {
        brandInput.classList.remove('error');
        brandInput.parentElement.classList.remove('field-with-error');
        clearValidationMessage('brand-input');
    }
    
    // Валидация описания проблемы
    const descriptionField = document.getElementById('description');
    if (!descriptionField || !descriptionField.value.trim()) {
        descriptionField.classList.add('error');
        descriptionField.parentElement.classList.add('field-with-error');
        showValidationMessage('description', 'enterDescription');
        if (isValid) {
            descriptionField.focus();
            isValid = false;
        }
    } else {
        descriptionField.classList.remove('error');
        descriptionField.parentElement.classList.remove('field-with-error');
        clearValidationMessage('description');
    }
    
    console.log('📋 Результат валидации формы:', isValid ? '✅ УСПЕШНО' : '❌ ОШИБКА');
    console.groupEnd();
    return isValid;
}

// Дополнительные функции валидации
function markFieldAsValid(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('error');
        field.parentElement.classList.remove('field-with-error');
        clearValidationMessage(fieldId);
    }
}

function markFieldAsInvalid(fieldId, messageKey) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        field.parentElement.classList.add('field-with-error');
        showValidationMessage(fieldId, messageKey);
        field.focus();
    }
}


// Экспортируем функции глобально
window.validateFormWithTranslations = validateFormWithTranslations;
window.markFieldAsValid = markFieldAsValid;
window.markFieldAsInvalid = markFieldAsInvalid;
window.ValidationManager = ValidationManager;