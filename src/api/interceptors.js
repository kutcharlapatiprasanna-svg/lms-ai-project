  export function setupInterceptors(instance) {
    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");

        // Attach the login token only when one exists.
      if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // The server responded with an unsuccessful status.
          if (error.response.status === 401) {
            // Do not automatically log out here.
            // The login or activation screen may also receive a 401.
          }
        } else if (error.request) {
          // The request was sent but no response was received.
          error.message = "Unable to connect to the server. Please try again.";
        }

        return Promise.reject(error);
      }
    );
  }