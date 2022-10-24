import { useState } from "react";

const useRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const bodySetter = (body, method) => {
    switch (method) {
      case "POST":
        return {
          method,
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        };
      case "DELETE":
        return {
          method,
        };
      case "PATCH":
        return {
          method,
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        };
      default:
        return null;
    }
  };

  const callAPI = async (url, method = "GET", body = null) => {
    console.log("in");
    setIsLoading("true");
    const response = await fetch(url, bodySetter(body, method));
    console.log(response);
    setIsLoading(false);
    if (!response.ok) {
      setError("something is wrong");
      throw Error(`something is wrong. ${response.status}`);
    }
    return response.json();
  };

  return {
    isLoading,
    error,
    callAPI,
  };
};

export default useRequest;
