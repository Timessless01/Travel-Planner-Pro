class TabSaverPro {
  constructor() {
    this.init();
  }

  init = async () => {
    this.setupEventListeners();
    await this.loadTabs();
    this.checkPaymentStatus();
  };

  setupEventListeners = () => {
    document.getElementById('addTabs').addEventListener('click', () => this.saveTabs());
  };

  checkPaymentStatus = async () => {
    const { isPaid } = await chrome.storage.local.get('isPaid');
    if (!isPaid) this.showPaymentButton();
  };

  showPaymentButton = () => {
    const btn = document.createElement('button');
    btn.className = 'upgrade-btn';
    btn.innerHTML = `<i class="fas fa-crown"></i> Upgrade to Pro`;
    btn.onclick = () => extpay.openPaymentPage();
    document.body.appendChild(btn);
  };

  saveTabs = async () => {
    const { isPaid } = await chrome.storage.local.get('isPaid');
    let { savedTabs = [] } = await chrome.storage.local.get('savedTabs');
    
    // Enforce 3-tab limit
    if (!isPaid && savedTabs.length >= 3) {
      alert('Free users can only save 3 tabs. Upgrade to Pro!');
      return;
    }

    const newTabs = await chrome.tabs.query({});
    savedTabs = savedTabs.concat(newTabs.map(tab => ({
      id: tab.id,
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl
    }))).slice(0, isPaid ? Infinity : 3); // Hard limit

    await chrome.storage.local.set({ savedTabs });
    this.renderTabs(savedTabs);
  };

  // ... rest of class remains same ...
}