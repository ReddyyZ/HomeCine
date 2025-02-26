import ImageUploading from "react-images-uploading";
import Image from "../../../../components/Image";
import { IoCloudUpload } from "react-icons/io5";
import { memo } from "react";

interface ImageSelectorProps {
  setPosterImage: (value: string) => void;
  posterImage: string;
}

function ImageSelector(props: ImageSelectorProps) {
  return (
    <ImageUploading
      value={[]}
      onChange={(imgList) => {
        props.setPosterImage(String(imgList[0].dataURL));
      }}
    >
      {({ onImageUpload, onImageRemove, dragProps, isDragging }) => (
        <div className="upload__image-wrapper">
          <button onClick={onImageUpload} {...dragProps} className="relative">
            <div
              className={`bg-black-opacity absolute h-full w-full ${!isDragging && "hidden"}`}
            />
            {isDragging && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <IoCloudUpload size={24} />
              </div>
            )}
            <Image
              key={props.posterImage}
              src={props.posterImage}
              className="max-h-full"
            />
          </button>
          <div className="mt-2 flex justify-around">
            <button
              onClick={onImageUpload}
              className="bg-cardBg w-full cursor-pointer py-2 transition-opacity hover:opacity-70"
            >
              Update
            </button>
            <button
              onClick={() => {
                props.setPosterImage("");
                onImageRemove(0);
              }}
              className="bg-cardBg w-full cursor-pointer py-2 transition-opacity hover:opacity-70"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </ImageUploading>
  );
}

export default memo(ImageSelector);
