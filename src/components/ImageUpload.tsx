import { useState } from 'react';

interface FileProps {
  onInput: any;
}

const ImageUpload = (props: FileProps) => {
  const [previewImage, setPreviewImage] = useState<string>('');

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files as FileList;
    setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
    props.onInput(selectedFiles[0]);
  };

  return (
    <div>
      <div className="row">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4 file:rounded-md
        file:border-0 file:text-sm file:font-semibold
        hover:file:bg-primary hover:file:text-secondary
        file:bg-secondary file:text-primary"
              onChange={selectImage}
            />
          </label>
        </div>
      </div>

      {previewImage && (
        <div className='pt-5'>
          <img
            src={previewImage}
            width={150}
            height={150}
            className={
              'h-auto w-[150px] object-cover transition-all hover:scale-105 aspect-square'
            }
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
