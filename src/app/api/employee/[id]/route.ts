import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await fetch(
      `https://test-deply-node-production.up.railway.app/employee/${id}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch employee");
    }
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return Response.json(
      { error: "Failed to fetch employee" },
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
      `https://test-deply-node-production.up.railway.app/employee/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      throw new Error("Failed to update employee");
    }
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error updating employee:", error);
    return Response.json(
      { error: "Failed to update employee" },
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
      `https://test-deply-node-production.up.railway.app/employee/${id}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      throw new Error("Failed to delete employee");
    }
    return Response.json({ message: "Employee deleted" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return Response.json(
      { error: "Failed to delete employee" },
      { status: 500 },
    );
  }
}
