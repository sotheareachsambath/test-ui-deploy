import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await fetch(
      `https://test-deply-node-production.up.railway.app/user/${id}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await fetch(
      `https://test-deply-node-production.up.railway.app/user/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      throw new Error("Failed to update user");
    }
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await fetch(
      `https://test-deply-node-production.up.railway.app/user/${id}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      throw new Error("Failed to delete user");
    }
    return Response.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return Response.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
