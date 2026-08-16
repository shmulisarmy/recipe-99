import { Id } from "../../convex/_generated/dataModel";

export async function UploadFile(uploadUrl:string, capturedImage:Blob) {
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": capturedImage.type },
          body: capturedImage,
        });
        if (!uploadResponse.ok) throw new Error("Could not upload image");

        const { storageId } = await uploadResponse.json() as {
          storageId: Id<"_storage">;
        };
        return storageId;
      }
