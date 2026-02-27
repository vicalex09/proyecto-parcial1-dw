// pause.js - Sistema de pausa del juego

const pauseSystem = {
    isPaused: false,
    pausedTime: 0,
    
    /**
     * Inicializa el sistema de pausa
     * Configura event listeners para la tecla ESC y los botones
     */
    init: function() {
        // Agregar event listener para la tecla ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.toggle();
            }
        });
        
        // Configurar botones del modal
        const resumeBtn = document.getElementById('resumeBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.resume());
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.resume();
                location.reload(); // Recargar la página para reiniciar
            });
        }
    },
    
    /**
     * Alterna entre pausa y reanudación
     */
    toggle: function() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    },
    
    /**
     * Pausa el juego y muestra el modal
     */
    pause: function() {
        if (this.isPaused) return; // Si ya está pausado, no hacer nada
        
        this.isPaused = true;
        this.pausedTime = performance.now();
        
        // Mostrar el modal de pausa
        const pauseModal = document.getElementById('pauseModal');
        if (pauseModal) {
            pauseModal.style.display = 'flex';
        }
    },
    
    /**
     * Reanuda el juego y oculta el modal
     */
    resume: function() {
        if (!this.isPaused) return; // Si no está pausado, no hacer nada
        
        this.isPaused = false;
        
        // Ocultar el modal de pausa
        const pauseModal = document.getElementById('pauseModal');
        if (pauseModal) {
            pauseModal.style.display = 'none';
        }
    }
};

// Exponer para que se use desde script.js
window.pauseSystem = pauseSystem;
