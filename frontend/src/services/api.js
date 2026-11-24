import axios from 'axios';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Extract a user-friendly error message and field-level validation map
 * from an Axios / FastAPI error response.
 */
export function parseApiError(error) {
  if (!error.response) {
    return {
      message:
        'Unable to reach the server. Please verify the FastAPI backend is running.',
      fieldErrors: {},
    };
  }

  const { data, status } = error.response;
  const fieldErrors = data?.errors && typeof data.errors === 'object' ? { ...data.errors } : {};

  let message = 'An unexpected error occurred. Please try again.';

  if (typeof data?.detail === 'string') {
    message = data.detail;
  } else if (Array.isArray(data?.detail) && data.detail.length > 0) {
    const first = data.detail[0];
    message = first?.msg?.replace(/^Value error,\s*/i, '') || 'Validation error.';
    data.detail.forEach((item) => {
      const loc = Array.isArray(item.loc)
        ? item.loc.filter((p) => !['body', 'query', 'path'].includes(p))
        : [];
      const key = loc[loc.length - 1];
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = item.msg?.replace(/^Value error,\s*/i, '') || 'Invalid value.';
      }
    });
  } else if (status === 404) {
    message = 'The requested patient record could not be found.';
  } else if (status >= 500) {
    message = 'A server error occurred while processing the request.';
  }

  return { message, fieldErrors };
}

export default api;
