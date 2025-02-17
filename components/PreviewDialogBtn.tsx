import React from 'react';
import { Button } from './ui/button';
import { EyeIcon } from 'lucide-react';

function PreviewDialogBtn() {
  return (
    <Button variant={'outline'} className='gap-2'>
      <EyeIcon className='h-6 w-6' />
      Preview
    </Button>
  );
}

export default PreviewDialogBtn;
