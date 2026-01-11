const API_BASE_URL = "http://localhost:8000/api";

// Shared fetch helper with error handling
async function fetchAPI(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {
      // fallback if response is not json
    }

    let message = "Request failed";

    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        // Join validation error messages into one string
        message = errorData.detail.map(err => err.msg).join(", ");
      } else if (typeof errorData.detail === "string") {
        message = errorData.detail;
      }
    }

    throw new Error(message);
  }

  // Sometimes backend might return empty response for some calls
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// Signup user
export async function signup(userData) {
  return fetchAPI(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
}

// Login user
export async function login(credentials) {
  return fetchAPI(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

// Submit complaint (userEmail must be included in complaintData)
export async function submitComplaint(complaintData, token) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetchAPI(`${API_BASE_URL}/complaints`, {
    method: "POST",
    headers,
    body: JSON.stringify(complaintData),
  });
}

// Get complaints list, optionally filtered by userEmail
export async function getComplaints(userEmail = null, token) {
  let url = `${API_BASE_URL}/complaints`;
  if (userEmail) {
    url += `?userEmail=${encodeURIComponent(userEmail)}`;
  }

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetchAPI(url, {
    method: "GET",
    headers,
  });
}

// Forgot Password
export async function forgotPassword(email) {
  return fetchAPI(`${API_BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

// Reset Password
export async function resetPassword(token, password) {
  return fetchAPI(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
}
