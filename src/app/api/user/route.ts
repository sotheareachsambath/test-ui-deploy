export async function GET() {
  try {
    const res = await fetch(
      "https://test-deply-node-production.up.railway.app/user",
    );
    if (!res.ok) {
      throw new Error("Failed to fetch from external API");
    }
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(
      "https://test-deply-node-production.up.railway.app/user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      throw new Error("Failed to create user");
    }
    const data = await res.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
