/**
 * API Route Template for Aviary Manager
 * 
 * This file demonstrates how to create API routes for CRUD operations
 * on your database tables. Copy and adapt this template for your needs.
 * 
 * Routes follow the pattern: /api/[resource]
 * Methods: GET (list/retrieve), POST (create), PUT (update), DELETE (remove)
 */

// Example: GET /api/birds
// Returns all birds for the authenticated user

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all birds for the user
  const { data, error } = await supabase
    .from("birds")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Example: POST /api/birds
// Create a new bird record

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("birds")
    .insert({
      user_id: user.id,
      name: body.name,
      species_id: body.species_id,
      cage_id: body.cage_id || null,
      leg_ring: body.leg_ring || null,
      sex: body.sex || null,
      date_of_birth: body.date_of_birth || null,
      color_mutation: body.color_mutation || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

/*
 * Additional API Route Templates
 * 
 * 1. GET /api/birds/[id] - Retrieve a specific bird
 * 2. PUT /api/birds/[id] - Update a bird
 * 3. DELETE /api/birds/[id] - Delete a bird
 * 4. GET /api/cages - Get all cages
 * 5. POST /api/cages - Create a new cage
 * 6. GET /api/breeding-pairs - Get all breeding pairs
 * 7. POST /api/tasks - Create a task
 * 8. PUT /api/tasks/[id] - Mark task as complete
 * 
 * File structure example:
 * src/app/api/
 * ├── birds/
 * │   ├── route.ts           (GET, POST for all birds)
 * │   └── [id]/route.ts      (GET, PUT, DELETE for specific bird)
 * ├── cages/
 * │   ├── route.ts
 * │   └── [id]/route.ts
 * ├── tasks/
 * │   ├── route.ts
 * │   └── [id]/route.ts
 * └── upload/
 *     └── route.ts           (File upload for photos)
 */

// Template for route with ID parameter
/*
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("birds")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("birds")
    .update(body)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("birds")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
*/
