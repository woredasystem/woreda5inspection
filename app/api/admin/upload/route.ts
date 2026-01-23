import { NextResponse } from "next/server";
import { uploadDocumentToStorage, saveDocumentMetadata } from "@/lib/uploads";
import { getCurrentUserWoredaId } from "@/lib/supabaseServer";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in to upload files." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    // Support both 'files' (multiple) and 'file' (single) for backward compatibility if needed, 
    // but primarily 'files' from the updated frontend.
    const files = (formData.getAll("files") as File[]).filter(f => f.size > 0);
    // Fallback if 'file' was used
    if (files.length === 0) {
      const singleFile = formData.get("file") as File | null;
      if (singleFile) files.push(singleFile);
    }

    const categoryId = formData.get("category")?.toString();
    const subcategoryCode = formData.get("subcategory")?.toString();
    const year = formData.get("year")?.toString();

    console.log("Upload request received:", {
      fileCount: files.length,
      categoryId,
      subcategoryCode,
      year,
    });

    if (files.length === 0 || !categoryId || !subcategoryCode || !year) {
      return NextResponse.json(
        {
          message: "Missing required upload metadata or no files selected.",
          details: { fileCount: files.length, categoryId, subcategoryCode, year }
        },
        { status: 422 }
      );
    }

    // Get woreda_id from current user's metadata
    const woredaId = await getCurrentUserWoredaId();

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      try {
        // Sanitize filename: replace spaces with underscores and remove non-safe characters
        const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.\-]/g, '');
        const folderPath = `${woredaId}/${categoryId}/${subcategoryCode}/${year}/${safeName}`;

        console.log(`Processing file: ${file.name} -> ${safeName}`);

        const storageUrl = await uploadDocumentToStorage({
          file,
          folderPath,
        });

        await saveDocumentMetadata({
          categoryId,
          subcategoryCode,
          year,
          fileName: safeName, // Use sanitized name in DB
          storageUrl,
          uploaderId: "admin",
        });

        results.push({ fileName: file.name, status: "success", storageUrl });
        successCount++;
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        results.push({
          fileName: file.name,
          status: "error",
          error: error instanceof Error ? error.message : String(error)
        });
        failCount++;
      }
    }

    if (failCount === 0) {
      return NextResponse.json({
        message: `Successfully uploaded ${successCount} document(s).`,
        results
      });
    } else if (successCount > 0) {
      return NextResponse.json({
        message: `Uploaded ${successCount} files, but ${failCount} failed.`,
        results
      }, { status: 207 }); // 207 Multi-Status
    } else {
      return NextResponse.json({
        message: "Failed to upload files.",
        results
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Unhandled error while uploading.";

    return NextResponse.json(
      {
        message: `Upload failed: ${message}`,
        error: message
      },
      { status: 500 }
    );
  }
}


