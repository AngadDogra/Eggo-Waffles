class Auth {
  static async hashPassword(password) {
    // Convert password to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async signUp(username, password) {
    const users = (await chrome.storage.local.get('users')).users || {};
    if (users[username]) throw new Error("Username exists");
    
    users[username] = {
      password: await this.hashPassword(password),
      session: true
    };
    
    await chrome.storage.local.set({ users });
    return true;
  }

  static async login(username, password) {
    const users = (await chrome.storage.local.get('users')).users || {};
    const user = users[username];
    
    if (user && user.password === await this.hashPassword(password)) {
      user.session = true;
      await chrome.storage.local.set({ users });
      return true;
    }
    throw new Error("Invalid credentials");
  }

  static async checkSession() {
    const users = (await chrome.storage.local.get('users')).users || {};
    for (const [username, data] of Object.entries(users)) {
      if (data.session) return username;
    }
    return null;
  }

  static async logout() {
    const users = (await chrome.storage.local.get('users')).users || {};
    for (const user of Object.values(users)) {
      user.session = false;
    }
    await chrome.storage.local.set({ users });
  }
}