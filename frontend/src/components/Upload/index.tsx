import { useState, ReactNode, useRef } from "react";
import { IoCloudUpload, IoTrash, IoBug } from "react-icons/io5";
import Input from "../Input";
import colors from "../../constants/colors";
import { VideoMetadata } from "../../types/movies";

export function UploadRoot({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

interface UploadListProps {
  files: File[];
  filesMetadata: Record<string, VideoMetadata>;
  setFileMetadata: (metadata: Record<string, VideoMetadata>) => void;
  onRemove: (index: number) => void;
  isSeries?: boolean;
}

export function UploadList(props: UploadListProps) {
  const handleFileMetadata = (file: File, metadata: VideoMetadata) => {
    props.setFileMetadata({
      ...props.filesMetadata,
      [file.name]: metadata,
    });
  };

  return props.isSeries ? (
    <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-600 max-h-64 space-y-4 overflow-y-auto p-1">
      {props.files.map((file, index) => {
        return (
          <UploadItem
            key={file.name}
            file={file}
            metadata={props.filesMetadata[file.name]}
            onMetadataChange={(metadata) => handleFileMetadata(file, metadata)}
            onRemove={() => props.onRemove(index)}
          />
        );
      })}
    </div>
  ) : (
    <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-600 max-h-64 space-y-4 overflow-y-auto p-1">
      {props.files.map((file, index) => {
        return (
          <div key={file.name} className="relative rounded-sm bg-gray-500 p-4">
            <button
              onClick={() => props.onRemove(index)}
              className="absolute right-4 cursor-pointer transition-opacity duration-200 hover:opacity-70"
            >
              <IoTrash size={20} />
            </button>
            <p className="mb-1 text-sm font-semibold">{file.name}</p>
          </div>
        );
      })}
    </div>
  );
}

interface UploadItemProps {
  file: File;
  metadata: VideoMetadata;
  onMetadataChange: (metadata: VideoMetadata) => void;
  onRemove: () => void;
}

function UploadItem(props: UploadItemProps) {
  const [inputValues, setInputValues] = useState({
    episodeTitle: props.metadata?.episodeTitle ?? "",
    season: props.metadata?.season ?? "",
    episodeNumber: props.metadata?.episodeNumber ?? "",
  });

  return (
    <div className="relative rounded-sm bg-gray-500 p-4">
      <button
        onClick={props.onRemove}
        className="absolute right-4 cursor-pointer transition-opacity duration-200 hover:opacity-70"
      >
        <IoTrash size={20} />
      </button>
      <p className="mb-1 text-sm font-semibold">{props.file.name}</p>
      <div className="flex flex-col gap-3 md:flex-row">
        {/* episode title */}
        <div className="basis-full">
          <label>Episode title</label>
          <Input
            value={inputValues.episodeTitle}
            onChangeText={(value) => {
              setInputValues((prev) => ({
                ...prev,
                episodeTitle: value,
              }));
              props.onMetadataChange({
                ...props.metadata,
                episodeTitle: value,
              });
            }}
            error={inputValues.episodeTitle.length === 0}
          />
        </div>
        {/* season */}
        <div className="flex gap-3">
          <div className="grow">
            <label>Season</label>
            <Input
              value={String(inputValues.season)}
              onChangeText={(value) => {
                setInputValues((prev) => ({
                  ...prev,
                  season: value,
                }));
                props.onMetadataChange({
                  ...props.metadata,
                  season: Number(value),
                });
              }}
              error={String(inputValues.season).length === 0}
            />
          </div>
          {/* episode Number */}
          <div>
            <label htmlFor="">Episode number</label>
            <Input
              value={String(inputValues.episodeNumber)}
              onChangeText={(value) => {
                setInputValues((prev) => ({
                  ...prev,
                  episodeNumber: value,
                }));
                props.onMetadataChange({
                  ...props.metadata,
                  episodeNumber: Number(value),
                });
              }}
              error={String(inputValues.episodeNumber).length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export type FilterCallback = (
  files: FileList,
  isValid: boolean,
  error?: string,
) => void;
interface UploadFieldProps {
  onUpload: (
    files: File[],
    filesMetadata: Record<string, VideoMetadata>,
  ) => void;
  filter?: (files: FileList, callback: FilterCallback) => void;
  multiple?: boolean;
}

export function UploadField({
  onUpload,
  filter,
  multiple = true,
}: UploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filterCallback = (
    files: FileList,
    isValid: boolean,
    error?: string,
  ) => {
    if (!isValid) {
      setFileErrorMessage(error ?? "File type not allowed");
      return;
    }

    setFileErrorMessage("");

    const filesMetadata = Array.from(files).reduce(
      (acc, file) => {
        acc[file.name] = {
          episodeTitle: file.name.replace(/\.[^/.]+$/, ""),
          season: 1,
        };
        return acc;
      },
      {} as Record<string, VideoMetadata>,
    );

    onUpload(Array.from(files), filesMetadata);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    if (files.length > 0) {
      if (!multiple && files.length > 1) {
        setFileErrorMessage("Only one file allowed");
        return;
      }
      if (filter) {
        filter(files, filterCallback);
      } else {
        setFileErrorMessage("");

        const filesMetadata = Array.from(files).reduce(
          (acc, file) => {
            acc[file.name] = {
              episodeTitle: file.name.replace(/\.[^/.]+$/, ""),
              season: 1,
            };
            return acc;
          },
          {} as Record<string, VideoMetadata>,
        );

        onUpload(Array.from(files), filesMetadata);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      if (!multiple && droppedFiles.length > 1) {
        setFileErrorMessage("Only one file allowed");
        return;
      }
      if (filter) {
        filter(droppedFiles, filterCallback);
      } else {
        setFileErrorMessage("");

        const filesMetadata = Array.from(droppedFiles).reduce(
          (acc, file) => {
            acc[file.name] = {
              episodeTitle: file.name.replace(/\.[^/.]+$/, ""),
              season: 1,
            };
            return acc;
          },
          {} as Record<string, VideoMetadata>,
        );

        onUpload(Array.from(droppedFiles), filesMetadata);
      }
    }

    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-gray-500 p-4 transition-all ${isDragging && !fileErrorMessage ? "border-gray-200 bg-gray-600" : isDragging && fileErrorMessage ? "border-primary bg-gray-600" : "border-gray-500"}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={inputRef}
        multiple={multiple}
        onChange={handleFileInput}
        hidden
      />
      {!fileErrorMessage ? (
        <>
          <IoCloudUpload size={32} />
          <p className="leading-none">Upload </p>
        </>
      ) : (
        <>
          <IoBug size={32} fill={colors.primary} />
          <p className="text-primary! leading-none">{fileErrorMessage}</p>
        </>
      )}
    </div>
  );
}
