export async function getStaffMedia() {
  try {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${api_url}events/api/team-events/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch staff media");
    }
    const data = await response.json();
    console.log("data", data.results);
    return data.results;
  } catch (error) {
    console.error("Error fetching staff media:", error);
    return [];
  }
}

export async function getClubMedia() {
  try {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${api_url}events/api/activities/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch club media");
    }
    const data = await response.json();
    console.log("data", data.results);
    return data.results;
  } catch (error) {
    console.error("Error fetching club media:", error);
    return [];
  }
}
