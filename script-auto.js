// Auto-redirect Interstitial page functionality
class AutoInterstitialPage {
    constructor() {
        this.manualRedirectBtn = document.getElementById('manual-redirect');
        this.redirectUrl = this.getRedirectUrl();
        this.countdownSeconds = 5;
        this.countdownInterval = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.preloadImages();
        this.trackPageView();
        this.startCountdown();
    }
    
    // Get redirect URL - specific Zocdoc booking URL
    getRedirectUrl() {
        // Base booking URL
        const baseUrl = 'https://www.zocdoc.com/booking/patientinfo/e7876751-b906-4a9b-ae0c-65e638e9aa6b';
        
        // Add UTM parameters for tracking
        const utmParams = new URLSearchParams({
            utm_source: 'yelp',
            utm_medium: 'partner_referral',
            utm_campaign: 'yelp_integration'
        });
        
        return `${baseUrl}?${utmParams.toString()}`;
    }
    
    startCountdown() {
        // Start countdown immediately
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
    
    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
    
    setupEventListeners() {
        // Manual redirect button
        if (this.manualRedirectBtn) {
            this.manualRedirectBtn.addEventListener('click', () => {
                this.clearCountdown();
                this.proceedToZocdoc();
            });
        }
        
        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.clearCountdown();
                this.proceedToZocdoc();
            }
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, pause countdown
                this.clearCountdown();
                console.log('Page hidden - countdown paused');
            } else {
                // Page is visible again, restart countdown if not already redirected
                if (this.countdownSeconds > 0) {
                    this.startCountdown();
                    console.log('Page visible - countdown resumed');
                }
            }
        });
    }
    
    preloadImages() {
        // Preload brand logos to ensure they display immediately
        const imagesToPreload = [
            'assets/yelp-logo.svg',
            'assets/zocdoc-logo.svg'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    proceedToZocdoc() {
        // Clear any remaining countdown
        this.clearCountdown();
        
        // Show loading state
        this.showRedirectingState();
        
        // Add slight delay for UX smoothness
        setTimeout(() => {
            // Attempt to open in same window
            try {
                window.location.href = this.redirectUrl;
            } catch (error) {
                console.error('Redirect error:', error);
                // Fallback: show manual link
                this.showManualRedirectFallback();
            }
        }, 500);
    }
    
    showRedirectingState() {
        const manualBtn = document.querySelector('.manual-redirect-btn');
        const countdownDisplay = document.getElementById('countdown-text');
        
        // Keep title unchanged - only update countdown and button state
        
        if (countdownDisplay) {
            countdownDisplay.textContent = 'Redirecting...';
            countdownDisplay.style.color = '#727272';
        }
        
        if (manualBtn) {
            // Keep button text as "Book on Zocdoc" - only disable and style it
            manualBtn.disabled = true;
            manualBtn.style.opacity = '0.7';
            manualBtn.style.background = '#e5e7eb';
            manualBtn.style.color = '#9ca3af';
        }
    }
    
    showManualRedirectFallback() {
        const container = document.querySelector('.container');
        const fallbackHtml = `
            <div class="fallback-container" style="text-align: center; padding: 2rem;">
                <h2 style="color: #dc2626; margin-bottom: 1rem;">Redirect Failed</h2>
                <p style="margin-bottom: 2rem; color: #64748b;">
                    We couldn't automatically redirect you to Zocdoc. Please click the link below:
                </p>
                <a href="${this.redirectUrl}" 
                   style="display: inline-block; background: #1e40af; color: white; padding: 1rem 2rem; 
                          border-radius: 8px; text-decoration: none; font-weight: 500;">
                    Continue to Zocdoc
                </a>
                <p style="margin-top: 1rem; font-size: 0.875rem; color: #9ca3af;">
                    Or copy this link: <br>
                    <code style="background: #f3f4f6; padding: 0.25rem; border-radius: 4px; font-size: 0.75rem;">
                        ${this.redirectUrl}
                    </code>
                </p>
            </div>
        `;
        
        if (container) {
            container.innerHTML = fallbackHtml;
        }
    }
    
    trackPageView() {
        // Analytics tracking (placeholder for future implementation)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Yelp to Zocdoc Auto-Transition',
                page_location: window.location.href
            });
        }
        
        // Console log for debugging
        console.log('Auto-redirect interstitial page loaded', {
            redirectUrl: this.redirectUrl,
            countdownSeconds: this.countdownSeconds,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }
}

// Global function for manual redirect (called by HTML button)
function proceedToZocdoc() {
    if (window.autoInterstitialPage) {
        window.autoInterstitialPage.proceedToZocdoc();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.autoInterstitialPage = new AutoInterstitialPage();
});

// Handle page load errors gracefully
window.addEventListener('error', (e) => {
    console.error('Page error:', e.error);
    
    // Show simplified fallback if there are JavaScript errors
    const fallbackMessage = document.createElement('div');
    fallbackMessage.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; background: #fee2e2; color: #dc2626; 
                    padding: 1rem; border-radius: 8px; border: 1px solid #fecaca; font-size: 0.875rem;">
            <strong>Notice:</strong> If you're not redirected automatically, 
            <a href="https://www.zocdoc.com" style="color: #1e40af; text-decoration: underline;">
                click here to visit Zocdoc
            </a>
        </div>
    `;
    
    document.body.appendChild(fallbackMessage);
    
    // Auto-hide the error message after 10 seconds
    setTimeout(() => {
        if (fallbackMessage.parentNode) {
            fallbackMessage.parentNode.removeChild(fallbackMessage);
        }
    }, 10000);
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AutoInterstitialPage };
}
