'use client';

import { Check, Loader2 } from 'lucide-react';
import { unsplash } from '@/lib/unsplash';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { defaultImgs } from '@/constants/images';
import Link from 'next/link';
import { FormErrors } from './form-errors';

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>(defaultImgs);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ['317099'],
          count: 9,
        });

        if (result && result.response) {
          const responseImages = result.response as Array<Record<string, any>>;
          setImages(responseImages);
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImgs);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              'cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted',
              pending && 'cursor-auto opacity-50 hover:opacity-50'
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id); // 直接在image的div上設定選擇的image.id
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectedImageId === image.id} // 當選擇的image.id === image.id
              disabled={pending}
              // 傳遞多個 value 的寫法，傳到 database 用
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            <Image
              src={image.urls.thumb}
              alt="unsplash image"
              className="object-cover rounded-sm"
              fill
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {selectedImageId === image.id && (
              <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-black/30">
                {/* 勾勾標誌 */}
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate
               text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
