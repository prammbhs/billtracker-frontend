/**
 * Enhanced voice support for BillTracker AI
 */

class EnhancedVoice {
    constructor() {
        // Check if we already have an instance to prevent duplicates
        if (window._enhancedVoiceInstance) {
            console.log("EnhancedVoice instance already exists, returning existing instance");
            return window._enhancedVoiceInstance;
        }
        
        this.synthesis = window.speechSynthesis;
        this.voice = null;
        this.rate = 1.0;
        this.pitch = 1.0;
        this.volume = 1.0;  // Default volume
        this.speaking = false;
        this.voicePreference = localStorage.getItem('preferredVoice');
        this.availableVoices = [];
        
        // Initialize voices when available
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = this.loadVoices.bind(this);
        }
        this.loadVoices();
        
        // Load saved settings
        this.loadSettings();
        
        // Store instance globally for consistent access
        window._enhancedVoiceInstance = this;
        
        console.log("EnhancedVoice initialized with volume:", this.volume);
    }
    
    loadVoices() {
        this.availableVoices = this.synthesis.getVoices();
        console.log("Available voices loaded:", this.availableVoices.length);
        
        // Log all available voices for debugging
        this.availableVoices.forEach(voice => {
            console.log(`Voice: ${voice.name}, Lang: ${voice.lang}`);
        });
        
        // HARD-CODED: Always try to find Microsoft Aria first
        const ariaVoice = this.findAriaVoice();
        if (ariaVoice) {
            this.voice = ariaVoice;
            console.log("Using Microsoft Aria voice:", this.voice.name);
            
            // Save this as the preferred voice
            localStorage.setItem('preferredVoice', this.voice.name);
            
            return;
        }
        
        // Premium voices as fallback if no Aria voice is found
        const premiumVoices = [
            'Google UK English Female', 
            'Google US English Female',
            'Microsoft Zira Desktop',
            'Microsoft Hazel Desktop',
            'Daniel (Enhanced)',
            'Samantha (Enhanced)'
        ];
        
        // Standard good voices as fallback
        const goodVoices = [
            'Samantha',
            'Karen',
            'Moira',
            'Tessa',
            'Fiona',
            'Veena',
            'Alex'
        ];
        
        // Try to use the user's previously selected voice only if it's not already an Aria voice
        if (this.voicePreference) {
            const savedVoice = this.availableVoices.find(v => v.name === this.voicePreference);
            if (savedVoice) {
                this.voice = savedVoice;
                console.log("Using preferred voice:", this.voice.name);
                return;
            }
        }
        
        // Try premium voices first with more robust matching
        for (const voiceName of premiumVoices) {
            // Try exact match first
            let voice = this.availableVoices.find(v => v.name === voiceName);
            
            // If not found, try partial match (especially for Aria voices which may have different naming)
            if (!voice && voiceName.includes("Aria")) {
                voice = this.availableVoices.find(v => 
                    v.name.includes("Aria") && 
                    (v.name.includes("Natural") || v.lang.includes("en"))
                );
            }
            
            if (voice) {
                this.voice = voice;
                console.log("Using premium voice:", this.voice.name);
                return;
            }
        }
        
        // Fall back to good standard voices
        for (const voiceName of goodVoices) {
            const voice = this.availableVoices.find(v => v.name === voiceName);
            if (voice) {
                this.voice = voice;
                console.log("Using standard voice:", this.voice.name);
                return;
            }
        }
        
        // If no preferred voices found, use the first available English voice
        const englishVoice = this.availableVoices.find(v => v.lang.includes('en-'));
        if (englishVoice) {
            this.voice = englishVoice;
            console.log("Using English voice:", this.voice.name);
        } else if (this.availableVoices.length > 0) {
            this.voice = this.availableVoices[0]; // Last resort
            console.log("Using default voice:", this.voice.name);
        }
        
        // Dispatch an event when voices are loaded
        const event = new CustomEvent('voicesloaded', { 
            detail: { voices: this.availableVoices } 
        });
        document.dispatchEvent(event);
    }
    
    // New method to specifically find Microsoft Aria voices
    findAriaVoice() {
        // Try to find Aria by exact name match first
        const exactAriaNames = [
            'Microsoft Aria Online (Natural) - English (United States)',
            'Microsoft Aria Online (Natural)',
            'Microsoft Aria Online',
            'Microsoft Aria'
        ];
        
        for (const name of exactAriaNames) {
            const voice = this.availableVoices.find(v => v.name === name);
            if (voice) {
                console.log(`Found exact Aria match: ${voice.name}`);
                return voice;
            }
        }
        
        // Try to find by partial match
        const ariaVoice = this.availableVoices.find(v => 
            v.name.includes("Aria") && v.lang.includes("en")
        );
        
        if (ariaVoice) {
            console.log(`Found Aria by partial match: ${ariaVoice.name}`);
            return ariaVoice;
        }
        
        // If no matching Aria voice, find any Microsoft voice with English
        const microsoftVoice = this.availableVoices.find(v => 
            v.name.includes("Microsoft") && v.lang.includes("en")
        );
        
        if (microsoftVoice) {
            console.log(`No Aria found, using Microsoft voice: ${microsoftVoice.name}`);
            return microsoftVoice;
        }
        
        console.log("No Microsoft Aria or similar voice found");
        return null;
    }
    
    speak(text) {
        if (!this.synthesis || !text) return;
        
        // Ensure we're using the correct voice (preferably Aria)
        // If current voice is not Aria, try to find an Aria voice
        if (this.voice && !this.voice.name.includes("Aria")) {
            const ariaVoice = this.findAriaVoice();
            if (ariaVoice) {
                console.log("Switching to Aria voice for speech");
                this.voice = ariaVoice;
            }
        }
        
        console.log("Speaking with voice:", this.voice ? this.voice.name : "default");
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        // Process text to sound more natural
        const processedText = this.processTextForSpeech(text);
        
        // Split into sentences for more natural pauses
        const sentences = this.splitIntoSentences(processedText);
        
        // Track that we're speaking
        this.speaking = true;
        
        // Dispatch speech start event
        const startEvent = new CustomEvent('speechstart');
        document.dispatchEvent(startEvent);
        
        // Force volume level to be set properly - convert to numeric value
        const volumeLevel = Math.min(Math.max(parseFloat(this.volume) || 1.0, 0.1), 1.0);
        console.log(`Using volume level: ${volumeLevel}`);
        
        sentences.forEach((sentence, index) => {
            if (!sentence.trim()) return;
            
            const utterance = new SpeechSynthesisUtterance(sentence);
            
            // Set voice and parameters
            if (this.voice) {
                utterance.voice = this.voice;
                console.log("Using voice:", this.voice.name);
            }
            
            // Ensure numeric values for all speech parameters
            utterance.rate = parseFloat(this.rate) || 1.0;
            utterance.pitch = parseFloat(this.pitch) || 1.0;
            
            // Apply volume with special handling for Microsoft Aria
            utterance.volume = volumeLevel;
            
            // Special handling for Microsoft Aria voices which may need higher volume
            if (this.voice && this.voice.name.includes("Aria")) {
                // Compensate for Aria's sometimes lower volume
                const ariaVolumeBoost = Math.min(volumeLevel * 1.25, 1.0);
                utterance.volume = ariaVolumeBoost;
                console.log(`Applied Aria volume boost: ${ariaVolumeBoost}`);
            }
            
            console.log(`Speech settings: rate=${utterance.rate}, pitch=${utterance.pitch}, volume=${utterance.volume}`);
            
            // Add slight pause between sentences
            utterance.onend = () => {
                if (index < sentences.length - 1) {
                    setTimeout(() => {}, 250);
                } else {
                    this.speaking = false;
                    
                    // Dispatch speech end event
                    const endEvent = new CustomEvent('speechend');
                    document.dispatchEvent(endEvent);
                }
            };
            
            utterance.onstart = () => {
                this.speaking = true;
                
                // Debug: verify volume setting is applied
                console.log(`Speech started with volume: ${utterance.volume}`);
            };
            
            // Add to speech queue
            this.synthesis.speak(utterance);
        });
    }
    
    processTextForSpeech(text) {
        // Clean up the text for better pronunciation
        let processedText = text
            // Remove markdown formatting
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            
            // Handle code blocks
            .replace(/```[\s\S]*?```/g, 'I\'ve provided some code in my response.')
            
            // Fix spacing issues
            .replace(/\s+/g, ' ')
            
            // Improve natural pauses with commas
            .replace(/(\d+)\.(\d+)/g, '$1 point $2') // Convert decimals to words
            .replace(/(\d{4,})/g, (match) => match.replace(/(\d)(?=(\d{3})+$)/g, '$1,')) // Add commas in large numbers
            
            // Fix abbreviations for better pronunciation
            .replace(/(\b[A-Z]{2,}\b)/g, (match) => {
                // Handle common acronyms
                if (match === 'API') return 'A P I';
                if (match === 'HTML') return 'H T M L';
                if (match === 'CSS') return 'C S S';
                if (match === 'JS') return 'JavaScript';
                if (match === 'UI') return 'U I';
                if (match === 'UX') return 'U X';
                return match;
            })
            
            // Add pauses for better rhythm
            .replace(/([.!?])\s+/g, '$1. ') // Add slight pause after sentences
            .replace(/([,;:])\s+/g, '$1 '); // Brief pause after commas
        
        return processedText;
    }
    
    splitIntoSentences(text) {
        // Split text into sentences for better pacing
        return text.split(/(?<=[.!?])\s+/);
    }
    
    stop() {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.speaking = false;
            
            // Dispatch speech end event
            const endEvent = new CustomEvent('speechend');
            document.dispatchEvent(endEvent);
        }
    }
    
    setVoice(voiceName) {
        console.log("Setting voice to:", voiceName);
        const newVoice = this.availableVoices.find(v => v.name === voiceName);
        if (newVoice) {
            this.voice = newVoice;
            localStorage.setItem('preferredVoice', voiceName);
            console.log("Voice set successfully to:", voiceName);
            return true;
        }
        console.warn("Voice not found:", voiceName);
        return false;
    }
    
    getVoices() {
        // Force refresh voices if the list is empty
        if (!this.availableVoices || this.availableVoices.length === 0) {
            this.availableVoices = this.synthesis.getVoices();
        }
        return this.availableVoices || [];
    }
    
    getCurrentVoice() {
        return this.voice ? this.voice.name : null;
    }
    
    adjustSettings(settings) {
        if (settings.rate !== undefined) this.rate = parseFloat(settings.rate) || 1.0;
        if (settings.pitch !== undefined) this.pitch = parseFloat(settings.pitch) || 1.0;
        if (settings.volume !== undefined) {
            this.volume = parseFloat(settings.volume) || 1.0;
            console.log(`Volume adjusted to: ${this.volume}`);
        }
        
        // Save settings to localStorage
        localStorage.setItem('voiceSettings', JSON.stringify({
            rate: this.rate,
            pitch: this.pitch,
            volume: this.volume
        }));
        
        console.log(`Settings saved: rate=${this.rate}, pitch=${this.pitch}, volume=${this.volume}`);
    }
    
    loadSettings() {
        try {
            const settings = localStorage.getItem('voiceSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.rate = parseFloat(parsed.rate) || 1.0;
                this.pitch = parseFloat(parsed.pitch) || 1.0;
                this.volume = parseFloat(parsed.volume) || 1.0;
                console.log(`Loaded settings: rate=${this.rate}, pitch=${this.pitch}, volume=${this.volume}`);
            } else {
                // If no settings are saved, use defaults with higher volume for Aria
                this.rate = 1.0;
                this.pitch = 1.0;
                this.volume = 1.0;
                console.log("No saved settings found, using defaults");
            }
        } catch (e) {
            console.error('Error parsing voice settings', e);
            // Reset to defaults
            this.rate = 1.0;
            this.pitch = 1.0;
            this.volume = 1.0;
        }
    }
}

// Static function to get the global instance
EnhancedVoice.getInstance = function() {
    return window._enhancedVoiceInstance || null;
};

// Export for global use
window.EnhancedVoice = EnhancedVoice;

// Call getVoices once to trigger onvoiceschanged in some browsers
if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    console.log("Initial voices requested");
}

// Create a single instance on script load to ensure it's ready
document.addEventListener('DOMContentLoaded', function() {
    if (!window._enhancedVoiceInstance) {
        window._enhancedVoiceInstance = new EnhancedVoice();
    }
});

// Make sure we create the instance early to catch all voice events
if (window.speechSynthesis && !window._enhancedVoiceInstance) {
    console.log("Creating EnhancedVoice instance immediately");
    window._enhancedVoiceInstance = new EnhancedVoice();
    
    // Force voice refresh after a short delay (helps on some browsers)
    setTimeout(() => {
        if (window._enhancedVoiceInstance) {
            window._enhancedVoiceInstance.loadVoices();
        }
    }, 500);
}

// Force voice refresh immediately and after a delay 
// to ensure Aria voice is found across different browsers
if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    console.log("Initial voices requested");
    
    // Some browsers need multiple attempts to load voices
    [100, 500, 1000].forEach(delay => {
        setTimeout(() => {
            if (window._enhancedVoiceInstance) {
                console.log(`Refreshing voices after ${delay}ms delay`);
                window._enhancedVoiceInstance.loadVoices();
                
                // Make sure volume is properly set
                const settings = localStorage.getItem('voiceSettings');
                if (settings) {
                    try {
                        const parsed = JSON.parse(settings);
                        if (parsed.volume) {
                            window._enhancedVoiceInstance.volume = parseFloat(parsed.volume);
                            console.log(`Restored volume setting: ${window._enhancedVoiceInstance.volume}`);
                        }
                    } catch (e) {
                        console.error("Error restoring volume setting", e);
                    }
                }
            }
        }, delay);
    });
}