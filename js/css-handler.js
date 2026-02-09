// css-handler.js - Менеджер стилей CSS-in-JS для приложения

/**
 * Класс для управления CSS классами и состояниями элементов
 * Заменяет inline-стили и сложную логику в App.initFields()
 */
const CSSHandler = {

    // Конфигурация CSS классов
    classes: {
        filled: 'filled',
        error: 'error',
        active: 'active',
        loading: 'loading',
        fieldWithError: 'field-with-error',
        formControl: 'form-control',
        brandInput: 'brand-input',
        addressDisplay: 'address-display-input'
    },
    
    // Цвета для динамического применения (если нужно)
    colors: {
        successLight: 'var(--success-light)',
        successColor: 'var(--success-color)',
        errorLight: 'var(--error-light)',
        errorColor: 'var(--error-color)',
        bgColor: 'var(--bg-color)',
        primaryColor: 'var(--primary-color)',
        textPrimary: 'var(--text-primary)',
        textPlaceholder: 'var(--text-placeholder)'
    },

    /**
     * Инициализация CSSHandler
     */
    init: function() {
        console.log('🎨 CSSHandler: инициализация');
        this.setupGlobalStyles();
        this.observeFormChanges();
        return this;
    },

    // Добавим debug режим для детальной отладки
    debug: false, // Можно включить для отладки

    init: function(debug = false) {
        this.debug = debug;
        if (this.debug) console.log('🎨 CSSHandler: инициализация (debug mode)');
        
        try {
            this.setupGlobalStyles();
            this.observeFormChanges();
            this.initializeFieldStates();
            
            if (this.debug) {
                console.log('✅ CSSHandler инициализирован успешно');
                this.logFieldStates();
            }
            return true;
        } catch (error) {
            console.error('❌ Ошибка инициализации CSSHandler:', error);
            return false;
        }
    },
    
    logFieldStates: function() {
        console.log('📊 Состояния полей формы:');
        document.querySelectorAll(`.${this.classes.formControl}`).forEach(field => {
            const state = {
                id: field.id,
                name: field.name,
                value: field.value,
                filled: this.hasClass(field, this.classes.filled),
                error: this.hasClass(field, this.classes.error),
                valid: field.checkValidity()
            };
            console.log(`  ${field.id}:`, state);
        });
    },
    // Обработка автозаполнения браузера
    // добавим более надежную обработку автозаполнения
    handleAutofill: function() {
        try {
            // Отслеживаем изменения через несколько интервалов для надежности
            const checkAutofill = () => {
                const formControls = document.querySelectorAll(`.${this.classes.formControl}`);
                formControls.forEach(field => {
                    if (field && field.value && field.value.trim() !== '') {
                        // Проверяем, изменилось ли состояние
                        const wasFilled = this.hasClass(field, this.classes.filled);
                        const isNowFilled = this.isFieldFilled(field);
                        
                        if (isNowFilled && !wasFilled) {
                            console.log(`🔄 Автозаполнение для поля: ${field.id || field.name}`);
                            this.updateFieldState(field);
                        }
                    }
                });
            };
            
            // Проверяем несколько раз с разными интервалами
            setTimeout(checkAutofill, 300);
            setTimeout(checkAutofill, 800);
            setTimeout(checkAutofill, 1500);
            
            // Также слушаем изменения через MutationObserver
            if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && 
                            mutation.attributeName === 'value' &&
                            mutation.target.matches && 
                            mutation.target.matches(`.${this.classes.formControl}`)) {
                            setTimeout(() => {
                                this.updateFieldState(mutation.target);
                            }, 50);
                        }
                    });
                });
                
                // Наблюдаем за всеми полями формы
                document.querySelectorAll(`.${this.classes.formControl}`).forEach(field => {
                    observer.observe(field, { 
                        attributes: true, 
                        attributeFilter: ['value'] 
                    });
                });
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в handleAutofill:', error);
        }
    },
    
    /**
     * Настройка глобальных стилей и обработчиков
     */
    setupGlobalStyles: function() {
        // Добавляем класс form-control ко всем полям формы
        document.querySelectorAll('input[type="text"], input[type="tel"], select, textarea').forEach(field => {
            if (!field.classList.contains(this.classes.formControl)) {
                field.classList.add(this.classes.formControl);
            }
        });
        
        // Убираем красные рамки при загрузке (после небольшой задержки)
        setTimeout(() => {
            document.querySelectorAll(`.${this.classes.formControl}`).forEach(field => {
                if (field.validity && field.validity.valid) {
                    this.removeClass(field, this.classes.error);
                }
            });
        }, 100);
    },
    
    /**
     * Наблюдение за изменениями в форме
     */
    observeFormChanges: function() {
        try {
            // Делегирование событий для динамических полей
            document.addEventListener('input', (e) => {
                if (e.target && e.target.matches && e.target.matches('.form-control')) {
                    this.handleFieldInput(e.target);
                }
            });
            
            document.addEventListener('focus', (e) => {
                if (e.target && e.target.matches && e.target.matches('.form-control')) {
                    this.handleFieldFocus(e.target);
                }
            }, true);
            
            document.addEventListener('blur', (e) => {
                if (e.target && e.target.matches && e.target.matches('.form-control')) {
                    this.handleFieldBlur(e.target);
                }
            }, true);
            
            document.addEventListener('change', (e) => {
                if (e.target && e.target.matches && e.target.matches('select.form-control')) {
                    this.handleSelectChange(e.target);
                }
            });
            
            // Дополнительно: слушаем изменения категории для подкатегории
            const categorySelect = document.getElementById('type-category');
            if (categorySelect) {
                categorySelect.addEventListener('change', () => {
                    setTimeout(() => {
                        const subSelect = document.getElementById('subcategory-select');
                        if (subSelect) {
                            this.updateFieldState(subSelect);
                        }
                    }, 50);
                });
            }
            
            // Слушаем клики по брендам (если сетка генерируется динамически)
            document.addEventListener('click', (e) => {
                // Клик по карточке бренда
                if (e.target.closest && e.target.closest('.brand-card')) {
                    const brandCard = e.target.closest('.brand-card');
                    const brandName = brandCard.querySelector('img')?.alt || 
                                    brandCard.querySelector('.brand-fallback-text')?.textContent;
                    if (brandName) {
                        setTimeout(() => {
                            this.updateBrandFieldAfterSelection(brandName);
                        }, 50);
                    }
                }
                
                // Клик по полю бренда
                if (e.target && e.target.id === 'brand-input') {
                    // Поле уже имеет onclick, но на всякий случай
                    if (typeof openBrandModal === 'function') {
                        openBrandModal();
                    }
                }
            });
            
        } catch (error) {
            console.warn('⚠️ Ошибка в observeFormChanges:', error);
        }
    },
    
    /**
     * Обработка ввода в поле
     */
    handleFieldInput: function(field) {
        // Очищаем ошибки при вводе
        this.clearFieldError(field);
        
        // Обновляем состояние заполнения
        this.updateFieldState(field);
        
        // Особые случаи для определенных полей
        if (field.id === 'phone') {
            this.handlePhoneInput(field);
        }
    },
    
    /**
     * Обработка фокуса на поле
     */
    handleFieldFocus: function(field) {
        // Убираем класс ошибки при фокусе
        this.removeClass(field, this.classes.error);
        
        // Для заполненных полей меняем фон
        if (this.hasClass(field, this.classes.filled)) {
            this.setFieldBackground(field, this.colors.bgColor);
        }
    },
    
    /**
     * Обработка потери фокуса
     */
    handleFieldBlur: function(field) {
        this.updateFieldState(field);
    },
    
    /**
     * Обработка изменения select
     */
    handleSelectChange: function(select) {
        this.updateFieldState(select);
        this.clearFieldError(select);
    },
    
    /**
     * Обработка ввода телефона
     */
    handlePhoneInput: function(phoneField) {
        this.clearFieldError(phoneField);
        
        // Очистка ошибок валидации
        const errorDiv = document.getElementById('phone-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        
        // Обновление состояния заполнения
        this.updateFieldState(phoneField);
    },
    
    /**
     * Обновление визуального состояния поля
     */
    updateFieldState: function(field) {
        if (!field) return;
        
        // Пропускаем скрытые поля
        if (field.offsetParent === null && field.style.display === 'none') {
            return;
        }
        
        try {
            // Определяем, заполнено ли поле
            const isFilled = this.isFieldFilled(field);
            
            // Для отладки
            if (this.debug) {
                console.log(`🎨 updateFieldState: ${field.id}, isFilled: ${isFilled}, value: "${field.value}"`);
            }
            
            // Обработка специальных случаев
            if (field.id === 'name') {
                this.updateNameField(field, isFilled);
            } else if (field.id === 'brand-input' || field.id === 'brand') {
                this.updateBrandField(field, isFilled);
            } else if (field.id === 'address-input') {
                this.updateAddressField(field, isFilled);
            } else if (field.id === 'subcategory-select') {
                // Особый случай для подкатегории
                this.updateSubcategoryField(field, isFilled);
            } else {
                this.updateGenericField(field, isFilled);
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в updateFieldState для поля', field.id, ':', error);
        }
    },

    /**
     * Обновление поля подкатегории
     */
    updateSubcategoryField: function(field, isFilled) {
        if (!field) return;
        
        try {
            // Проверяем, видимо ли поле
            const container = document.getElementById('type-subcategory');
            const isVisible = container && container.style.display !== 'none';
            
            if (!isVisible) {
                // Если поле скрыто, сбрасываем состояние
                this.removeClass(field, this.classes.filled);
                this.removeClass(field, this.classes.error);
                return;
            }
            
            if (isFilled) {
                this.addClass(field, this.classes.filled);
                this.setFieldStyle(field, {
                    backgroundColor: this.colors.successLight,
                    borderColor: this.colors.successColor,
                    color: this.colors.textPrimary
                });
            } else {
                this.removeClass(field, this.classes.filled);
                this.resetFieldStyle(field);
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в updateSubcategoryField:', error);
        }
    },
    
    /**
     * Проверка, заполнено ли поле
     */
    isFieldFilled: function(field) {
        if (!field) return false;
        
        try {
            // Для select элементов
            if (field.tagName === 'SELECT') {
                return field.value && field.value !== '' && field.value !== 'null';
            }
            
            // Для поля бренда
            if (field.id === 'brand-input' || field.id === 'brand') {
                const value = field.value ? field.value.trim() : '';
                // Учитываем, что placeholder "Выберите бренд" это не реальное значение
                return value && value !== '' && value !== 'Выберите бренд' && 
                    !value.includes('Выберите') && !value.includes('Select');
            }
            
            // Для обычных полей
            const value = field.value ? field.value.trim() : '';
            return value !== '';
        } catch (error) {
            console.warn('⚠️ Ошибка в isFieldFilled:', error);
            return false;
        }
    },
    
    /**
     * Обновление поля имени (специальная логика)
     */
    // В функции updateNameField исправим:
    updateNameField: function(field, isFilled) {
        if (!field) return;
        
        try {
            if (isFilled) {
                this.addClass(field, this.classes.filled);
                this.setFieldStyle(field, {
                    backgroundColor: this.colors.successLight,
                    borderColor: this.colors.successColor,
                    color: this.colors.textPrimary
                });
            } else {
                this.removeClass(field, this.classes.filled);
                // ВАЖНО: При сбросе возвращаем стандартные стили
                this.setFieldStyle(field, {
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-placeholder)',
                    boxShadow: ''
                });
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в updateNameField:', error);
        }
    },
    
    /**
     * Обновление поля бренда
     */
    updateBrandField: function(field, isFilled) {
        if (isFilled) {
            this.addClass(field, this.classes.filled);
            this.setFieldStyle(field, {
                backgroundColor: this.colors.successLight,
                borderColor: this.colors.successColor,
                color: this.colors.textPrimary
            });
        } else {
            this.removeClass(field, this.classes.filled);
            this.setFieldStyle(field, {
                backgroundColor: this.colors.bgColor,
                color: this.colors.textPlaceholder
            });
        }
    },

    // Добавим эти функции в CSSHandler:

    /**
     * Обновление поля бренда после выбора
     */
    updateBrandFieldAfterSelection: function(brandName) {
        try {
            console.log(`🎨 Обновление бренда: "${brandName}"`);
            
            const brandInput = document.getElementById('brand-input');
            const brandHidden = document.getElementById('brand');
            
            if (!brandInput || !brandHidden) return;
            
            // Устанавливаем значения
            brandInput.value = brandName;
            brandHidden.value = brandName;
            
            // Принудительно обновляем состояние
            this.updateFieldState(brandInput);
            
            // Добавляем визуальный фидбек
            this.addClass(brandInput, this.classes.filled);
            this.setFieldStyle(brandInput, {
                backgroundColor: this.colors.successLight,
                borderColor: this.colors.successColor,
                color: this.colors.textPrimary
            });
            
            // Обновляем кнопку рядом
            const brandButton = document.querySelector('.brand-select-btn');
            if (brandButton) {
                brandButton.style.backgroundColor = this.colors.successLight;
                brandButton.style.borderColor = this.colors.successColor;
                brandButton.style.color = this.colors.successColor;
            }
            
            console.log(`✅ Бренд "${brandName}" установлен`);
            
        } catch (error) {
            console.warn('⚠️ Ошибка в updateBrandFieldAfterSelection:', error);
        }
    },

    /**
     * Обработка изменения select
     */
    handleSelectChange: function(select) {
        if (!select) return;
        
        try {
            this.updateFieldState(select);
            this.clearFieldError(select);
            
            // Особый случай для категории
            if (select.id === 'type-category') {
                setTimeout(() => {
                    const subSelect = document.getElementById('subcategory-select');
                    if (subSelect) {
                        this.updateFieldState(subSelect);
                    }
                }, 100);
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в handleSelectChange:', error);
        }
    },

    /**
     * Обработка ввода в поле
     */
    handleFieldInput: function(field) {
        if (!field) return;
        
        try {
            // Очищаем ошибки при вводе
            this.clearFieldError(field);
            
            // Обновляем состояние заполнения
            this.updateFieldState(field);
            
            // Особые случаи для определенных полей
            if (field.id === 'phone') {
                this.handlePhoneInput(field);
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в handleFieldInput:', error);
        }
    },

    /**
     * Обработка фокуса на поле
     */
    handleFieldFocus: function(field) {
        if (!field) return;
        
        try {
            // Убираем класс ошибки при фокусе
            this.removeClass(field, this.classes.error);
            
            // Убираем родительский класс ошибки
            const parent = field.parentElement;
            if (parent && this.hasClass(parent, this.classes.fieldWithError)) {
                this.removeClass(parent, this.classes.fieldWithError);
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в handleFieldFocus:', error);
        }
    },

    /**
     * Обработка потери фокуса полем
     */
    handleFieldBlur: function(field) {
        if (!field) return;
        
        try {
            this.updateFieldState(field);
        } catch (error) {
            console.warn('⚠️ Ошибка в handleFieldBlur:', error);
        }
    },
    
    /**
     * Обновление поля адреса
     */
    updateAddressField: function(field, isFilled) {
        if (isFilled) {
            this.addClass(field, this.classes.filled);
            if (field.readOnly) {
                this.addClass(field, this.classes.addressDisplay);
            }
        } else {
            this.removeClass(field, this.classes.filled);
            this.removeClass(field, this.classes.addressDisplay);
        }
    },
    
    /**
     * Обновление обычного поля
     */
    updateGenericField: function(field, isFilled) {
        if (isFilled) {
            this.addClass(field, this.classes.filled);
            this.setFieldStyle(field, {
                backgroundColor: this.colors.successLight,
                borderColor: this.colors.successColor
            });
        } else {
            this.removeClass(field, this.classes.filled);
            this.resetFieldStyle(field);
        }
    },
    
    /**
     * Очистка ошибок поля
     */
    // В css-handler.js исправляем метод clearFieldError:
    clearFieldError: function(field) {
        this.removeClass(field, this.classes.error);
        
        // Убираем родительский класс
        const parent = field.parentElement;
        if (parent && this.hasClass(parent, this.classes.fieldWithError)) {
            this.removeClass(parent, this.classes.fieldWithError);
        }
        
        // Сбрасываем кастомную валидацию
        if (field.setCustomValidity) {
            field.setCustomValidity('');
        }
        
        // Скрываем сообщение об ошибке
        const errorDiv = field.parentElement.querySelector('.validation-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        
        // Особый случай для телефона - вызываем только если метод существует
        if (field.id === 'phone' && typeof ValidationManager !== 'undefined' && ValidationManager.clearError) {
            ValidationManager.clearError();
        }
    },
    /**
     * Установка ошибки поля
     */
    setFieldError: function(field, message = '') {
        this.addClass(field, this.classes.error);
        
        // Добавляем родительский класс
        const parent = field.parentElement;
        if (parent) {
            this.addClass(parent, this.classes.fieldWithError);
        }
        
        // Показываем сообщение об ошибке
        const errorDiv = field.parentElement.querySelector('.validation-error');
        if (errorDiv) {
            if (message) {
                errorDiv.textContent = message;
            }
            errorDiv.style.display = 'block';
        }
        
        // Устанавливаем кастомное сообщение
        if (message) {
            field.setCustomValidity(message);
        }
    },
    
    /**
     * Инициализация состояний всех полей
     */
    initializeFieldStates: function() {
        console.log('🎨 Инициализация состояний полей');
        
        try {
            const formControls = document.querySelectorAll(`.${this.classes.formControl}`);
            formControls.forEach(field => {
                if (!field) return;
                
                // Сначала полностью сбрасываем состояние
                this.resetFieldState(field);
                
                // Проверяем значение из localStorage или автозаполнения
                if (field.value && field.value.trim() !== '') {
                    // Обновляем состояние на основе текущего значения
                    this.updateFieldState(field);
                }
            });
            
            console.log(`✅ Состояния инициализированы для ${formControls.length} полей`);
        } catch (error) {
            console.error('❌ Ошибка в initializeFieldStates:', error);
        }
    },
    
    /**
     * Сброс состояния поля
     */
    resetFieldState: function(field) {
        if (!field) return;
        
        try {
            // Убираем CSS классы
            this.removeClass(field, this.classes.filled);
            this.removeClass(field, this.classes.error);
            
            // Убираем родительский класс ошибки
            const parent = field.parentElement;
            if (parent && this.hasClass(parent, this.classes.fieldWithError)) {
                this.removeClass(parent, this.classes.fieldWithError);
            }
            
            // Сбрасываем инлайн-стили
            field.style.backgroundColor = '';
            field.style.borderColor = '';
            field.style.boxShadow = '';
            field.style.color = '';
            field.style.transform = '';
            
            // Возвращаем стандартные стили через CSS переменные
            // Позволим CSS файлу управлять стандартными стилями
            field.style.removeProperty('background-color');
            field.style.removeProperty('border-color');
            field.style.removeProperty('color');
            field.style.removeProperty('box-shadow');
            
            // Для селектов и текстовых полей
            if (field.tagName === 'SELECT' || field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                field.style.backgroundColor = '';
                field.style.borderColor = '';
                field.style.color = '';
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в resetFieldState:', error);
        }
    },
    
    /**
     * Сброс стилей поля
     */
    resetFieldStyle: function(field) {
        if (!field) return;
        
        try {
            // ВАЖНО: Полностью сбрасываем инлайн-стили
            field.style.backgroundColor = '';
            field.style.borderColor = '';
            field.style.boxShadow = '';
            field.style.color = '';
            field.style.transform = '';
            
            // Возвращаем CSS переменные через классы
            if (field.classList.contains(this.classes.formControl)) {
                // Если это обычное поле формы
                field.style.backgroundColor = 'var(--bg-tertiary)';
                field.style.borderColor = 'var(--border-color)';
                field.style.color = 'var(--text-placeholder)';
            }
        } catch (error) {
            console.warn('⚠️ Ошибка в resetFieldStyle:', error);
        }
    },
    /**
     * Установка стилей поля
     */
    setFieldStyle: function(field, styles) {
        Object.assign(field.style, styles);
    },
    
    /**
     * Установка фона поля
     */
    setFieldBackground: function(field, color) {
        field.style.backgroundColor = color;
    },
    
    /**
     * Добавление класса
     */
    addClass: function(element, className) {
        if (element && !this.hasClass(element, className)) {
            element.classList.add(className);
        }
    },
    
    /**
     * Удаление класса
     */
    removeClass: function(element, className) {
        if (element && this.hasClass(element, className)) {
            element.classList.remove(className);
        }
    },
    
    /**
     * Проверка наличия класса
     */
    hasClass: function(element, className) {
        return element && element.classList.contains(className);
    },
    
    /**
     * Управление видимостью подкатегории
     */
    toggleSubcategory: function(show) {
        const subContainer = document.getElementById('type-subcategory');
        const subSelect = document.getElementById('subcategory-select');
        
        if (!subContainer || !subSelect) return;
        
        if (show) {
            this.addClass(subContainer, this.classes.active);
            subContainer.style.display = 'block';
            subSelect.required = true;
        } else {
            this.removeClass(subContainer, this.classes.active);
            subSelect.required = false;
            subSelect.value = '';
            
            setTimeout(() => {
                subContainer.style.display = 'none';
            }, 300);
        }
        
        // Обновляем состояние поля
        this.updateFieldState(subSelect);
    },
    
    /**
     * Обновление состояния поля бренда после выбора
     */
    updateBrandFieldAfterSelection: function(brandName) {
        const brandInput = document.getElementById('brand-input');
        const brandHidden = document.getElementById('brand');
        
        if (!brandInput || !brandHidden) return;
        
        brandInput.value = brandName;
        brandHidden.value = brandName;
        
        if (brandName && brandName.trim() !== '') {
            this.addClass(brandInput, this.classes.filled);
            this.removeClass(brandInput, this.classes.error);
            this.setFieldStyle(brandInput, {
                backgroundColor: this.colors.successLight,
                color: this.colors.textPrimary
            });
        }
    },
    
    /**
     * Сброс поля бренда
     */
    resetBrandField: function() {
        const brandInput = document.getElementById('brand-input');
        const brandHidden = document.getElementById('brand');
        
        if (brandInput) {
            brandInput.value = '';
            this.resetFieldState(brandInput);
            this.setFieldStyle(brandInput, {
                color: this.colors.textPlaceholder,
                backgroundColor: this.colors.bgColor
            });
        }
        
        if (brandHidden) {
            brandHidden.value = '';
        }
    },
    
    /**
     * Сброс всей формы
     */
    resetForm: function() {
        const form = document.getElementById('orderForm');
        if (!form) return;
        
        // Сбрасываем все поля
        document.querySelectorAll(`.${this.classes.formControl}`).forEach(field => {
            this.resetFieldState(field);
        });
        
        // Скрываем подкатегорию
        this.toggleSubcategory(false);
        
        // Сбрасываем поле бренда
        this.resetBrandField();
        
        // Сбрасываем адресное поле
        const addressInput = document.getElementById('address-input');
        if (addressInput) {
            addressInput.value = '';
            addressInput.readOnly = false;
            this.resetFieldState(addressInput);
            this.removeClass(addressInput, this.classes.addressDisplay);
        }
        
        // Скрываем секцию адреса
        const addressSection = document.getElementById('address-section');
        if (addressSection) {
            addressSection.style.display = 'none';
        }
    }
};

// Экспорт для глобального доступа
window.CSSHandler = CSSHandler;