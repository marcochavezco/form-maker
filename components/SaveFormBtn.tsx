import React from 'react';
import { Button } from './ui/button';
import { SaveIcon } from 'lucide-react';

function SaveFormBtn() {
  return (
    <Button variant={'outline'} className='gap-2'>
      <SaveIcon className='h-6 w-6' />
      Save
    </Button>
  );
}

export default SaveFormBtn;
