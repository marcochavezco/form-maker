import { SendIcon } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

function PublishFormBtn() {
  return (
    <Button className='gap-2 text-white bg-gradient-to-r from-teal-400 to-sky-600'>
      <SendIcon className='h-6 w-6' />
      Publish
    </Button>
  );
}

export default PublishFormBtn;
