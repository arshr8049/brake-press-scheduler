import { signOut } from 'firebase/auth';

let currentUser = null;
let apiClient = null;
let auth = null;

export function initializeApp({ auth: authInstance, apiClient: clientInstance, user }) {
  auth = authInstance;
  apiClient = clientInstance;
  currentUser = user;
  
  if (user) {
    // User is logged in
    user.getIdToken().then((token) => {
      apiClient.setToken(token);
      loadDashboard();
    });
  } else {
    // User is logged out
    showLoginPage();
  }
}

async function loadDashboard() {
  try {
    // Load all data
    const [machinesRes, partsRes, ordersRes] = await Promise.all([
      apiClient.machines.getAll(),
      apiClient.parts.getAll(),
      apiClient.orders.getAll()
    ]);
    
    renderDashboard({
      machines: machinesRes.data,
      parts: partsRes.data,
      orders: ordersRes.data
    });
  } catch (error) {
    console.error('Failed to load data:', error);
    alert('Error loading data: ' + error.message);
  }
}

function renderDashboard(data) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1>🏭 Brake Press Scheduler</h1>
        <button onclick="logout()" style="padding: 8px 16px; background: #991b1b; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Logout
        </button>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2>Dashboard</h2>
        <p>Total Machines: ${data.machines.length}</p>
        <p>Total Parts: ${data.parts.length}</p>
        <p>Total Orders: ${data.orders.length}</p>
        
        <h3 style="margin-top: 20px;">Orders Status</h3>
        <ul>
          ${data.orders.map(o => `
            <li>${o.num} - ${o.status} (Due: ${o.due})</li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
  
  // Make logout function global
  window.logout = logout;
}

function showLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f7f7f7;">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%; max-width: 400px;">
        <h1 style="text-align: center; margin-bottom: 30px;">🏭 Brake Press Scheduler</h1>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">Sign in to get started</p>
        <p style="text-align: center; font-size: 12px; color: #999;">
          This is a demo. Log in with any email/password to get started.
        </p>
      </div>
    </div>
  `;
}

async function logout() {
  try {
    await signOut(auth);
    currentUser = null;
    showLoginPage();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

window.logout = logout;
