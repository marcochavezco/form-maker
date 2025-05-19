import { GetFormById, GetFormSubmissions } from '@/actions/form';
import { ElementsType, FormElementInstance } from '@/components/FormElements';
import FormLinkShare from '@/components/FormLinkShare';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import VisitBtn from '@/components/VisitBtn';
import { formType } from '@/db/schemas/forms';
import {
  ArrowUpToLineIcon,
  EyeIcon,
  InboxIcon,
  PercentIcon,
} from 'lucide-react';
import { StatsCard } from '../../page';
import { formatDistance } from 'date-fns';
import { ReactNode } from 'react';

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

type Row = { [key: string]: string } & { submittedAt: Date };

async function SubmissionsTable({ id }: { id: number }) {
  const { form, submissions } = await GetFormSubmissions(id);

  if (!form) {
    throw new Error('Form not found');
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case 'TextField':
      case 'NumberField':
      case 'TextAreaField':
      case 'DateField':
      case 'SelectField':
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
      default:
        break;
    }
  });

  const rows: Row[] = [];
  submissions.forEach((submission) => {
    if (submission?.content) {
      const content = JSON.parse(submission.content);
      rows.push({
        ...content,
        submittedAt: submission?.createdAt,
      });
    }
  });

  return (
    <>
      <h1 className='text-2xl font-bold my-4'>Submissions</h1>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className='uppercase'>
                  {column.label}
                </TableHead>
              ))}
              <TableHead className='text-muted-foreground text-right uppercase'>
                Submited at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className='text-muted-foreground text-right'>
                  {formatDistance(
                    new Date(row.submittedAt + ' UTC'),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  const node: ReactNode = value;
  return <TableCell>{node}</TableCell>;
}
