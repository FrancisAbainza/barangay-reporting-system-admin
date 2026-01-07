import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { XIcon } from "lucide-react";
import { FileUploadType } from "@/types/files";

type Props = {
  onImagesChange: (images: FileUploadType[]) => void;
  images: FileUploadType[];
}

export function MultiImageUploader({ onImagesChange, images }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onImagesChange([...images, ...acceptedFiles]);
  }, [images, onImagesChange]);

  const handleDelete = (deletedImageIndex: number) => {
    const updatedImages = images.filter((_, index) => index !== deletedImageIndex);
    onImagesChange(updatedImages);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-dashed border-2 p-6 text-center cursor-pointer rounded-lg"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag & drop images here, or click to select</p>
        )}
      </div>

      <div>
        {images.map((image, index) => (
          <div key={index} className="flex items-center gap-3 border-1 rounded-md shadow-xs overflow-hidden mt-3 pr-3">
            <div className="relative size-16">
              <Image
                src={image instanceof File ? URL.createObjectURL(image) : image}
                alt="post image"
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden py-3">
              <p className="break-all">Image {index + 1}</p>
              {index === 0 && (
                <Badge variant={"outline"}>Featured Image</Badge>
              )}
            </div>
            <button type="button" onClick={() => { handleDelete(index) }}>
              <XIcon className="text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
