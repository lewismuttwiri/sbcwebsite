import toast from "react-hot-toast";

export const getAllJobs = async () => {
  try {
    console.log("Fetching jobs from:", "/api/careers/");
    const response = await fetch("/api/careers/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to fetch jobs. Status:",
        response.status,
        "Response:",
        errorText
      );
      throw new Error(
        `Failed to fetch jobs: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log("Jobs data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const getJobById = async (id: string) => {
  try {
    const response = await fetch(`/api/careers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch job");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error fetching job:", error);
    return [];
  }
};

export const applyForJob = async (id: string) => {
  try {
    const response = await fetch(`/api/careers/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to apply for job");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error applying for job:", error);
    return [];
  }
};

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await response.json();
  }
  const text = await response.text();
  return {
    error: response.statusText,
    status: response.status,
    details: text.includes("<!DOCTYPE")
      ? "Received HTML response. Check if the backend is running correctly."
      : text,
  };
}

export const createJob = async (jobData: any) => {
  console.log("Job data to create:", jobData);
  try {
    const response = await fetch("/api/careers/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(jobData),
    });

    const responseData = await parseResponse(response);

    if (!response.ok) {
      console.error("Backend error response:", responseData);
      const errorMessage =
        responseData.error ||
        responseData.detail ||
        responseData.message ||
        `Failed to create job (Status: ${response.status})`;
      throw new Error(errorMessage);
    }

    toast.success("Job created successfully");
    return responseData;
  } catch (error) {
    console.error("Error creating job:", error);
    toast.error("Failed to create job. Please check the console for details.");
    throw error;
  }
};
