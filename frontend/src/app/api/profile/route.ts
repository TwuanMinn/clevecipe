import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
    try {
        // Get auth header
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Missing authorization header" },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // Verify the token and get user
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            // Profile might not exist yet, return basic user info
            return NextResponse.json({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || user.email?.split("@")[0],
                created_at: user.created_at,
            });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Missing authorization header" },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate and sanitize input
        const allowedFields = [
            "name",
            "avatar_url",
            "bio",
            "dietary_preferences",
            "allergies",
            "health_goals",
            "daily_calorie_target",
            "daily_protein_target",
            "daily_carbs_target",
            "daily_fat_target",
            "measurement_unit",
        ];

        const updateData: Record<string, unknown> = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        updateData.updated_at = new Date().toISOString();

        // Update profile
        const { data: profile, error: updateError } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                email: user.email,
                ...updateData,
            })
            .select()
            .single();

        if (updateError) {
            console.error("Profile update error:", updateError);
            return NextResponse.json(
                { error: "Failed to update profile" },
                { status: 500 }
            );
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
