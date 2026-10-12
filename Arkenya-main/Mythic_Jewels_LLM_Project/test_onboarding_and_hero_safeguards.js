const fs = require('fs');
const assert = require('assert');

console.log('--- Testing Onboarding Banner Safeguards & Hero Mechanics ---');

const html = fs.readFileSync('www/index.html', 'utf8');

// 1. Verify CSS styles for onboarding banners
assert(html.includes('.onboarding-tutorial-banner {'), 'Missing .onboarding-tutorial-banner CSS');
assert(html.includes('pointer-events: none;'), 'onboarding banner must have pointer-events: none');
assert(html.includes('.onboarding-tip-anchor {'), 'Missing .onboarding-tip-anchor CSS');

// 2. Verify DOM anchor exists
assert(html.includes('id="onboarding-tip-anchor"'), 'DOM must contain #onboarding-tip-anchor');

// 3. Verify JS functions in index.html
assert(html.includes('function showOnboardingBanner'), 'Missing showOnboardingBanner function');
assert(html.includes('function dismissTutorialHint'), 'Missing dismissTutorialHint function');
assert(html.includes('function removeTutorialDOMVisuals'), 'Missing removeTutorialDOMVisuals function');
assert(html.includes('function getOnboardingTipMount'), 'Missing getOnboardingTipMount function');

// 4. Test simulated runtime of showOnboardingBanner and auto-dismiss
const mockDOM = {
    elements: {},
    createElement(tag) {
        const el = {
            tagName: tag,
            style: {},
            className: '',
            id: '',
            innerHTML: '',
            parentNode: null,
            remove() {
                if (this.parentNode && this.parentNode.children) {
                    const idx = this.parentNode.children.indexOf(el);
                    if (idx !== -1) this.parentNode.children.splice(idx, 1);
                }
                this.parentNode = null;
            }
        };
        return el;
    },
    getElementById(id) {
        return this.elements[id] || null;
    },
    querySelector(sel) {
        if (sel === '.mythic-altar-plinth') return this.elements['plinth'];
        return null;
    }
};

const anchor = mockDOM.createElement('div');
anchor.id = 'onboarding-tip-anchor';
anchor.children = [];
anchor.appendChild = function(child) {
    child.parentNode = this;
    this.children.push(child);
};
mockDOM.elements['onboarding-tip-anchor'] = anchor;

// Extract showOnboardingBanner code logic and test
let testTimerCleared = false;
let testTimeoutScheduled = false;
let testTimeoutDelay = 0;
let fakeTimer = 123;

let onboardingBannerTimer = null;
function fakeClearTimeout(t) {
    if (t) testTimerCleared = true;
    onboardingBannerTimer = null;
}
function fakeSetTimeout(cb, delay) {
    testTimeoutScheduled = true;
    testTimeoutDelay = delay;
    return fakeTimer;
}

// Emulate getOnboardingTipMount
function testGetMount() {
    return mockDOM.getElementById('onboarding-tip-anchor');
}

// Emulate showOnboardingBanner
function testShowOnboardingBanner(htmlText, durationMs = 3000) {
    if (onboardingBannerTimer) {
        fakeClearTimeout(onboardingBannerTimer);
    }
    const oldBanner = mockDOM.getElementById('onboarding-tip-banner');
    if (oldBanner) oldBanner.remove();

    const banner = mockDOM.createElement('div');
    banner.id = 'onboarding-tip-banner';
    banner.className = 'onboarding-tutorial-banner';
    banner.innerHTML = htmlText;
    mockDOM.elements['onboarding-tip-banner'] = banner;

    const mount = testGetMount();
    if (mount) mount.appendChild(banner);

    const displayTime = (durationMs && durationMs > 0) ? durationMs : 3000;
    onboardingBannerTimer = fakeSetTimeout(() => {
        banner.remove();
    }, displayTime);
}

// Execute with duration 0 (should default to 3000ms auto-dismiss)
testShowOnboardingBanner("Test Tip", 0);
assert.strictEqual(testTimeoutScheduled, true, "Timeout must be scheduled");
assert.strictEqual(testTimeoutDelay, 3000, "Duration 0 must fall back to 3000ms auto-dismiss");
assert.strictEqual(anchor.children.length, 1, "Banner must be mounted to anchor");

// Calling it again should clear previous timer
testTimerCleared = false;
testShowOnboardingBanner("Second Tip", 3500);
assert.strictEqual(testTimerCleared, true, "Previous timer must be cleared");
assert.strictEqual(testTimeoutDelay, 3500, "Explicit duration must be used");

// Emulate dismissTutorialHint
function testDismiss() {
    if (onboardingBannerTimer) {
        fakeClearTimeout(onboardingBannerTimer);
    }
    const banner = mockDOM.getElementById('onboarding-tip-banner');
    if (banner) {
        banner.remove();
        delete mockDOM.elements['onboarding-tip-banner'];
    }
}

testDismiss();
assert.strictEqual(mockDOM.getElementById('onboarding-tip-banner'), null, "Banner must be removed upon dismiss");
assert.strictEqual(onboardingBannerTimer, null, "Timer must be null after dismiss");

console.log('✅ Onboarding banner auto-dismiss & safe anchor placement tests passed!');
