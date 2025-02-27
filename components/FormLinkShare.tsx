'use client';

import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from '@/hooks/use-toast';
import { ShareIcon } from 'lucide-react';

function FormLinkShare({ shareUrl }: { shareUrl: string }) {
  const shareLink = `${window.location.origin}/submit/${shareUrl}`;

  return (
    <div className='flex flex-grow gap-4 items-center justify-between'>
      <Input value={shareLink} readOnly />
      <Button
        className='w-[250px]'
        onClick={() => {
          navigator.clipboard.writeText(shareLink);
          toast({
            title: 'Copied',
            description: 'Link copied to clipboard',
          });
        }}
      >
        <ShareIcon className='mr-2 h-6 w-6' />
        Share Link
      </Button>
    </div>
  );
}

export default FormLinkShare;
