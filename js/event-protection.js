// Создаем файл event-protection.js
const EventProtection = {
    handlers: new Map(),
    
    addProtectedListener: function(element, eventType, handler, timeout = 1000) {
        const key = `${eventType}-${element.id || element.className}`;
        
        if (this.handlers.has(key)) {
            console.warn(`⚠️ Уже есть обработчик для ${key}, удаляем старый`);
            const oldHandler = this.handlers.get(key);
            element.removeEventListener(eventType, oldHandler);
        }
        
        let isProcessing = false;
        
        const protectedHandler = (e) => {
            if (isProcessing) {
                console.warn(`⚠️ Событие ${eventType} уже обрабатывается для ${element.id || element.className}`);
                return;
            }
            
            isProcessing = true;
            console.log(`🎯 Обработка события ${eventType} для ${element.id || element.className}`);
            
            try {
                handler(e);
            } catch (error) {
                console.error(`❌ Ошибка в обработчике ${eventType}:`, error);
            }
            
            setTimeout(() => {
                isProcessing = false;
                console.log(`✅ Готов к новому событию ${eventType} для ${element.id || element.className}`);
            }, timeout);
        };
        
        element.addEventListener(eventType, protectedHandler);
        this.handlers.set(key, protectedHandler);
        
        console.log(`✅ Защищенный обработчик добавлен для ${key}`);
    }
};

window.EventProtection = EventProtection;