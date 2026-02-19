// 🎛️ ANIMATION CONTROLS SCRIPT - Fine-tune animation parameters
// Extended from script-healthgrades-test.js with animation control capabilities

class AnimationControlsPage {
    constructor() {
        this.manualRedirectBtn = document.getElementById('manual-redirect');
        this.versionSelect = document.getElementById('version-select');
        this.container = document.querySelector('.container');
        this.testMode = true;
        this.animationsPaused = false;
        this.currentVersion = 1; // Default to Version 1
        this.countdownSeconds = 6;
        this.countdownInterval = null;
        
        // Animation control settings
        this.animationSettings = {
            speed: 1.0,
            duration: 0.8,
            logoDelay: 0,
            logoStartDistance: 50,
            logoSpacing: 0,
            contentDelay: 0.3,
            dotSpeed: 1.0,
            dotDelayOffset: 0.2
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.preloadImages();
        this.trackPageView();
        this.setupControls();
        this.initializeVersion();
        this.startCountdown();
        this.logMode();
    }
    
    setupControls() {
        // Add global functions for buttons
        window.proceedToZocdoc = () => this.proceedToZocdoc();
        window.restartAnimation = () => this.restartAnimation();
        window.switchVersion = () => this.switchVersion();
        window.applyAnimationSettings = () => {
            this.applyAnimationSettings();
            // Restart animation after a brief delay to show the changes
            setTimeout(() => {
                this.restartAnimation();
            }, 50);
        };
        window.resetToDefaults = () => this.resetToDefaults();
        
        // Setup slider event listeners
        const speedSlider = document.getElementById('speed-slider');
        const durationSlider = document.getElementById('duration-slider');
        const logoDelaySlider = document.getElementById('logo-delay-slider');
        const logoStartSlider = document.getElementById('logo-start-slider');
        const logoSpacingSlider = document.getElementById('logo-spacing-slider');
        const delaySlider = document.getElementById('delay-slider');
        const dotSpeedSlider = document.getElementById('dot-speed-slider');
        const dotDelaySlider = document.getElementById('dot-delay-slider');
        
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('speed-value').textContent = value.toFixed(1);
                this.animationSettings.speed = value;
            });
        }
        
        if (durationSlider) {
            durationSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('duration-value').textContent = value.toFixed(1);
                this.animationSettings.duration = value;
            });
        }
        
        if (logoDelaySlider) {
            logoDelaySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('logo-delay-value').textContent = value.toFixed(1);
                this.animationSettings.logoDelay = value;
            });
        }
        
        if (logoStartSlider) {
            logoStartSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('logo-start-value').textContent = value;
                this.animationSettings.logoStartDistance = value;
            });
        }
        
        if (logoSpacingSlider) {
            logoSpacingSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('logo-spacing-value').textContent = value;
                this.animationSettings.logoSpacing = value;
            });
        }
        
        if (delaySlider) {
            delaySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('delay-value').textContent = value.toFixed(1);
                this.animationSettings.contentDelay = value;
            });
        }
        
        if (dotSpeedSlider) {
            dotSpeedSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('dot-speed-value').textContent = value.toFixed(1);
                this.animationSettings.dotSpeed = value;
            });
        }
        
        if (dotDelaySlider) {
            dotDelaySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById('dot-delay-value').textContent = value.toFixed(1);
                this.animationSettings.dotDelayOffset = value;
            });
        }
    }
    
    applyAnimationSettings() {
        console.log('🎛️ Applying animation settings:', this.animationSettings);
        
        // Get the actual duration (base duration / speed)
        const actualDuration = this.animationSettings.duration / this.animationSettings.speed;
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--animation-duration', `${actualDuration}s`);
        document.documentElement.style.setProperty('--logo-start-distance', `${this.animationSettings.logoStartDistance}px`);
        document.documentElement.style.setProperty('--logo-spacing', `${this.animationSettings.logoSpacing}px`);
        
        // Apply to logo animations
        this.applyLogoAnimations(actualDuration);
        
        // Apply to content fade animations
        this.applyContentAnimations(actualDuration);
        
        // Apply to dot animations (for versions that use them)
        this.applyDotAnimations();
        
        // Apply logo spacing
        this.applyLogoSpacing();
        
        // Force a reflow to ensure styles are applied
        this.container.offsetHeight;
    }
    
    applyLogoAnimations(duration) {
        const logoContainers = document.querySelectorAll('.logo-container');
        const easing = 'ease-out'; // Default easing
        const delay = this.animationSettings.logoDelay;
        const startDistance = this.animationSettings.logoStartDistance;
        
        // Create custom keyframes based on start distance
        this.createLogoKeyframes(startDistance);
        
        logoContainers.forEach((logo, index) => {
            if (this.currentVersion === 1) {
                // Version 1 uses overlap animations
                if (index === 0) {
                    logo.style.animation = `slideToLeftOverlap ${duration}s ${easing} ${delay}s forwards`;
                } else {
                    logo.style.animation = `slideToRightOverlap ${duration}s ${easing} ${delay}s forwards`;
                }
            } else if (this.currentVersion === 3) {
                // Version 3 uses fade and scale animations
                logo.style.animation = `fadeScaleIn ${duration}s ${easing} ${delay + (index * 0.1)}s forwards`;
            } else if (this.currentVersion === 5) {
                // Version 5 uses rotate and slide
                if (index === 0) {
                    logo.style.animation = `rotateSlideLeft ${duration}s ${easing} ${delay}s forwards`;
                } else {
                    logo.style.animation = `rotateSlideRight ${duration}s ${easing} ${delay}s forwards`;
                }
            } else {
                // Version 2 uses standard slide animations
                if (index === 0) {
                    logo.style.animation = `slideToLeftCustom ${duration}s ${easing} ${delay}s forwards`;
                } else {
                    logo.style.animation = `slideToRightCustom ${duration}s ${easing} ${delay}s forwards`;
                }
            }
        });
    }
    
    createLogoKeyframes(startDistance) {
        // Remove existing custom keyframes if any
        const existingStyle = document.getElementById('custom-logo-keyframes');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Create new keyframes
        const style = document.createElement('style');
        style.id = 'custom-logo-keyframes';
        style.textContent = `
            @keyframes slideToLeftCustom {
                0% { transform: translateX(${startDistance}px); }
                100% { transform: translateX(0); }
            }
            @keyframes slideToRightCustom {
                0% { transform: translateX(-${startDistance}px); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    applyLogoSpacing() {
        const brandLogos = document.querySelector('.brand-logos');
        if (brandLogos) {
            brandLogos.style.gap = `${this.animationSettings.logoSpacing}px`;
        }
    }
    
    applyContentAnimations(duration) {
        const messageSection = document.querySelector('.message-section');
        const ctaSection = document.querySelector('.cta-section');
        const instructions = document.querySelector('.instructions');
        const easing = 'ease-out';
        const delay = this.animationSettings.contentDelay;
        const fadeDistance = 20; // Default fade distance
        
        // Create custom fade keyframes
        this.createFadeKeyframes(fadeDistance);
        
        if (messageSection) {
            messageSection.style.animation = `fadeInContentCustom ${duration}s ${easing} ${delay}s forwards`;
        }
        
        if (ctaSection) {
            ctaSection.style.animation = `fadeInContentCustom ${duration}s ${easing} ${delay}s forwards`;
        }
        
        if (instructions) {
            instructions.style.animation = `fadeInContentCustom ${duration}s ${easing} ${delay + 0.3}s forwards`;
        }
    }
    
    createFadeKeyframes(fadeDistance) {
        // Remove existing custom keyframes if any
        const existingStyle = document.getElementById('custom-fade-keyframes');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Create new keyframes
        const style = document.createElement('style');
        style.id = 'custom-fade-keyframes';
        style.textContent = `
            @keyframes fadeInContentCustom {
                0% {
                    opacity: 0;
                    transform: translateY(${fadeDistance}px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    applyDotAnimations() {
        if (this.currentVersion === 1 || this.currentVersion === 3 || this.currentVersion === 5) {
            // These versions have no dots
            return;
        }
        
        const dots = document.querySelectorAll('.dot');
        const easing = 'ease-in-out';
        const dotSpeed = this.animationSettings.dotSpeed;
        const delayOffset = this.animationSettings.dotDelayOffset;
        
        // Base dot animation duration (3s for version 2)
        const baseDuration = 3;
        const actualDuration = baseDuration / dotSpeed;
        
        dots.forEach((dot, index) => {
            // Calculate delay based on index and offset
            const delay = index * delayOffset;
            // Version 2 uses dotProgress
            dot.style.animation = `dotProgress ${actualDuration}s ${easing} ${delay}s infinite`;
        });
    }
    
    resetToDefaults() {
        console.log('🎛️ Resetting to default settings');
        
        // Reset settings
        this.animationSettings = {
            speed: 1.0,
            duration: 0.8,
            logoDelay: 0,
            logoStartDistance: 50,
            logoSpacing: 0,
            contentDelay: 0.3,
            dotSpeed: 1.0,
            dotDelayOffset: 0.2
        };
        
        // Reset UI controls
        const speedSlider = document.getElementById('speed-slider');
        const durationSlider = document.getElementById('duration-slider');
        const logoDelaySlider = document.getElementById('logo-delay-slider');
        const logoStartSlider = document.getElementById('logo-start-slider');
        const logoSpacingSlider = document.getElementById('logo-spacing-slider');
        const delaySlider = document.getElementById('delay-slider');
        const dotSpeedSlider = document.getElementById('dot-speed-slider');
        const dotDelaySlider = document.getElementById('dot-delay-slider');
        
        if (speedSlider) {
            speedSlider.value = '1.0';
            document.getElementById('speed-value').textContent = '1.0';
        }
        
        if (durationSlider) {
            durationSlider.value = '0.8';
            document.getElementById('duration-value').textContent = '0.8';
        }
        
        if (logoDelaySlider) {
            logoDelaySlider.value = '0';
            document.getElementById('logo-delay-value').textContent = '0';
        }
        
        if (logoStartSlider) {
            logoStartSlider.value = '50';
            document.getElementById('logo-start-value').textContent = '50';
        }
        
        if (logoSpacingSlider) {
            logoSpacingSlider.value = '0';
            document.getElementById('logo-spacing-value').textContent = '0';
        }
        
        if (delaySlider) {
            delaySlider.value = '0.3';
            document.getElementById('delay-value').textContent = '0.3';
        }
        
        if (dotSpeedSlider) {
            dotSpeedSlider.value = '1.0';
            document.getElementById('dot-speed-value').textContent = '1.0';
        }
        
        if (dotDelaySlider) {
            dotDelaySlider.value = '0.2';
            document.getElementById('dot-delay-value').textContent = '0.2';
        }
        
        // Remove custom styles
        document.documentElement.style.removeProperty('--animation-duration');
        document.documentElement.style.removeProperty('--logo-start-distance');
        document.documentElement.style.removeProperty('--logo-spacing');
        
        // Remove custom keyframes
        const customKeyframes = document.getElementById('custom-logo-keyframes');
        if (customKeyframes) customKeyframes.remove();
        const customFadeKeyframes = document.getElementById('custom-fade-keyframes');
        if (customFadeKeyframes) customFadeKeyframes.remove();
        
        // Remove inline styles from elements
        document.querySelectorAll('.logo-container').forEach(logo => {
            logo.style.animation = '';
        });
        
        document.querySelectorAll('.message-section, .cta-section, .instructions').forEach(el => {
            el.style.animation = '';
        });
        
        document.querySelectorAll('.dot').forEach(dot => {
            dot.style.animation = '';
        });
        
        const brandLogos = document.querySelector('.brand-logos');
        if (brandLogos) {
            brandLogos.style.gap = '';
        }
        
        // Restart animation
        setTimeout(() => {
            this.restartAnimation();
        }, 100);
    }
    
    initializeVersion() {
        this.currentVersion = 1;
        this.container.classList.add('version-1');
        if (this.versionSelect) {
            this.versionSelect.value = '1';
        }
        // Update control visibility for initial version
        this.updateControlVisibility(1);
        console.log('🎛️ Initialized with Version 1 (Logo Overlap)');
    }
    
    logMode() {
        console.log('🎛️ ANIMATION CONTROLS PAGE LOADED');
        console.log('🎛️ Fine-tune animation parameters with the control panel');
        console.log('🎛️ Adjust easing, speed, duration, and delay in real-time');
    }
    
    setupEventListeners() {
        if (this.manualRedirectBtn) {
            this.manualRedirectBtn.addEventListener('click', () => {
                this.proceedToZocdoc();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.restartAnimation();
            }
            if (e.key === 'a' || e.key === 'A') {
                this.applyAnimationSettings();
            }
        });
    }
    
    switchVersion() {
        const selectedVersion = parseInt(this.versionSelect.value);
        console.log(`🎛️ Switching to Version ${selectedVersion}`);
        
        this.currentVersion = selectedVersion;
        
        // Remove all version classes
        this.container.classList.remove('version-1', 'version-2', 'version-3', 'version-5');
        
        // Apply new version class
        this.container.classList.add(`version-${selectedVersion}`);
        
        // Update control visibility based on version
        this.updateControlVisibility(selectedVersion);
        
        // Reset countdown
        this.resetCountdown();
        
        // Restart animation with current settings
        this.restartAnimation();
    }
    
    updateControlVisibility(version) {
        // Get all control groups with data-version attribute
        const controlGroups = document.querySelectorAll('.control-group[data-version]');
        
        controlGroups.forEach(group => {
            const versions = group.getAttribute('data-version').split(',').map(v => parseInt(v.trim()));
            if (versions.includes(version)) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
        
        // Update logo spacing label based on version
        const logoSpacingLabel = document.getElementById('logo-spacing-label');
        if (logoSpacingLabel) {
            if (version === 1) {
                logoSpacingLabel.textContent = 'Logo Overlap';
            } else {
                logoSpacingLabel.textContent = 'Logo Spacing';
            }
        }
    }
    
    startCountdown() {
        this.countdownInterval = setInterval(() => {
            this.countdownSeconds--;
            this.updateCountdown();
            
            if (this.countdownSeconds <= 0) {
                this.proceedToZocdoc();
            }
        }, 1000);
    }
    
    updateCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = this.countdownSeconds;
        }
    }
    
    resetCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        this.countdownSeconds = 6;
        this.updateCountdown();
        this.startCountdown();
    }
    
    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
    
    proceedToZocdoc() {
        console.log('🎛️ Book on Zocdoc clicked - showing redirect state then restarting');
        
        this.clearCountdown();
        this.showRedirectingState();
        
        setTimeout(() => {
            this.restartAnimation();
        }, 2000);
    }
    
    showRedirectingState() {
        const button = this.manualRedirectBtn;
        const countdownText = document.getElementById('countdown-text');
        
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.7';
            button.style.background = '#e5e7eb';
            button.style.color = '#9ca3af';
        }
        
        if (countdownText) {
            countdownText.textContent = 'Redirecting...';
            countdownText.style.color = '#727272';
        }
    }
    
    resetButtonState() {
        const button = this.manualRedirectBtn;
        const countdownText = document.getElementById('countdown-text');
        
        if (button) {
            button.textContent = 'Continue booking';
            button.disabled = false;
            button.style.opacity = '1';
            button.style.background = '';
            button.style.color = '';
        }
        
        if (countdownText) {
            countdownText.innerHTML = 'Redirecting in <span id="countdown">6</span> seconds';
            countdownText.style.color = '';
        }
    }
    
    restartAnimation() {
        console.log(`🎛️ Restarting animation for Version ${this.currentVersion}`);
        
        this.clearCountdown();
        
        const currentVersion = this.currentVersion;
        
        // Remove version classes
        this.container.classList.remove('version-1', 'version-2', 'version-3', 'version-5');
        
        // Add restarting class
        this.container.classList.add('restarting-animation');
        
        // Force reflow
        this.container.offsetHeight;
        document.body.offsetHeight;
        
        setTimeout(() => {
            this.container.classList.remove('restarting-animation');
            this.container.classList.add(`version-${currentVersion}`);
            
            // Re-apply animation settings after a brief delay to ensure DOM is ready
            setTimeout(() => {
                this.applyAnimationSettings();
            }, 50);
            
            // Reset button state and countdown
            this.resetButtonState();
            this.resetCountdown();
            
        }, 100);
    }
    
    preloadImages() {
        const imagesToPreload = [
            'assets/healthgrades-logo.png',
            'assets/zocdoc-logo.svg'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        
        console.log('🎛️ Images preloaded');
    }
    
    trackPageView() {
        console.log('🎛️ Page view tracked', {
            page: 'Healthgrades Animation Controls',
            timestamp: new Date().toISOString(),
            testMode: true
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationControlsPage = new AnimationControlsPage();
});

console.log(`
🎛️ ===================================
🎛️ ANIMATION CONTROLS PAGE
🎛️ ===================================
🎛️ Fine-tune animation parameters
🎛️ Adjust easing, speed, duration, delay
🎛️ 
🎛️ Keyboard shortcuts:
🎛️ R - Restart animations
🎛️ A - Apply settings
🎛️ ===================================
`);

