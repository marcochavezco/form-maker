import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { SaveIcon } from 'lucide-react';
import useDesigner from './hooks/useDesigner';
import { toast } from '@/hooks/use-toast';
import { UpdateFormContent } from '@/actions/form';
import { ImSpinner2 } from 'react-icons/im';

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const JSONElements = JSON.stringify(elements);
      await UpdateFormContent(id, JSONElements);
      toast({
        title: 'Success',
        description: 'Form saved successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save form',
        variant: 'destructive',
      });
    }
  };
  return (
    <Button
      variant={'outline'}
      className='gap-2'
      disabled={loading}
      onClick={() => startTransition(updateFormContent)}
    >
      <SaveIcon className='h-6 w-6' />
      Save
      {loading && <ImSpinner2 className='animate-spin' />}
    </Button>
  );
}

export default SaveFormBtn;
