import { v2 as cloudinary } from "cloudinary"
import { env } from "@/lib/utils/env"

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  file: Buffer,
  options: {
    folder?: string
    publicId?: string
  } = {}
): Promise<{
  success: boolean
  url?: string
  publicId?: string
  error?: string
}> {
  try {
    const result = await new Promise<Record<string, unknown>>(

      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || "outreach-dashboard",
            public_id: options.publicId,
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"))
            } else {
              resolve(result)
            }
          }
        )
        uploadStream.end(file)
      }
    )

    return {
      success: true,
      url: result.secure_url as string,
      publicId: result.public_id as string,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function deleteImage(publicId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}
