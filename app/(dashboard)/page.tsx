import {
  ArrowRightIcon,
  ArrowUpToLineIcon,
  Edit,
  EyeIcon,
  InboxIcon,
  PercentIcon,
} from 'lucide-react';
import { GetForms, GetFormStats } from '../../actions/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Suspense } from 'react';
import { Separator } from '@/components/ui/separator';
import CreateFormBtn from '@/components/CreateFormBtn';
import { formSchemaType } from '@/db/schemas/forms';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='container p-4'>
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className='my-6' />
      <h2 className='text-4xl font-bold  col-span-2'>Your Forms</h2>
      <Separator className='my-6' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <CreateFormBtn />
        <Suspense
          fallback={[...Array(3)].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();

  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

function StatsCards(props: StatsCardsProps) {
  const { data, loading } = props;

  return (
    <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
      <StatsCard
        title='Total Visits'
        icon={<EyeIcon />}
        helperText='Total visits to the form'
        value={data?.visits.toLocaleString() || ''}
        loading={loading}
        className='shadow-md shadow-blue-600'
      />
      <StatsCard
        title='Total Submissions'
        icon={<InboxIcon />}
        helperText='Total submissions to the form'
        value={data?.submissions.toLocaleString() || ''}
        loading={loading}
        className='shadow-md shadow-yellow-600'
      />
      <StatsCard
        title='Submissions Rate'
        icon={<PercentIcon />}
        helperText='Submission rate of the form'
        value={data?.submissionRate.toLocaleString() + '%' || ''}
        loading={loading}
        className='shadow-md shadow-green-600'
      />
      <StatsCard
        title='Bounce Rate'
        icon={<ArrowUpToLineIcon />}
        helperText='Bounce rate of the form'
        value={data?.bounceRate.toLocaleString() + '%' || ''}
        loading={loading}
        className='shadow-md shadow-red-600'
      />
    </div>
  );
}

function StatsCard({
  title,
  icon,
  helperText,
  value,
  loading,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  helperText: string;
  value: string;
  loading: boolean;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {loading && (
            <Skeleton>
              <span className='opacity-0'>0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className='text-xs text-muted-foreground pt-1'>{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return <Skeleton className='boder-2 border-primary/20 h-[190px] w-full' />;
}

async function FormCards() {
  const forms = await GetForms();

  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}

const FormCard = ({ form }: { form: formSchemaType }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 justify-between'>
          <span className='truncate font-bold'>{form.name}</span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant={'destructive'}>Draft</Badge>}
        </CardTitle>
        <CardDescription className='flex items-center justify-between text-muted-foreground text-sm'>
          {formatDistance(new Date(form.createdAt + ' UTC'), new Date(), {
            addSuffix: true,
          })}
          {!form.published && (
            <span className='flex items-center gap-2'>
              <EyeIcon className='text-muted-foreground' />
              <span>{form.visits.toLocaleString()}</span>
              <InboxIcon className='text-muted-foreground' />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[20px] truncate text-sm text-muted-foreground'>
        {form.description || 'No description'}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className='w-full mt-2 text-md gap-4'>
            <Link href={`/forms/${form.id}`}>
              View Submissions <ArrowRightIcon />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button
            asChild
            variant={'secondary'}
            className='w-full mt-2 text-md gap-4'
          >
            <Link href={`/builder/${form.id}`}>
              Edit Form <Edit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
