/** +++
 * Менеджер категорий оборудования (ОБНОВЛЕННЫЙ с новыми классами)
 */
const CategoryManager = {
    data: {
        Refrigeration: {
            icon: "❄️", ru: "Холодильное оборудование", cnr: "Rashladna oprema", en: "Refrigeration",
            items: {
                ru: ["Холодильник", "Морозильник", "Винный шкаф", "Холодильная витрина / шкаф", 
                    "Ледогенератор", "Холодильная камера", "Морозильная камера", "Другое / не знаю"],
                cnr: ["Frižider", "Zamrzivač", "Vinski frižider", "Rashladna vitrina / ormar", 
                    "Ledomat", "Rashladna komora", "Zamrzivačka komora", "Drugo / ne znam"],
                en: ["Refrigerator", "Freezer", "Wine cooler", "Refrigerated display / cabinet", 
                    "Ice maker", "Cold room", "Freezer room", "Other / not sure"]

            }
        },
        Laundry: { 
            icon: "🧺", ru: "Стирка и мойка", cnr: "Pranje i pranje posuđa", en: "Laundry & Wash",
            items: {
                ru: ["Стиральная машина (бытовая)","Стиральная машина (коммерческая)", 
                    "Стирально-сушильная машина", "Сушильная машина", "Посудомоечная машина (бытовая)", 
                    "Посудомоечная машина (профессиональная)", "Другое / не знаю"],
                cnr: ["Veš mašina (kućna)", "Veš mašina (komercijalna)", "Veš-sušilica", "Sušilica za veš", 
                    "Mašina za pranje sudova (kućna)", "Mašina za pranje sudova (profesionalna)", 
                    "Perilica za ugostiteljstvo", "Drugo / ne znam"],
                en: [  "Washing machine (household)", "Washing machine (commercial)", "Washer-dryer", 
                    "Tumble dryer", "Dishwasher (household)", "Dishwasher (professional)", "Other / not sure"]
            }
        },
        Climate: {
            icon: "🌬️", ru: "Климат и воздух", cnr: "Klima i vazduh", en: "Climate & Air",
            items: {
                ru: ["Кондиционер", "Мульти-сплит система", "Тепловой насос", "Осушитель воздуха", 
                    "Вентиляция / вытяжка", "Рекуператор", "HVAC", "Чистка", "Другое / не знаю"], 
                cnr: ["Kondicioner", "Multi-split sistem", "Toplotna pumpa", "Odvlaživač vazduha", 
                    "Ventilacija / odvod", "Rekuperator", "HVAC", "Čišćenje", "Drugo / ne znam"],
                en: ["Air conditioner", "Multi-split system", "Heat pump", "Dehumidifier", 
                    "Ventilation / exhaust", "Heat recovery unit", "HVAC", "Cleaning", "Other / not sure"]
            }
        }
    },

    initMainCategories: function(lang) {
        const catSelect = document.getElementById('type-category');
        if (!catSelect) return;

        // Добавляем класс form-control если его нет
        if (!catSelect.classList.contains('form-control')) {
            catSelect.classList.add('form-control');
        }

        // 1. Запоминаем, что было выбрано до смены языка
        const savedValue = catSelect.value;
        const savedSubValueIndex = document.getElementById('subcategory-select').selectedIndex;

        catSelect.innerHTML = '';
        
        const typeLabels = {
            ru: "Выберите категорию техники",
            cnr: "Odaberite kategoriju uređaja",
            en: "Select appliance category"
        };
        
        const defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.disabled = true;
        defaultOpt.selected = !savedValue;
        defaultOpt.innerText = typeLabels[lang] || typeLabels.ru;
        catSelect.appendChild(defaultOpt);

        Object.keys(this.data).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.innerText = `${this.data[key].icon} ${this.data[key][lang] || this.data[key].ru}`;
            if (key === savedValue) opt.selected = true;
            catSelect.appendChild(opt);
        });

        // 2. Если была выбрана категория, обновляем текст в подкатегориях
        if (savedValue) {
            this.updateSubMenu(savedSubValueIndex);
        }
    },
    
    // categories-handler.js - обновленный updateSubMenu

    // В функции updateSubMenu исправим условие показа:
    updateSubMenu: function(restoreIndex = -1) {
        const mainSelect = document.getElementById('type-category');
        const subContainer = document.getElementById('type-subcategory');
        const subSelect = document.getElementById('subcategory-select');
        
        if (!mainSelect || !subContainer || !subSelect) return;

        // Добавляем класс form-control если его нет
        if (!subSelect.classList.contains('form-control')) {
            subSelect.classList.add('form-control');
        }

        const selectedKey = mainSelect.value;

        if (selectedKey && this.data[selectedKey]) {
            const lang = window.currentLang || 'ru';
            const items = this.data[selectedKey].items[lang] || this.data[selectedKey].items.ru;
            
            // Очищаем и заполняем опции
            subSelect.innerHTML = '';
            
            // Добавляем заголовок (С ПРАВИЛЬНЫМ ПЕРЕВОДОМ)
            const defaultOpt = document.createElement('option');
            defaultOpt.value = "";
            defaultOpt.disabled = true;
            defaultOpt.selected = true;
            
            // Используем перевод для заголовка
            const typeLabels = {
                ru: "Выберите тип устройства",
                cnr: "Odaberite tip uređaja",
                en: "Select device type"
            };
            defaultOpt.textContent = typeLabels[lang] || typeLabels.ru;
            subSelect.appendChild(defaultOpt);
            
            // Добавляем опции
            items.forEach((item, index) => {
                const opt = new Option(item, item);
                subSelect.options.add(opt);
            });

            // ПОКАЗЫВАЕМ подкатегорию
            subContainer.style.display = 'block';
            subSelect.disabled = false;
            subSelect.required = true;
            
            // Обновляем состояние через CSSHandler
            if (typeof CSSHandler !== 'undefined' && CSSHandler.updateFieldState) {
                setTimeout(() => {
                    CSSHandler.updateFieldState(subSelect);
                }, 10);
            }
            
        } else {
            // Скрываем подкатегорию
            subContainer.style.display = 'none';
            subSelect.disabled = true;
            subSelect.required = false;
            subSelect.value = '';
            
            // Обновляем состояние через CSSHandler
            if (typeof CSSHandler !== 'undefined' && CSSHandler.updateFieldState) {
                setTimeout(() => {
                    CSSHandler.updateFieldState(subSelect);
                }, 10);
            }
        }
    }
};