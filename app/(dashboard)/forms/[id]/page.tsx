import { GetFormById } from '@/actions/form';
import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import { formType } from '@/db/schemas/forms';
import React from 'react';
import { StatsCard } from '../../page';
import {
  ArrowUpToLineIcon,
  EyeIcon,
  InboxIcon,
  PercentIcon,
} from 'lucide-react';

async function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form: formType = await GetFormById(Number(id));

  if (!form) {
    throw new Error('Form not found');
  }

  const { visits, submissions } = form;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  let bounceRate = 0;

  if (submissionRate > 0) {
    bounceRate = 100 - submissionRate;
  }

  return (
    <>
      <div className='py-10 flex flex-col items-center'>
        <div className='flex justify-between container'>
          <h1 className='text-4xl font-bold truncate'>{form.name}</h1>
          <VisitBtn shareUrl={form.shareURL} />
        </div>
        <div className='py-4 border-b border-muted container'>
          <div className=' flex gap-2 items-center justify-between'>
            <FormLinkShare shareUrl={form.shareURL} />
          </div>
        </div>
        <div className='w-full py-8 border-b border-muted gap-4 grid grid-cols-1 md: grid-cols-2 lg:grid-cols-4 container'>
          {' '}
          <StatsCard
            title='Total Visits'
            icon={<EyeIcon />}
            helperText='Total visits to the form'
            value={visits.toLocaleString() || ''}
            loading={false}
            className='shadow-md shadow-blue-600'
          />
          <StatsCard
            title='Total Submissions'
            icon={<InboxIcon />}
            helperText='Total submissions to the form'
            value={submissions.toLocaleString() || ''}
            loading={false}
            className='shadow-md shadow-yellow-600'
          />
          <StatsCard
            title='Submissions Rate'
            icon={<PercentIcon />}
            helperText='Submission rate of the form'
            value={submissionRate.toLocaleString() + '%' || ''}
            loading={false}
            className='shadow-md shadow-green-600'
          />
          <StatsCard
            title='Bounce Rate'
            icon={<ArrowUpToLineIcon />}
            helperText='Bounce rate of the form'
            value={bounceRate.toLocaleString() + '%' || ''}
            loading={false}
            className='shadow-md shadow-red-600'
          />
        </div>
        <div className='pt-10 flex flex-col container'>
          <SubmissionsTable id={form.id} />
        </div>
      </div>
    </>
  );
}

export default FormDetailPage;

function SubmissionsTable({ id }: { id: number }) {
  return (
    <>
      <h1 className='text-2xl font-bold my-4'>Submissions</h1>
    </>
  );
}
